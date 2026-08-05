"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
}

const confettiColors = ["#ff758c", "#ff7eb3", "#ffd700", "#ff4e50", "#ffffff", "#78ffd6", "#00c6ff"];
const particleTypes = ["circle", "rect", "heart"];

class Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  type: string;
  vx: number;
  vy: number;
  gravity: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(x: number, y: number, canvasWidth: number, canvasHeight: number, isRadial = false) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = x;
    this.y = y;
    this.size = 6 + Math.random() * 8;
    this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    
    if (isRadial) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (1 + Math.random() * 3);
      this.type = Math.random() > 0.4 ? "heart" : "circle";
    } else {
      this.vx = -2 + Math.random() * 4;
      this.vy = 2 + Math.random() * 5;
    }
    
    this.gravity = 0.08 + Math.random() * 0.05;
    this.opacity = 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = -5 + Math.random() * 10;
  }

  update() {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.005;
    
    if (this.y > this.canvasHeight) {
      this.y = -20;
      this.x = Math.random() * this.canvasWidth;
      this.vy = 2 + Math.random() * 4;
      this.opacity = 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === "rect") {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
    } else if (this.type === "heart") {
      ctx.beginPath();
      const d = this.size;
      ctx.moveTo(0, d / 4);
      ctx.quadraticCurveTo(-d / 2, -d / 2, -d / 2, d / 4);
      ctx.quadraticCurveTo(-d / 2, d * 0.7, 0, d);
      ctx.quadraticCurveTo(d / 2, d * 0.7, d / 2, d / 4);
      ctx.quadraticCurveTo(d / 2, -d / 2, 0, d / 4);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

export default function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Spawn initial rain particles
    const list: Particle[] = [];
    if (active) {
      for (let i = 0; i < 100; i++) {
        list.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height - canvas.height, canvas.width, canvas.height));
      }
      // Add a center burst
      for (let i = 0; i < 60; i++) {
        list.push(new Particle(canvas.width / 2, canvas.height * 0.6, canvas.width, canvas.height, true));
      }
      particlesRef.current = list;
    }

    const animate = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentParticles = particlesRef.current;
      for (let i = currentParticles.length - 1; i >= 0; i--) {
        const p = currentParticles[i];
        p.update();
        p.draw(ctx);

        if (p.opacity <= 0) {
          if (p.y === -20) {
            p.opacity = 1;
          } else {
            currentParticles.splice(i, 1);
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (active) {
      animate();
    }

    const handleCanvasClick = (e: MouseEvent) => {
      if (!active) return;
      const list = particlesRef.current;
      // Spawn 15 particles at click coordinates
      for (let i = 0; i < 15; i++) {
        list.push(new Particle(e.clientX, e.clientY, canvas.width, canvas.height, true));
      }
    };

    window.addEventListener("click", handleCanvasClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleCanvasClick);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40"
    />
  );
}
