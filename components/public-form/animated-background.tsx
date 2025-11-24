"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 })
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{
    x: number
    y: number 
    duration: number
    size: number
    type: 'circle' | 'blob' | 'star' | 'heart'
    color: string
    delay: number
  }>>([])

  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      const updateDimensions = () => {
        setDimensions({ 
          width: window.innerWidth, 
          height: window.innerHeight 
        })
      }

      const generateParticles = () => {
        const particleCount = Math.min(25, Math.floor(window.innerWidth / 50))
        const colors = [
          'rgba(147, 197, 253, 0.4)',  // light blue
          'rgba(216, 180, 254, 0.4)',  // light purple
          'rgba(253, 164, 175, 0.4)',  // light pink
          'rgba(134, 239, 172, 0.4)',  // light green
          'rgba(253, 230, 138, 0.4)',  // light yellow
        ]
        
        const types: Array<'circle' | 'blob' | 'star' | 'heart'> = ['circle', 'blob', 'star', 'heart']
        
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          duration: Math.random() * 15 + 15,
          size: Math.random() * 12 + 8,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 5
        }))
        setParticles(newParticles)
      }

      updateDimensions()
      generateParticles()

      const handleResize = () => {
        updateDimensions()
        generateParticles()
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const renderParticleShape = (particle: typeof particles[0]) => {
    const baseStyle = {
      width: particle.size,
      height: particle.size,
      background: particle.color,
    }

    switch (particle.type) {
      case 'circle':
        return <div className="rounded-full" style={baseStyle} />
      case 'blob':
        return (
          <div 
            className="rounded-[40%]"
            style={{
              ...baseStyle,
              borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            }}
          />
        )
      case 'star':
        return (
          <div 
            className="relative"
            style={baseStyle}
          >
            <div 
              className="absolute inset-0 bg-current"
              style={{
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              }}
            />
          </div>
        )
      case 'heart':
        return (
          <div 
            className="relative"
            style={baseStyle}
          >
            <div 
              className="absolute inset-0 bg-current"
              style={{
                clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")'
              }}
            />
          </div>
        )
      default:
        return <div className="rounded-full" style={baseStyle} />
    }
  }

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30" />
        
        {/* Loading Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Static Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/15 to-yellow-200/15 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-green-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40">
      {/* Animated Gradient Waves */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Large Floating Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200/10 to-purple-300/10 rounded-full blur-2xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-pink-200/10 to-yellow-200/10 rounded-full blur-2xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-green-200/5 to-blue-200/5 rounded-full blur-2xl"
        animate={{
          y: [0, -15, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              rotate: Math.random() * 360
            }}
            animate={{
              y: [
                particle.y,
                particle.y - Math.random() * 100 - 50,
                particle.y + Math.random() * 50,
                particle.y - Math.random() * 80
              ],
              x: [
                particle.x,
                particle.x + Math.random() * 100 - 50,
                particle.x - Math.random() * 80,
                particle.x + Math.random() * 60
              ],
              scale: [0, 1, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              filter: 'blur(0.5px)',
            }}
          >
            {renderParticleShape(particle)}
          </motion.div>
        ))}
      </div>

      {/* Floating Bubbles */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-6 h-6 bg-blue-300/30 rounded-full"
        animate={{
          y: [0, -100, 0],
          x: [0, 50, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-pink-300/30 rounded-full"
        animate={{
          y: [0, 80, 0],
          x: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 100, 100, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 100, 100, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Sparkle Effects */}
      <motion.div
        className="absolute top-40 right-40 w-2 h-2 bg-yellow-300 rounded-full"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 3
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-40 w-2 h-2 bg-cyan-300 rounded-full"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5,
          delay: 1
        }}
      />
    </div>
  )
}