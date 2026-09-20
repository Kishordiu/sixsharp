import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  character: string
  color: string
  velocity: { x: number; y: number }
  life: number
  maxLife: number
  size: number
}

const CHARACTERS = '0123456789ABCDEF'
// SIXSHARP brand colors
const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#60a5fa', '#a78bfa']

export function MatrixCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const spawnParticle = (x: number, y: number) => {
      particles.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        character: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        velocity: {
          x: (Math.random() - 0.5) * 1,
          y: Math.random() * 2 + 1 // Fall downwards
        },
        life: 0,
        maxLife: Math.random() * 30 + 20,
        size: Math.random() * 10 + 10
      })
      
      // Limit max particles to prevent lag
      if (particles.current.length > 80) {
        particles.current.shift()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      spawnParticle(e.clientX, e.clientY)
      // spawn a second one for density
      spawnParticle(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY }
        spawnParticle(touch.clientX, touch.clientY)
        spawnParticle(touch.clientX, touch.clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i]
        
        ctx.font = `bold ${p.size}px monospace`
        
        // Fade out based on life
        const opacity = Math.max(0, 1 - (p.life / p.maxLife))
        
        // Add glowing effect
        ctx.shadowBlur = 15
        ctx.shadowColor = p.color
        
        // Ensure color has opacity using rgba or appending hex alpha properly
        const alphaHex = Math.floor(opacity * 255).toString(16).padStart(2, '0')
        ctx.fillStyle = `${p.color}${alphaHex}`
        
        ctx.fillText(p.character, p.x, p.y)
        
        p.x += p.velocity.x
        p.y += p.velocity.y
        p.life++
        
        // Optionally change character matrix style randomly
        if (Math.random() > 0.9) {
          p.character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
        }
      }
      
      // Remove dead particles
      particles.current = particles.current.filter(p => p.life < p.maxLife)
      
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[10000]"
      aria-hidden="true"
    />
  )
}
