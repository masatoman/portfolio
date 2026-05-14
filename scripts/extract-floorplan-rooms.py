#!/usr/bin/env python3
"""
Extract room hotspots from a floor plan image via Tesseract OCR.

Usage:
  scripts/extract-floorplan-rooms.py <image-path> [--out <ts-path>]

The script runs Japanese OCR (PSM 11 sparse text), filters words against a
known room-name vocabulary (車庫/玄関/UB/床下収納/居間/...), merges adjacent
fragments into single labels, and writes a TypeScript module that the
demo (`/local-business/drawing-quick-viewer`) imports as its data source.

The point: switching the source image and re-running this script regenerates
all hotspot coordinates automatically — no hand-tuning of `rect` values.

Requires: tesseract + jpn language pack (brew install tesseract-lang),
          python3 + Pillow.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

# Vocabulary of room names worth detecting on a Japanese floor plan or
# 床伏図. Each entry maps a canonical name → display details.
ROOM_VOCAB: dict[str, dict] = {
    "車庫": {
        "id": "garage",
        "displayName": "車庫",
        "aliases": ["ガレージ", "GARAGE"],
        "swatch": "#a855f7",
        "defaultNotes": [
            {"label": "床仕上", "value": "金ゴテ仕上 (勾配 1/100)"},
            {"label": "土間コン厚", "value": "150mm (ワイヤーメッシュ φ6 @150)"},
            {"label": "開口部", "value": "シャッター W2,730mm × H2,200mm"},
        ],
    },
    "玄関": {
        "id": "genkan",
        "displayName": "玄関",
        "aliases": ["エントランス", "ENTRANCE", "玄 関"],
        "swatch": "#10b981",
        "defaultNotes": [
            {"label": "上り框", "value": "H=200mm (ヒノキ 集成)"},
            {"label": "玄関ドア", "value": "W910 × H2,200 (断熱 K1.6)"},
            {"label": "土間仕上", "value": "300角タイル (LIXIL アスペッタ)"},
        ],
    },
    "UB": {
        "id": "bath",
        "displayName": "浴室",
        "aliases": ["U/B", "UNIT BATH", "ユニットバス", "浴室", "AUIB"],
        "swatch": "#0e7490",
        "defaultNotes": [
            {"label": "サイズ", "value": "1216 (1,820 × 1,365mm)"},
            {"label": "メーカー", "value": "TOTO サザナ Hシリーズ"},
            {"label": "防水", "value": "立ち上がり H=400mm"},
        ],
    },
    "床下収納": {
        "id": "storage",
        "displayName": "床下収納",
        "aliases": ["床下", "STORAGE", "床 下 収 納"],
        "swatch": "#d97706",
        "defaultNotes": [
            {"label": "蓋寸法", "value": "610 × 610mm"},
            {"label": "床下高さ", "value": "445mm"},
            {"label": "本体", "value": "城東 ステン製 気密タイプ"},
        ],
    },
    "居間": {
        "id": "ldk",
        "displayName": "居間",
        "aliases": ["LDK", "リビング", "LIVING"],
        "swatch": "#06b6d4",
        "defaultNotes": [
            {"label": "床根太", "value": "204 SPF 2級 / @455"},
            {"label": "大引", "value": "404 防腐 @910 / 鋼製束 @910"},
            {"label": "床合板", "value": "構造用合板 厚24mm 2級"},
        ],
    },
    "キッチン": {
        "id": "kitchen",
        "displayName": "キッチン",
        "aliases": ["KITCHEN", "DK", "台所"],
        "swatch": "#ec4899",
        "defaultNotes": [
            {"label": "I型 / II型", "value": "II型 (アイランド)"},
            {"label": "コンロ", "value": "IH 3口 (200V)"},
            {"label": "換気扇", "value": "レンジフード Φ150"},
        ],
    },
    "トイレ": {
        "id": "toilet",
        "displayName": "トイレ",
        "aliases": ["TOILET", "WC", "便所"],
        "swatch": "#f59e0b",
        "defaultNotes": [
            {"label": "便器", "value": "TOTO ネオレスト LS"},
            {"label": "手洗", "value": "カウンタ一体 (W400)"},
            {"label": "床材", "value": "クッションフロア 抗菌仕様"},
        ],
    },
    "寝室": {
        "id": "bedroom",
        "displayName": "寝室",
        "aliases": ["BEDROOM", "BED ROOM", "BED"],
        "swatch": "#8b5cf6",
        "defaultNotes": [
            {"label": "床面積", "value": "(図面より計測)"},
            {"label": "床材", "value": "オーク無垢 15mm"},
            {"label": "コンセント", "value": "壁付 4箇所"},
        ],
    },
    "和室": {
        "id": "tatami",
        "displayName": "和室",
        "aliases": ["JAPANESE"],
        "swatch": "#84cc16",
        "defaultNotes": [
            {"label": "畳", "value": "本間サイズ"},
            {"label": "床の間", "value": "あり"},
            {"label": "押入", "value": "中段あり"},
        ],
    },
}


def run_tesseract_tsv(image_path: Path) -> str:
    """Run Tesseract with PSM 11 (sparse text) + Japanese, return TSV stdout."""
    out_base = image_path.parent / f".ocr-{image_path.stem}"
    cmd = [
        "tesseract",
        str(image_path),
        str(out_base),
        "-l",
        "jpn",
        "--psm",
        "11",
        "tsv",
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    tsv_path = out_base.with_suffix(".tsv")
    text = tsv_path.read_text(encoding="utf-8")
    tsv_path.unlink(missing_ok=True)
    return text


def parse_tsv_words(tsv_text: str) -> list[dict]:
    """Parse Tesseract TSV into a list of {text, x, y, w, h, conf} for word rows."""
    lines = tsv_text.strip().split("\n")
    if not lines:
        return []
    header = lines[0].split("\t")
    idx = {name: i for i, name in enumerate(header)}
    words: list[dict] = []
    for line in lines[1:]:
        parts = line.split("\t")
        if len(parts) < 12:
            continue
        # Tesseract emits multiple levels (page, block, par, line, word).
        # Word-level rows have level=5.
        if parts[idx["level"]] != "5":
            continue
        text = parts[idx["text"]].strip()
        if not text:
            continue
        try:
            x = int(parts[idx["left"]])
            y = int(parts[idx["top"]])
            w = int(parts[idx["width"]])
            h = int(parts[idx["height"]])
            conf = float(parts[idx["conf"]])
        except (KeyError, ValueError):
            continue
        words.append({"text": text, "x": x, "y": y, "w": w, "h": h, "conf": conf})
    return words


def merge_adjacent_words(words: list[dict], gap_px: int = 40) -> list[dict]:
    """Merge horizontally adjacent word fragments into single tokens.

    Tesseract often splits "玄関" into "玄" + "関" or "床下収納" into "床下" + "収納".
    Words inside a y-band roughly the height of one character are sorted
    left-to-right and concatenated when within `gap_px` horizontal distance,
    preserving Japanese reading order.
    """
    if not words:
        return []
    avg_h = sum(w["h"] for w in words) / len(words)
    bucket_size = max(avg_h, 12)

    # Bucket words by their vertical center, then sort left-to-right within
    # each bucket. Identical-bucket words read in normal Japanese order.
    def sort_key(w: dict) -> tuple[int, int]:
        center_y = w["y"] + w["h"] / 2
        return (int(center_y // bucket_size), w["x"])

    sorted_words = sorted(words, key=sort_key)

    merged: list[dict] = []
    for w in sorted_words:
        if merged:
            last = merged[-1]
            last_cy = last["y"] + last["h"] / 2
            this_cy = w["y"] + w["h"] / 2
            same_row = abs(this_cy - last_cy) < max(w["h"], last["h"]) * 0.6
            # `close_x` works whether the new word is to the right (positive
            # gap) or partially overlaps the previous one (negative gap).
            close_x = (w["x"] - (last["x"] + last["w"])) <= gap_px
            if same_row and close_x:
                # Build merged text in left-to-right reading order regardless
                # of which word arrived first in the iteration.
                if w["x"] >= last["x"]:
                    new_text = last["text"] + w["text"]
                else:
                    new_text = w["text"] + last["text"]
                new_x = min(last["x"], w["x"])
                new_y = min(last["y"], w["y"])
                new_x1 = max(last["x"] + last["w"], w["x"] + w["w"])
                new_y1 = max(last["y"] + last["h"], w["y"] + w["h"])
                merged[-1] = {
                    "text": new_text,
                    "x": new_x,
                    "y": new_y,
                    "w": new_x1 - new_x,
                    "h": new_y1 - new_y,
                    "conf": (last["conf"] + w["conf"]) / 2,
                }
                continue
        merged.append(dict(w))
    return merged


def match_room(token: str) -> str | None:
    """Return the canonical room name if `token` matches any vocab entry."""
    norm = token.replace(" ", "").upper()
    for name, info in ROOM_VOCAB.items():
        candidates = [name] + info["aliases"]
        for cand in candidates:
            cand_norm = cand.replace(" ", "").upper()
            if cand_norm and cand_norm in norm:
                return name
            if name in token:
                return name
    return None


def extract_hotspots(image_path: Path) -> dict:
    """Run OCR and produce a hotspot data dict suitable for the TS module."""
    img = Image.open(image_path)
    iw, ih = img.size
    tsv = run_tesseract_tsv(image_path)
    words = parse_tsv_words(tsv)
    merged = merge_adjacent_words(words)

    # Match against room vocab and dedupe by canonical room name (keep
    # highest-confidence match if multiple hits).
    matches: dict[str, dict] = {}
    for w in merged:
        canonical = match_room(w["text"])
        if not canonical:
            continue
        existing = matches.get(canonical)
        if existing is None or w["conf"] > existing["conf"]:
            matches[canonical] = {**w, "canonical": canonical}

    # Build hotspots — rect = label bbox expanded slightly so the highlight
    # is visible without obscuring the underlying drawing.
    hotspots = []
    for canonical, m in matches.items():
        info = ROOM_VOCAB[canonical]
        # Expand label bbox by 60% horizontally and 100% vertically as a
        # visible click target. Label center stays the same.
        cx = m["x"] + m["w"] / 2
        cy = m["y"] + m["h"] / 2
        rect_w = max(m["w"] * 1.6, iw * 0.04)
        rect_h = max(m["h"] * 2.0, ih * 0.04)
        rect_x = cx - rect_w / 2
        rect_y = cy - rect_h / 2
        hotspots.append(
            {
                "id": f"hs-{info['id']}",
                "roomName": info["displayName"],
                "aliases": info["aliases"],
                "x": round(cx / iw * 100, 2),
                "y": round(cy / ih * 100, 2),
                "rect": {
                    "x": round(rect_x / iw * 100, 2),
                    "y": round(rect_y / ih * 100, 2),
                    "width": round(rect_w / iw * 100, 2),
                    "height": round(rect_h / ih * 100, 2),
                },
                "notes": info["defaultNotes"],
                "swatch": info["swatch"],
                # Raw OCR data for transparency
                "ocr": {
                    "text": m["text"],
                    "confidence": round(m["conf"], 1),
                    "bbox": {"x": m["x"], "y": m["y"], "w": m["w"], "h": m["h"]},
                },
            }
        )

    hotspots.sort(key=lambda h: (h["y"], h["x"]))

    return {
        "imageWidth": iw,
        "imageHeight": ih,
        "hotspots": hotspots,
    }


TS_TEMPLATE = """// AUTO-GENERATED by scripts/extract-floorplan-rooms.py
// Do not edit by hand — regenerate by running:
//   python3 scripts/extract-floorplan-rooms.py <image-path>
//
// Source image: {image_path}
// Image natural size: {iw} × {ih}
// Detected rooms: {room_count}

