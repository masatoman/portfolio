"use client"
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react"

type Props = {
  as?: ElementType
  className?: string
  children: ReactNode
  delay?: number
}

/**
 * Fade-in-from-bottom on scroll, but safe by default.
 *
 * Important: do NOT apply the `reveal` (opacity:0) class until React has
 * mounted on the client. Otherwise SSR + JS-disabled or
 * IntersectionObserver-misfire users see invisible content.
 *
 * Flow:
 *   - SSR / first paint: no `reveal` class → content is fully visible.
 *   - After mount: add `reveal` (becomes opacity 0), observer flips it
 *     to `is-visible` as soon as the element is anywhere near the viewport.
 *   - If anything fails, content was already visible from SSR.
 */
export function Reveal({ as: As = "div", className = "", children, delay = 0 }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    setArmed(true)
    const el = ref.current
    if (!el) return

    // If the element is already in (or above) the viewport at mount time,
    // skip the observer dance entirely — show it immediately.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      const id = window.setTimeout(() => el.classList.add("is-visible"), Math.min(delay, 80))
      return () => window.clearTimeout(id)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            window.setTimeout(() => e.target.classList.add("is-visible"), delay)
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.01 },
    )
    io.observe(el)

    // Belt-and-suspenders fallback: after 1.5s show it no matter what.
    const fallback = window.setTimeout(() => el.classList.add("is-visible"), 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [delay])

  return (
    <As ref={ref as never} className={`${armed ? "reveal" : ""} ${className}`.trim()}>
      {children}
    </As>
  )
}
