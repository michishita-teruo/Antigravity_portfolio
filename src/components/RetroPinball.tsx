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
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);

    // Game state refs (to avoid re-renders)
    const balls = useRef<Ball[]>([]);
    const flippers = useRef<Flipper[]>([
        { side: 'left', angle: 0.2, targetAngle: 0.2, x: 120, y: 540, length: 60, width: 12 },
        { side: 'right', angle: Math.PI - 0.2, targetAngle: Math.PI - 0.2, x: 280, y: 540, length: 60, width: 12 }
    ]);
    const bumpers = useRef<Bumper[]>([
        { x: 100, y: 150, radius: 25, color: '#ff00ff', hitTime: 0 },
        { x: 200, y: 100, radius: 25, color: '#00ffff', hitTime: 0 },
        { x: 300, y: 150, radius: 25, color: '#ffff00', hitTime: 0 }
    ]);

    // Walls (Funnel)
    const walls = useRef([
        { x1: 0, y1: 450, x2: 120, y2: 540 },   // Left Funnel
        { x1: 370, y1: 450, x2: 280, y2: 540 }, // Right Funnel
        { x1: 370, y1: 600, x2: 370, y2: 200 }  // Shooter Lane Wall
    ]);

    const GRAVITY = 0.2;
    const FRICTION = 0.998;
    const BOUNCE = 0.6;

    const launchBall = () => {
        balls.current.push({
            x: 385, y: 580,
            vx: 0,
            vy: -15 - Math.random() * 3,
            radius: 8, color: '#ffffff', isGlitching: false
        });
    };

    const resetGame = () => {
        balls.current = [];
        launchBall();
        setScore(0);
        setLives(3);
        setIsGameOver(false);
        setGlitchActive(false);
    };

    useEffect(() => {
        resetGame();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = -0.6;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = Math.PI + 0.6;
            }
            if (e.key === 'r' || e.key === 'R') resetGame();
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = 0.2;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = Math.PI - 0.2;
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
                f.angle += (f.targetAngle - f.angle) * 0.5;
            });

            // Update Balls
            for (let i = balls.current.length - 1; i >= 0; i--) {
                const ball = balls.current[i];
                ball.vy += GRAVITY;
                ball.vx *= FRICTION;
                ball.vy *= FRICTION;
                ball.x += ball.vx;
                ball.y += ball.vy;

                // Wall Collisions (Screen edges)
                if (ball.x < ball.radius) {
                    ball.x = ball.radius;
                    ball.vx *= -BOUNCE;
                }
                if (ball.x > 400 - ball.radius) {
                    ball.x = 400 - ball.radius;
                    ball.vx *= -BOUNCE;
                }
                if (ball.y < ball.radius && !ball.isGlitching) {
                    // Top curve bounce (approximate)
                    if (ball.x > 200) {
                        ball.vx -= 1;
                    } else {
                        ball.vx += 1;
                    }
                    ball.y = ball.radius;
                    ball.vy *= -BOUNCE;
                }

                // Funnel Wall Collisions
                walls.current.forEach(w => {
                    const dx = w.x2 - w.x1;
                    const dy = w.y2 - w.y1;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const dot = (((ball.x - w.x1) * dx) + ((ball.y - w.y1) * dy)) / (len * len);
                    const closestX = w.x1 + (dot * dx);
                    const closestY = w.y1 + (dot * dy);

                    if (dot >= 0 && dot <= 1) {
                        const dist = Math.sqrt((ball.x - closestX) ** 2 + (ball.y - closestY) ** 2);
                        if (dist < ball.radius) {
                            // Reflection
                            const normalX = -(w.y2 - w.y1) / len;
                            const normalY = (w.x2 - w.x1) / len;
                            const d = (ball.vx * normalX + ball.vy * normalY) * 2;
                            ball.vx -= d * normalX;
                            ball.vy -= d * normalY;
                            // Push out
                            ball.x = closestX + normalX * ball.radius;
                            ball.y = closestY + normalY * ball.radius;
                        }
                    }
                });

                // Top Glitch trigger
                if (ball.y < -50) {
                    if (!glitchActive) {
                        setGlitchActive(true);
                        for (let j = 0; j < 50; j++) {
                            balls.current.push({
                                x: 200, y: -20,
                                vx: (Math.random() - 0.5) * 15,
                                vy: Math.random() * 5,
                                radius: 5, color: '#f00', isGlitching: true
                            });
                        }
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
                    }
                });

                // Flipper Collisions
                flippers.current.forEach(f => {
                    const dx = ball.x - f.x;
                    const dy = ball.y - f.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < f.length + ball.radius) {
                        const ballAngle = Math.atan2(dy, dx);
                        let diff = ballAngle - f.angle;
                        // Normalize
                        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

                        if (Math.abs(diff) < 0.4) {
                            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                            const kick = Math.abs(f.targetAngle - f.angle) * 15;
                            const normalAngle = f.angle - Math.PI / 2;
                            ball.vx = Math.cos(normalAngle) * (speed + kick + 5);
                            ball.vy = Math.sin(normalAngle) * (speed + kick + 5);
                            ball.y -= 10; // Prevent stickiness
                        }
                    }
                });

                // Out of Bounds
                if (ball.y > 620) {
                    balls.current.splice(i, 1);
                    if (balls.current.length === 0) {
                        if (lives > 1) {
                            setLives(l => l - 1);
                            launchBall();
                        } else {
                            setIsGameOver(true);
                        }
                    }
                }
            }
        };

        const draw = () => {
            if (!ctx) return;
            ctx.fillStyle = '#000033';
            ctx.fillRect(0, 0, 400, 600);

            // Draw Funnel Walls
            ctx.strokeStyle = '#808080';
            ctx.lineWidth = 4;
            walls.current.forEach(w => {
                ctx.beginPath();
                ctx.moveTo(w.x1, w.y1);
                ctx.lineTo(w.x2, w.y2);
                ctx.stroke();
            });

            // Draw Flippers
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 12;
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
            });

            // Draw Bumpers
            bumpers.current.forEach(b => {
                const elapsed = Date.now() - b.hitTime;
                const r = b.radius + (elapsed < 100 ? 5 : 0);
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.stroke();
            });

            // UI
            ctx.fillStyle = '#ffff00';
            ctx.font = '16px "MS PGothic"';
            ctx.textAlign = 'left';
            ctx.fillText(`SCORE: ${score.toString().padStart(8, '0')}`, 10, 30);
            ctx.fillText(`BALLS: ${'●'.repeat(lives)}`, 10, 50);

            if (isGameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, 400, 600);
                ctx.fillStyle = '#ff0000';
                ctx.textAlign = 'center';
                ctx.font = '32px "MS PGothic"';
                ctx.fillText('G A M E   O V E R', 200, 300);
                ctx.font = '14px "MS PGothic"';
                ctx.fillText('Press [R] to Restart', 200, 340);
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
    }, [isGameOver, glitchActive, score, lives]);

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
            <div className="border-4 border-[#808080] bg-[#404040] shadow-xl overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={600}
                    className="block"
                    style={{ imageRendering: 'pixelated' }}
                />
            </div>
            <div className="mt-4 flex flex-col items-center gap-1">
                <p className="text-[10px] text-gray-400 font-mono">
                    [Arrows/Shift] Control Flippers | [R] Reset
                </p>
                <div className="flex gap-4">
                    <div className="h-6 w-12 bg-gray-800 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-yellow-500 font-bold">L-Shift</div>
                    <div className="h-6 w-12 bg-gray-800 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-yellow-500 font-bold">R-Shift</div>
                </div>
            </div>
            {glitchActive && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white opacity-20"
                            style={{
                                width: Math.random() * 100 + '%',
                                height: '1px',
                                top: Math.random() * 100 + '%',
                                left: 0,
                                animation: `glitch ${Math.random() * 0.2 + 0.1}s infinite`
                            }}
                        />
                    ))}
                </div>
            )}
            <style>{`
                @keyframes glitch {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                    100% { transform: translateX(-5px); }
                }
            `}</style>
        </div>
    );
};