import type {{ DrawingHotspot }} from "./drawing-quick-viewer"

export const detectedImageSize = {{ width: {iw}, height: {ih} }} as const

export const detectedHotspots: DrawingHotspot[] = {hotspots_json}
"""


def write_ts_module(image_rel_path: str, data: dict, out_path: Path) -> None:
    hotspots_clean = [
        {k: v for k, v in h.items() if k != "ocr"}  # Drop OCR debug info
        for h in data["hotspots"]
    ]
    hotspots_json = json.dumps(hotspots_clean, ensure_ascii=False, indent=2)
    text = TS_TEMPLATE.format(
        image_path=image_rel_path,
        iw=data["imageWidth"],
        ih=data["imageHeight"],
        room_count=len(data["hotspots"]),
        hotspots_json=hotspots_json,
    )
    out_path.write_text(text, encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", help="Path to floor-plan image (PNG/JPG)")
    parser.add_argument(
        "--out",
        default="lib/local-business/drawing-quick-viewer.detected.ts",
        help="Output TypeScript module path (relative to repo root)",
    )
    args = parser.parse_args(argv)

    image_path = Path(args.image).resolve()
    if not image_path.exists():
        print(f"Image not found: {image_path}", file=sys.stderr)
        return 1

    repo_root = Path(__file__).resolve().parent.parent
    out_path = (repo_root / args.out).resolve()

    print(f"OCR running on {image_path.name}...")
    data = extract_hotspots(image_path)
    print(f"  → image size: {data['imageWidth']} × {data['imageHeight']}")
    print(f"  → detected {len(data['hotspots'])} room(s):")
    for h in data["hotspots"]:
        print(
            f"      • {h['roomName']:<12} center=({h['x']:5.1f}%,{h['y']:5.1f}%) "
            f"OCR='{h['ocr']['text']}' conf={h['ocr']['confidence']}"
        )

    image_rel = image_path.relative_to(repo_root) if repo_root in image_path.parents else image_path
    write_ts_module(str(image_rel), data, out_path)
    print(f"  → wrote {out_path.relative_to(repo_root)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
