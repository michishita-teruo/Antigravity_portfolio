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
        { side: 'left', angle: 0.3, targetAngle: 0.3, x: 140, y: 560, length: 55, width: 10 },
        { side: 'right', angle: -0.3, targetAngle: -0.3, x: 260, y: 560, length: 55, width: 10 }
    ]);
    const bumpers = useRef<Bumper[]>([
        { x: 100, y: 150, radius: 25, color: '#ff00ff', hitTime: 0 },
        { x: 200, y: 100, radius: 25, color: '#00ffff', hitTime: 0 },
        { x: 300, y: 150, radius: 25, color: '#ffff00', hitTime: 0 }
    ]);

    const GRAVITY = 0.18;
    const FRICTION = 0.995;
    const BOUNCE = 0.65;

    const launchBall = () => {
        balls.current.push({
            x: 385, y: 580,
            vx: -2 - Math.random() * 2,
            vy: -14 - Math.random() * 2,
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
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = -0.3;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = 0.3;
            }
            if (e.key === 'r' || e.key === 'R') resetGame();
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = 0.3;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = -0.3;
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
                f.angle += (f.targetAngle - f.angle) * 0.45;
            });

            // Update Balls
            for (let i = balls.current.length - 1; i >= 0; i--) {
                const ball = balls.current[i];
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
                        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                        ball.vx = Math.cos(angle) * Math.max(speed, 10);
                        ball.vy = Math.sin(angle) * Math.max(speed, 10);
                        b.hitTime = Date.now();
                        setScore(s => s + 100);
                    }
                });

                // Flipper Collisions (Segment-based approximate)
                flippers.current.forEach(f => {
                    // Vector from pivot
                    const dx = ball.x - f.x;
                    const dy = ball.y - f.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < f.length + ball.radius) {
                        const ballAngle = Math.atan2(dy, dx);
                        const angleDiff = ballAngle - f.angle;
                        // Map to [-PI, PI]
                        const normalizedDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

                        if (Math.abs(normalizedDiff) < 0.3) {
                            // Hit!
                            const angularVel = (f.targetAngle - f.angle) * 10; // Simple kick
                            const normalAngle = f.angle - Math.PI / 2 * (f.side === 'left' ? 1 : -1);

                            ball.vx += Math.cos(normalAngle) * (Math.abs(angularVel) + 5);
                            ball.vy += Math.sin(normalAngle) * (Math.abs(angularVel) + 5);

                            // Prevent clipping
                            ball.y -= 5;
                        }
                    }
                });

                // Out of Bounds / Lost Ball
                if (ball.y > 610) {
                    balls.current.splice(i, 1);
                    if (balls.current.length === 0) {
                        if (lives > 1) {
                            setLives(l => l - 1);
                            launchBall();
                        } else {
                            setLives(0);
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

            // Draw Grid
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
            ctx.lineWidth = 10;
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

            // Shooter Lane Visual
            ctx.strokeStyle = '#333366';
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(370, 450, 30, 150);
            ctx.setLineDash([]);

            // UI
            ctx.fillStyle = '#ffff00';
            ctx.font = '16px "MS PGothic"';
            ctx.textAlign = 'left';
            ctx.fillText(`SCORE: ${score.toString().padStart(8, '0')}`, 10, 30);
            ctx.fillText(`LIVES: ${'★'.repeat(lives)}`, 10, 50);

            if (isGameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, 400, 600);
                ctx.fillStyle = '#ff0000';
                ctx.textAlign = 'center';
                ctx.font = '30px "MS PGothic"';
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
