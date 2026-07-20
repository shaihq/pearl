import { useEffect, useRef } from 'react'
import { useCursor } from '../context/CursorContext'

const MAX_POINTS = 16
const BALL_RADIUS = 5
const EASE = 0.15

export default function CursorTrail() {
  const canvasRef = useRef(null)
  const { visible } = useCursor()
  const suppressedRef = useRef(visible)

  useEffect(() => {
    suppressedRef.current = visible
  }, [visible])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const ball = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const target = { x: ball.x, y: ball.y }
    const points = []
    let rafId

    function resize() {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function handleMove(e) {
      target.x = e.clientX
      target.y = e.clientY
    }

    function tick() {
      ball.x += (target.x - ball.x) * EASE
      ball.y += (target.y - ball.y) * EASE

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (suppressedRef.current) {
        points.length = 0
        rafId = requestAnimationFrame(tick)
        return
      }

      points.push({ x: ball.x, y: ball.y })
      if (points.length > MAX_POINTS) points.shift()

      const color = document.documentElement.classList.contains('dark') ? '255, 255, 255' : '10, 10, 10'

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1]
        const p1 = points[i]
        const t = i / points.length
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.strokeStyle = `rgba(${color}, ${t * 0.18})`
        ctx.lineWidth = t * BALL_RADIUS * 0.7
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color}, 0.85)`
      ctx.shadowColor = `rgba(${color}, 0.3)`
      ctx.shadowBlur = 8
      ctx.fill()
      ctx.shadowBlur = 0

      rafId = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9000]" />
}
