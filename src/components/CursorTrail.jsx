import { useEffect, useRef } from 'react'
import { useCursor } from '../context/CursorContext'
import { useCanvas } from '../context/CanvasContext'

const MAX_POINTS = 16
const BALL_RADIUS = 5
const EASE = 0.15

export default function CursorTrail() {
  const canvasRef = useRef(null)
  const { visible } = useCursor()
  const { containerRef } = useCanvas()
  const suppressedRef = useRef(visible)

  useEffect(() => {
    suppressedRef.current = visible
  }, [visible])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    let width = container.clientWidth
    let height = container.clientHeight
    const ball = { x: width / 2, y: height / 2 }
    const target = { x: ball.x, y: ball.y }
    const points = []
    let rafId

    function resize() {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function handleMove(e) {
      const rect = container.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
    }

    function tick() {
      ball.x += (target.x - ball.x) * EASE
      ball.y += (target.y - ball.y) * EASE

      ctx.clearRect(0, 0, width, height)

      if (suppressedRef.current) {
        points.length = 0
        rafId = requestAnimationFrame(tick)
        return
      }

      points.push({ x: ball.x, y: ball.y })
      if (points.length > MAX_POINTS) points.shift()

      const color =
        document.documentElement.getAttribute('data-theme') === 'dark' ? '255, 255, 255' : '10, 10, 10'

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
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    container.addEventListener('mousemove', handleMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      observer.disconnect()
      container.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [containerRef])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9000]" />
}
