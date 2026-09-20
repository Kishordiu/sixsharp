import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '@/app/providers/ThemeProvider'

interface OrbData {
  position: THREE.Vector3
  radius: number
  speed: number
  offset: number
}

export function LiquidOrbsBackground() {
  const groupRef = useRef<THREE.Group>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Generate random orbs
  const orbs = useMemo(() => {
    const temp: OrbData[] = []
    for (let i = 0; i < 8; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5 - 2
        ),
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.2 + 0.1,
        offset: Math.random() * Math.PI * 2,
      })
    }
    return temp
  }, [])

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return
    const time = clock.getElapsedTime()
    
    // Slow rotation of the entire group based on mouse and time
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.1, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.1 + time * 0.05, 0.05)

    // Bobbing motion for individual orbs
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const data = orbs[i]
        if (data) {
          child.position.y = data.position.y + Math.sin(time * data.speed + data.offset) * 1.5
          child.position.x = data.position.x + Math.cos(time * data.speed * 0.8 + data.offset) * 0.5
        }
      }
    })
  })

  // Light mode colors: Cream/Peach base, gold/peach orbs
  // Dark mode colors: Deep dark blue base, blue/cyan orbs
  const planeColor = isDark ? "#020617" : "#FDFBF7"
  const dirLight1Color = isDark ? "#4f46e5" : "#F59E0B"
  const dirLight2Color = isDark ? "#06b6d4" : "#F43F5E"
  const orbColor = isDark ? "#3b82f6" : "#FCD34D"
  const orbEmissive = isDark ? "#1e3a8a" : "#FCA5A5"

  return (
    <>
      <ambientLight intensity={isDark ? 0.2 : 0.6} />
      <directionalLight position={[10, 10, 10]} intensity={isDark ? 1 : 0.8} color={dirLight1Color} />
      <directionalLight position={[-10, -10, -10]} intensity={isDark ? 0.5 : 0.3} color={dirLight2Color} />
      
      {/* Background Plane */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color={planeColor} />
      </mesh>

      <group ref={groupRef}>
        {orbs.map((orb, i) => (
          <mesh key={i} position={orb.position}>
            <sphereGeometry args={[orb.radius, 64, 64]} />
            <meshPhysicalMaterial
              color={orbColor}
              emissive={orbEmissive}
              emissiveIntensity={isDark ? 0.2 : 0.1}
              roughness={0.1}
              metalness={0.1}
              transmission={0.9}
              thickness={1.5}
              ior={1.4}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
        ))}
      </group>
    </>
  )
}
