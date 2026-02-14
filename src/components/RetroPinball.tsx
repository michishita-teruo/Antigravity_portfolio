import React, { useEffect, useRef, useState } from 'react';

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    isGlitching: boolean;
}

interface Flipper {
    side: 'left' | 'right';
    angle: number;
    targetAngle: number;
    x: number;
    y: number;
    length: number;
    width: number;
}

interface Bumper {
    x: number;
    y: number;
    radius: number;
    color: string;
    hitTime: number;
}

export const RetroPinball: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);

    // Game state refs (to avoid re-renders)
    const balls = useRef<Ball[]>([]);
    const flippers = useRef<Flipper[]>([
        { side: 'left', angle: 0.5, targetAngle: 0.5, x: 120, y: 550, length: 70, width: 10 },
        { side: 'right', angle: -0.5, targetAngle: -0.5, x: 280, y: 550, length: 70, width: 10 }
    ]);
    const bumpers = useRef<Bumper[]>([
        { x: 100, y: 150, radius: 25, color: '#ff00ff', hitTime: 0 },
        { x: 200, y: 100, radius: 25, color: '#00ffff', hitTime: 0 },
        { x: 300, y: 150, radius: 25, color: '#ffff00', hitTime: 0 }
    ]);

    const GRAVITY = 0.15;
    const FRICTION = 0.99;
    const BOUNCE = 0.7;

    const resetGame = () => {
        balls.current = [{ x: 380, y: 500, vx: 0, vy: -10, radius: 8, color: '#ffffff', isGlitching: false }];
        setScore(0);
        setIsGameOver(false);
        setGlitchActive(false);
    };

    useEffect(() => {
        resetGame();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = -0.6;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = 0.6;
            }
            if (e.key === 'r' || e.key === 'R') resetGame();
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = 0.5;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = -0.5;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationFrameId: number;
        const ctx = canvasRef.current?.getContext('2d');

        const update = () => {
            if (isGameOver) return;

            // Update Flippers
            flippers.current.forEach(f => {
                f.angle += (f.targetAngle - f.angle) * 0.4;
            });

            // Update Balls
            balls.current.forEach((ball, index) => {
                ball.vy += GRAVITY;
                ball.vx *= FRICTION;
                ball.vy *= FRICTION;
                ball.x += ball.vx;
                ball.y += ball.vy;

                // Wall Collisions
                if (ball.x < ball.radius) {
                    ball.x = ball.radius;
                    ball.vx *= -BOUNCE;
                }
                if (ball.x > 400 - ball.radius) {
                    ball.x = 400 - ball.radius;
                    ball.vx *= -BOUNCE;
                }
                if (ball.y < ball.radius) {
                    // Top Glitch trigger
                    if (ball.y < -50) {
                        if (!glitchActive) {
                            setGlitchActive(true);
                            // Chaos Multiball activation
                            for (let i = 0; i < 50; i++) {
                                balls.current.push({
                                    x: 200, y: -20,
                                    vx: (Math.random() - 0.5) * 15,
                                    vy: Math.random() * 5,
                                    radius: 5, color: '#f00', isGlitching: true
                                });
                            }
                        }
                    }
                    if (ball.y < ball.radius && !ball.isGlitching) {
                        ball.y = ball.radius;
                        ball.vy *= -BOUNCE;
                    }
                }

                // Bumper Collisions
                bumpers.current.forEach(b => {
                    const dx = ball.x - b.x;
                    const dy = ball.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < ball.radius + b.radius) {
                        const angle = Math.atan2(dy, dx);
                        ball.vx = Math.cos(angle) * 12;
                        ball.vy = Math.sin(angle) * 12;
                        b.hitTime = Date.now();
                        setScore(s => s + 100);

                        // Small chance to trigger chaos
                        if (Math.random() > 0.98 && balls.current.length < 10) {
                            balls.current.push({ ...ball, vx: -ball.vx, vy: -ball.vy, color: '#0f0' });
                        }
                    }
                });

                // Flipper Collisions
                flippers.current.forEach(f => {
                    const fx = f.x;
                    const fy = f.y;
                    const dx = ball.x - fx;
                    const dy = ball.y - fy;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < f.length + ball.radius) {
                        const relAngle = Math.atan2(dy, dx);
                        const diff = relAngle - f.angle;
                        if (Math.abs(diff) < 0.2 && dist > 10) {
                            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                            const boost = Math.abs(f.targetAngle - f.angle) * 20;
                            ball.vx = Math.cos(f.angle - Math.PI / 2) * (speed + boost + 5);
                            ball.vy = Math.sin(f.angle - Math.PI / 2) * (speed + boost + 5);
                        }
                    }
                });

                // Out of Bounds
                if (ball.y > 650) {
                    if (balls.current.length === 1) {
                        setIsGameOver(true);
                    } else {
                        balls.current.splice(index, 1);
                    }
                }
            });
        };

        const draw = () => {
            if (!ctx) return;
            ctx.fillStyle = '#000033';
            ctx.fillRect(0, 0, 400, 600);

            // Draw Grid (Retro feel)
            ctx.strokeStyle = '#000066';
            ctx.beginPath();
            for (let i = 0; i < 400; i += 20) { ctx.moveTo(i, 0); ctx.lineTo(i, 600); }
            for (let i = 0; i < 600; i += 20) { ctx.moveTo(0, i); ctx.lineTo(400, i); }
            ctx.stroke();

            // Draw Bumpers
            bumpers.current.forEach(b => {
                const elapsed = Date.now() - b.hitTime;
                const r = b.radius + (elapsed < 100 ? 5 : 0);
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            // Draw Flippers
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            flippers.current.forEach(f => {
                ctx.beginPath();
                ctx.moveTo(f.x, f.y);
                const ex = f.x + Math.cos(f.angle) * f.length;
                const ey = f.y + Math.sin(f.angle) * f.length;
                ctx.lineTo(ex, ey);
                ctx.stroke();
            });

            // Draw Balls
            balls.current.forEach(ball => {
                ctx.fillStyle = ball.color;
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fill();
                // Glow effect for glitching balls
                if (ball.isGlitching) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = ball.color;
                } else {
                    ctx.shadowBlur = 0;
                }
            });
            ctx.shadowBlur = 0;

            // UI
            ctx.fillStyle = '#ffff00';
            ctx.font = '20px "MS PGothic"';
            ctx.fillText(`SCORE: ${score.toString().padStart(8, '0')}`, 10, 30);

            if (isGameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(0, 0, 400, 600);
                ctx.fillStyle = '#ff0000';
                ctx.textAlign = 'center';
                ctx.fillText('G A M E   O V E R', 200, 300);
                ctx.font = '12px "MS PGothic"';
                ctx.fillText('Press [R] to Restart', 200, 330);
            }

            if (glitchActive) {
                ctx.fillStyle = '#ff0000';
                ctx.font = '10px monospace';
                ctx.fillText("CRITICAL ERROR: FRAME BUFFER OVERFLOW", 10, 50);
            }
        };

        const loop = () => {
            update();
            draw();
            animationFrameId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isGameOver, glitchActive, score]);

    return (
        <div className={`relative bg-black p-4 flex flex-col items-center select-none ${glitchActive ? 'animate-pulse' : ''}`}>
            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    onClick={resetGame}
                    className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black px-3 py-1 text-[10px] font-bold active:border-inset"
                >
                    RESTART [R]
                </button>
            </div>
            <div className="border-4 border-[#808080] bg-[#404040] shadow-xl">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={600}
                    className={`block ${glitchActive ? 'skew-x-1 transition-transform' : ''}`}
                    style={{ imageRendering: 'pixelated' }}
                />
            </div>
            <p className="mt-4 text-[10px] text-gray-400 font-mono">
                [Arrows/Shift] Control Flippers | [R] Reset | [!] Chaos Multiball hidden...
            </p>
            {glitchActive && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white opacity-20"
                            style={{
                                width: Math.random() * 100 + '%',
                                height: '1px',
                                top: Math.random() * 100 + '%',
                                left: 0,
                                animation: `glitch ${Math.random() + 0.5}s infinite`
                            }}
                        />
                    ))}
                </div>
            )}
            <style>{`
                @keyframes glitch {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                    100% { transform: translateX(-10px); }
                }
            `}</style>
        </div>
    );
};
