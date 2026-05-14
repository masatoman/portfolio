"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Icosahedron, MeshDistortMaterial, Octahedron, Sparkles, TorusKnot } from "@react-three/drei"
import { Suspense, useRef, useEffect, useState } from "react"
import * as THREE from "three"

function Mouse({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useFrame(() => {
    const g = ref.current
    if (!g) return
    g.rotation.x += (target.current.y * 0.25 - g.rotation.x) * 0.04
    g.rotation.y += (target.current.x * 0.4 - g.rotation.y) * 0.04
  })
  return <group ref={ref}>{children}</group>
}

function CameraSetup() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 7)
  }, [camera])
  return null
}

function Scene() {
  const distortRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (distortRef.current) {
      distortRef.current.rotation.x = t * 0.15
      distortRef.current.rotation.y = t * 0.2
    }
  })

  return (
    <>
      <CameraSetup />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
      <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#22d3ee" />
      <pointLight position={[0, 0, 4]} intensity={0.8} color="#f472b6" />

      <Mouse>
        {/* central distort blob */}
        <mesh ref={distortRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.6, 24]} />
          <MeshDistortMaterial
            color="#7c83ff"
            distort={0.45}
            speed={2}
            roughness={0.15}
            metalness={0.6}
          />
        </mesh>

        {/* satellites */}
        <Float speed={1.6} rotationIntensity={1.2} floatIntensity={1.4}>
          <Octahedron args={[0.55]} position={[2.4, 1.2, -1]}>
            <meshStandardMaterial
              color="#22d3ee"
              roughness={0.1}
              metalness={0.85}
              emissive="#22d3ee"
              emissiveIntensity={0.25}
            />
          </Octahedron>
        </Float>
        <Float speed={1.2} rotationIntensity={1} floatIntensity={1.8}>
          <TorusKnot args={[0.4, 0.13, 90, 12]} position={[-2.6, -0.8, -1]}>
            <meshStandardMaterial
              color="#f472b6"
              roughness={0.2}
              metalness={0.9}
              emissive="#f472b6"
              emissiveIntensity={0.2}
            />
          </TorusKnot>
        </Float>
        <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
          <Icosahedron args={[0.45, 0]} position={[-1.7, 1.7, 1]}>
            <meshStandardMaterial color="#a78bfa" wireframe />
          </Icosahedron>
        </Float>
        <Float speed={1.4} rotationIntensity={1.4} floatIntensity={1.6}>
          <mesh position={[2.1, -1.5, 0.5]}>
            <torusGeometry args={[0.38, 0.12, 16, 64]} />
            <meshStandardMaterial
              color="#fbbf24"
              roughness={0.2}
              metalness={0.85}
              emissive="#fbbf24"
              emissiveIntensity={0.15}
            />
          </mesh>
        </Float>

        <Sparkles count={120} scale={[10, 6, 6]} size={3} speed={0.4} color="#a78bfa" />
        <Sparkles count={80} scale={[10, 6, 6]} size={2} speed={0.3} color="#22d3ee" />
      </Mouse>
    </>
  )
}

export function ThreeHero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <div className="absolute inset-0">
      <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
