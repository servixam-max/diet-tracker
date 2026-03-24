"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  pulsePhase: number;
}

const colors = [
  "rgba(34, 197, 94, {opacity})",  // green
  "rgba(74, 222, 128, {opacity})", // lighter green
  "rgba(22, 163, 74, {opacity})", // darker green
  "rgba(52, 211, 153, {opacity})", // emerald
  "rgba(16, 185, 129, {opacity})", // teal
];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const frameCountRef = useRef(0);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    resize();
    window.addEventListener("resize", resize);

    // Create particles - fewer for better performance
    const particleCount = Math.min(35, Math.floor(window.innerWidth / 40));
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas));

    let animationId: number;
    
    function animate() {
      if (!ctx || !canvas) return;
      
      frameCountRef.current++;
      
      // Skip every other frame for performance
      if (frameCountRef.current % 2 !== 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouseXVal = springX.get();
      const mouseYVal = springY.get();

      particlesRef.current.forEach((particle, index) => {
        // Update life
        particle.life++;
        
        // Reset particle if life exceeded
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle(canvas);
          return;
        }

        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction - stronger attraction
        const dx = mouseXVal - particle.x;
        const dy = mouseYVal - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          particle.x += dx * force * 0.015;
          particle.y += dy * force * 0.015;
        }

        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Calculate pulsing opacity
        const lifeRatio = 1 - particle.life / particle.maxLife;
        const pulse = Math.sin(frameCountRef.current * 0.02 + particle.pulsePhase) * 0.3 + 0.7;
        const currentOpacity = particle.opacity * lifeRatio * pulse;

        // Draw particle with enhanced glow
        const color = particle.color.replace("{opacity}", String(currentOpacity));
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, particle.color.replace("{opacity}", String(currentOpacity * 0.8)));
        gradient.addColorStop(0.5, particle.color.replace("{opacity}", String(currentOpacity * 0.3)));
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections - optimized
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.2;
            ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    function handleMouseMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [createParticle, springX, springY, mouseX, mouseY]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}

// Floating orbs component for additional visual depth
export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            background: `radial-gradient(circle, rgba(34, 197, 94, ${0.04 - i * 0.008}) 0%, transparent 70%)`,
            filter: "blur(60px)",
            left: `${5 + i * 25}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
        />
      ))}
    </div>
  );
}
