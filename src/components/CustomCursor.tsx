import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const pos = useRef({ cx: 0, cy: 0, mx: 0, my: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      const p = pos.current
      p.cx += (p.mx - p.cx) * 0.12
      p.cy += (p.my - p.cy) * 0.12
      if (ring.current) {
        ring.current.style.left = p.cx + 'px'
        ring.current.style.top = p.cy + 'px'
      }
      if (dot.current) {
        dot.current.style.left = p.mx + 'px'
        dot.current.style.top = p.my + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    const addHoverListeners = () => {
      const hoverEls = document.querySelectorAll('a, button, .cursor-hover')
      const enter = () => ring.current?.classList.add('!w-14', '!h-14', '!border-coral', '!opacity-60')
      const leave = () => ring.current?.classList.remove('!w-14', '!h-14', '!border-coral', '!opacity-60')
      hoverEls.forEach((el) => {
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
      })
      return () => {
        hoverEls.forEach((el) => {
          el.removeEventListener('mouseenter', enter)
          el.removeEventListener('mouseleave', leave)
        })
      }
    }

    const cleanup = addHoverListeners()
    const observer = new MutationObserver(() => {
      cleanup()
      addHoverListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      cleanup()
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        className="fixed top-0 left-0 w-6 h-6 border border-text-muted rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color,opacity] duration-300 mix-blend-difference hidden md:block"
      />
      <div
        ref={dot}
        className="fixed top-0 left-0 w-1 h-1 bg-coral rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
    </>
  )
}
