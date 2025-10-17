"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 })
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number }>>([])

  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })

      const newParticles = [...Array(20)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        duration: Math.random() * 10 + 10,
      }))
      setParticles(newParticles)

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (!mounted) {
    return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_40%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.15),transparent_40%)] animate-pulse [animation-delay:1s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(96,165,250,0.1),transparent_60%)] animate-pulse [animation-delay:2s]" />
      </>
    )
  }

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_40%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.15),transparent_40%)] animate-pulse [animation-delay:1s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(96,165,250,0.1),transparent_60%)] animate-pulse [animation-delay:2s]" />

      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary/20"
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              y: [null, Math.random() * dimensions.height],
              x: [null, Math.random() * dimensions.width],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </>
  )
}
