import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function AnimatedBackground({ className = '', intensity = 'medium' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Blob configuration
    const intensityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;
    const blobs = [
      { 
        x: width * 0.3, 
        y: height * 0.4, 
        radius: 200 * intensityMultiplier, 
        vx: 0.3, 
        vy: 0.2,
        color: 'rgba(59, 130, 246, 0.4)' // Blue
      },
      { 
        x: width * 0.7, 
        y: height * 0.6, 
        radius: 180 * intensityMultiplier, 
        vx: -0.2, 
        vy: 0.3,
        color: 'rgba(59, 130, 246, 0.3)' // Blue lighter
      },
      { 
        x: width * 0.5, 
        y: height * 0.3, 
        radius: 150 * intensityMultiplier, 
        vx: 0.25, 
        vy: -0.15,
        color: 'rgba(96, 165, 250, 0.25)' // Light blue
      },
    ];

    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Draw dark background
      ctx.fillStyle = 'hsl(224, 71%, 4%)';
      ctx.fillRect(0, 0, width, height);

      blobs.forEach((blob, i) => {
        // Breathing pulse effect
        const pulse = Math.sin(time * 2 + i) * 20;
        
        // Mouse interaction - blobs are attracted to mouse
        const dx = mouseRef.current.x - blob.x;
        const dy = mouseRef.current.y - blob.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
          blob.x += dx * 0.002;
          blob.y += dy * 0.002;
        }
        
        // Wave motion
        blob.x += blob.vx + Math.sin(time + i) * 0.5;
        blob.y += blob.vy + Math.cos(time + i * 0.7) * 0.5;
        
        // Boundary wrap
        if (blob.x < -200) blob.x = width + 200;
        if (blob.x > width + 200) blob.x = -200;
        if (blob.y < -200) blob.y = height + 200;
        if (blob.y > height + 200) blob.y = -200;

        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius + pulse
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, '0.15)'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius + pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Add subtle blur/glow effect overlay
      ctx.filter = 'blur(60px)';
      blobs.forEach((blob, i) => {
        const pulse = Math.sin(time * 2 + i) * 15;
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, (blob.radius + pulse) * 0.6
        );
        gradient.addColorStop(0, blob.color.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, (blob.radius + pulse) * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      ctx.filter = 'none';

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}
