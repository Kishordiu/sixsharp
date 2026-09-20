import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function MinimalOrganicBlob() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
          distort={0.4}
          speed={1.5}
          transmission={0.9}
          thickness={1.5}
          ior={1.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  )
}

export function GlobalLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 1200)
          return 100
        }
        return p + Math.random() * 8
      })
    }, 150)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50, filter: 'blur(10px)', transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#fdfbf7] via-[#f5f0e6] to-[#eae0d5]"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <Environment preset="studio" />
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={1} color="#e2e8f0" />
          
          <MinimalOrganicBlob />
          
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Canvas>
      </div>
      
      {/* Overlay UI */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full pointer-events-none mt-32">
        
        {/* Brand Name */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-serif text-[#0f172a] mb-6 tracking-tight"
        >
          SixSharp
        </motion.div>
        
        {/* Loader Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative w-16 h-16 flex items-center justify-center"
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 200" }}
              animate={{ strokeDasharray: `${(progress / 100) * 188} 200` }}
              transition={{ ease: "linear" }}
            />
          </svg>
          <span className="text-xs font-mono font-medium text-[#475569]">
            {Math.min(100, Math.floor(progress))}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
