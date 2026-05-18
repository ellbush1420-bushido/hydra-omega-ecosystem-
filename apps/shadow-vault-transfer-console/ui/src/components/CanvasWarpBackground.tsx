import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  v: number
  a: number
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function CanvasWarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId = 0
    const stars: Star[] = []

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const { innerWidth, innerHeight } = window
      canvas.width = Math.floor(innerWidth * dpr)
      canvas.height = Math.floor(innerHeight * dpr)
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const targetStars = Math.max(80, Math.min(160, Math.floor((innerWidth * innerHeight) / 14000)))
      while (stars.length < targetStars) {
        stars.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          r: 0.4 + Math.random() * 1.6,
          v: 6 + Math.random() * 26,
          a: 0.15 + Math.random() * 0.55,
        })
      }
      stars.length = targetStars
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const renderFrame = (timeMs: number) => {
      const t = timeMs / 1000
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      const g = ctx.createRadialGradient(w * 0.15, h * 0.08, 10, w * 0.15, h * 0.08, Math.max(w, h) * 0.9)
      g.addColorStop(0, 'rgba(192, 132, 252, 0.08)')
      g.addColorStop(0.45, 'rgba(56, 189, 248, 0.05)')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (const s of stars) {
        s.x -= s.v * 0.12
        s.y += Math.sin(t * 0.35 + s.x * 0.003) * 0.08
        if (s.x < -20) s.x = w + 20
        if (s.y < -20) s.y = h + 20
        if (s.y > h + 20) s.y = -20

        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${s.a})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      const lineStep = Math.max(44, Math.min(64, Math.floor(w / 22)))
      const pointStep = 28
      const amp = Math.max(6, Math.min(18, w / 90))

      ctx.save()
      ctx.globalAlpha = 0.24
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.22)'

      for (let y = -lineStep; y <= h + lineStep; y += lineStep) {
        ctx.beginPath()
        for (let x = -pointStep; x <= w + pointStep; x += pointStep) {
          const dx = x - w * 0.5
          const dy = y - h * 0.35
          const d = Math.sqrt(dx * dx + dy * dy)
          const swirl = Math.sin(d * 0.012 - t * 0.75) * (amp * 0.55)
          const wave = Math.sin(x * 0.012 + t * 0.85) * (amp * 0.65)
          const warp = swirl + wave
          const yy = y + warp
          if (x === -pointStep) ctx.moveTo(x, yy)
          else ctx.lineTo(x, yy)
        }
        ctx.stroke()
      }

      ctx.globalAlpha = 0.18
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)'
      for (let x = -lineStep; x <= w + lineStep; x += lineStep) {
        ctx.beginPath()
        for (let y = -pointStep; y <= h + pointStep; y += pointStep) {
          const dx = x - w * 0.52
          const dy = y - h * 0.4
          const d = Math.sqrt(dx * dx + dy * dy)
          const swirl = Math.cos(d * 0.011 + t * 0.7) * (amp * 0.5)
          const wave = Math.cos(y * 0.012 - t * 0.8) * (amp * 0.7)
          const warp = swirl + wave
          const xx = x + warp
          if (y === -pointStep) ctx.moveTo(xx, y)
          else ctx.lineTo(xx, y)
        }
        ctx.stroke()
      }

      ctx.restore()
      animationFrameId = window.requestAnimationFrame(renderFrame)
    }

    if (prefersReducedMotion()) {
      renderFrame(0)
    } else {
      animationFrameId = window.requestAnimationFrame(renderFrame)
    }

    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="warpCanvas" aria-hidden="true" />
}

