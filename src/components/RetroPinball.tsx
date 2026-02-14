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
    const [, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const scoreRef = useRef(0); // スコア管理用ref

    // Game state refs (to avoid re-renders)
    const balls = useRef<Ball[]>([]);
    const flippers = useRef<Flipper[]>([
        { side: 'left', angle: 0.3, targetAngle: 0.3, x: 130, y: 540, length: 70, width: 12 },
        { side: 'right', angle: Math.PI - 0.3, targetAngle: Math.PI - 0.3, x: 270, y: 540, length: 70, width: 12 }
    ]);
    const bumpers = useRef<Bumper[]>([
        { x: 100, y: 150, radius: 30, color: '#ff00ff', hitTime: 0 },
        { x: 200, y: 100, radius: 30, color: '#00ffff', hitTime: 0 },
        { x: 300, y: 150, radius: 30, color: '#ffff00', hitTime: 0 }
    ]);

    // 壁の定義（ファネル形状とシューターレーン）
    const walls = useRef([
        { x1: 0, y1: 450, x2: 110, y2: 530 },   // Left Funnel
        { x1: 370, y1: 450, x2: 290, y2: 530 }, // Right Funnel (シューターレーンを避けるため370開始)
        { x1: 370, y1: 600, x2: 370, y2: 150 }  // Shooter Lane Wall
    ]);

    // 丸型（卵型）天井のセグメントを生成
    useEffect(() => {
        const segments = [];
        const centerX = 185; // (0 + 370) / 2
        const centerY = 150;
        const radiusX = 185;
        const radiusY = 150;
        const count = 10;
        for (let i = 0; i <= count; i++) {
            const angle1 = Math.PI + (i / count) * Math.PI;
            const angle2 = Math.PI + ((i + 1) / count) * Math.PI;
            segments.push({
                x1: centerX + Math.cos(angle1) * radiusX,
                y1: centerY + Math.sin(angle1) * radiusY,
                x2: centerX + Math.cos(angle2) * radiusX,
                y2: centerY + Math.sin(angle2) * radiusY
            });
        }
        walls.current = [...walls.current, ...segments];
    }, []);

    const GRAVITY = 0.25;
    const FRICTION = 0.995;
    const BOUNCE = 0.7;

    const launchBall = () => {
        balls.current.push({
            x: 385,
            y: 580,
            vx: -2,
            vy: -16 - Math.random() * 2,
            radius: 8,
            color: '#ffffff',
            isGlitching: false
        });
    };

    const resetGame = () => {
        balls.current = [];
        launchBall();
        scoreRef.current = 0;
        setScore(0);
        setLives(3);
        setIsGameOver(false);
        setGlitchActive(false);
    };

    useEffect(() => {
        resetGame();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && (e.key === 'r' || e.key === 'R')) {
                resetGame();
                return;
            }

            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') {
                    flippers.current[0].targetAngle = -0.5;
                }
                if (e.location === 2 || e.key === 'ArrowRight') {
                    flippers.current[1].targetAngle = Math.PI + 0.5;
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') {
                    flippers.current[0].targetAngle = 0.3;
                }
                if (e.location === 2 || e.key === 'ArrowRight') {
                    flippers.current[1].targetAngle = Math.PI - 0.3;
                }
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
                const diff = f.targetAngle - f.angle;
                f.angle += diff * 0.3;
            });

            // Update Balls
            for (let i = balls.current.length - 1; i >= 0; i--) {
                const ball = balls.current[i];

                // 重力と摩擦
                ball.vy += GRAVITY;
                ball.vx *= FRICTION;
                ball.vy *= FRICTION;
                ball.x += ball.vx;
                ball.y += ball.vy;

                // 左右の壁
                if (ball.x < ball.radius) {
                    ball.x = ball.radius;
                    ball.vx = Math.abs(ball.vx) * BOUNCE;
                }
                if (ball.x > 400 - ball.radius) {
                    ball.x = 400 - ball.radius;
                    ball.vx = -Math.abs(ball.vx) * BOUNCE;
                }

                // 天井の個別判定は削除（walls 経由で判定）

                // ファネル壁の衝突判定
                walls.current.forEach(wall => {
                    const dx = wall.x2 - wall.x1;
                    const dy = wall.y2 - wall.y1;
                    const wallLength = Math.sqrt(dx * dx + dy * dy);

                    const toBallX = ball.x - wall.x1;
                    const toBallY = ball.y - wall.y1;

                    const t = Math.max(0, Math.min(1, (toBallX * dx + toBallY * dy) / (wallLength * wallLength)));
                    const closestX = wall.x1 + t * dx;
                    const closestY = wall.y1 + t * dy;

                    const distX = ball.x - closestX;
                    const distY = ball.y - closestY;
                    const distance = Math.sqrt(distX * distX + distY * distY);

                    if (distance < ball.radius) {
                        const overlap = ball.radius - distance;
                        const normalX = distance === 0 ? 0 : distX / distance;
                        const normalY = distance === 0 ? 1 : distY / distance;

                        ball.x += normalX * overlap;
                        ball.y += normalY * overlap;

                        const dotProduct = ball.vx * normalX + ball.vy * normalY;
                        ball.vx = (ball.vx - 2 * dotProduct * normalX) * BOUNCE;
                        ball.vy = (ball.vy - 2 * dotProduct * normalY) * BOUNCE;
                    }
                });

                // グリッチトリガー
                if (ball.y < -50 && !ball.isGlitching) {
                    if (!glitchActive) {
                        setGlitchActive(true);
                        for (let j = 0; j < 30; j++) {
                            balls.current.push({
                                x: 200 + (Math.random() - 0.5) * 100,
                                y: -20,
                                vx: (Math.random() - 0.5) * 15,
                                vy: Math.random() * 5,
                                radius: 5,
                                color: '#ff0000',
                                isGlitching: true
                            });
                        }
                    }
                }

                // バンパーの衝突判定
                bumpers.current.forEach(bumper => {
                    const dx = ball.x - bumper.x;
                    const dy = ball.y - bumper.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < ball.radius + bumper.radius && distance > 0) {
                        const angle = Math.atan2(dy, dx);
                        const overlap = (ball.radius + bumper.radius) - distance;
                        ball.x += Math.cos(angle) * overlap;
                        ball.y += Math.sin(angle) * overlap;

                        const speed = 15;
                        ball.vx = Math.cos(angle) * speed;
                        ball.vy = Math.sin(angle) * speed;

                        bumper.hitTime = Date.now();
                        scoreRef.current += 100;
                        setScore(scoreRef.current);
                    }
                });

                // フリッパーの衝突判定
                flippers.current.forEach(flipper => {
                    const endX = flipper.x + Math.cos(flipper.angle) * flipper.length;
                    const endY = flipper.y + Math.sin(flipper.angle) * flipper.length;

                    const dx = endX - flipper.x;
                    const dy = endY - flipper.y;
                    const len = Math.sqrt(dx * dx + dy * dy);

                    const t = Math.max(0, Math.min(1,
                        ((ball.x - flipper.x) * dx + (ball.y - flipper.y) * dy) / (len * len)
                    ));

                    const closestX = flipper.x + t * dx;
                    const closestY = flipper.y + t * dy;

                    const distX = ball.x - closestX;
                    const distY = ball.y - closestY;
                    const distance = Math.sqrt(distX * distX + distY * distY);

                    if (distance < ball.radius + flipper.width / 2) {
                        const overlap = (ball.radius + flipper.width / 2) - distance;
                        const normalX = distance === 0 ? 0 : distX / distance;
                        const normalY = distance === 0 ? 1 : distY / distance;

                        ball.x += normalX * overlap;
                        ball.y += normalY * overlap; // Keep this line for correct physics
                        // フリッパーの動きによる追加速度
                        const flipperSpeed = Math.abs(flipper.targetAngle - flipper.angle) * 25;
                        const totalSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) + flipperSpeed + 8;

                        // フリッパーの法線方向に反射
                        const perpAngle = flipper.angle - Math.PI / 2;
                        ball.vx = Math.cos(perpAngle) * totalSpeed;
                        ball.vy = Math.sin(perpAngle) * totalSpeed;
                    }
                });

                // アウトオブバウンズ
                if (ball.y > 620) {
                    balls.current.splice(i, 1);
                    if (balls.current.filter(b => !b.isGlitching).length === 0) {
                        if (lives > 1) {
                            setLives(l => l - 1);
                            setTimeout(launchBall, 500);
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

            // 背景
            ctx.fillStyle = '#000033';
            ctx.fillRect(0, 0, 400, 600);

            // ファネル壁を描画
            ctx.strokeStyle = '#808080';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            walls.current.forEach(wall => {
                ctx.beginPath();
                ctx.moveTo(wall.x1, wall.y1);
                ctx.lineTo(wall.x2, wall.y2);
                ctx.stroke();
            });

            // フリッパーを描画
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            flippers.current.forEach(flipper => {
                ctx.beginPath();
                ctx.moveTo(flipper.x, flipper.y);
                const endX = flipper.x + Math.cos(flipper.angle) * flipper.length;
                const endY = flipper.y + Math.sin(flipper.angle) * flipper.length;
                ctx.lineTo(endX, endY);
                ctx.stroke();
            });

            // ボールを描画
            balls.current.forEach(ball => {
                ctx.fillStyle = ball.color;
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // バンパーを描画
            bumpers.current.forEach(bumper => {
                const elapsed = Date.now() - bumper.hitTime;
                const radius = bumper.radius + (elapsed < 150 ? 8 : 0);

                ctx.fillStyle = bumper.color;
                ctx.beginPath();
                ctx.arc(bumper.x, bumper.y, radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.stroke();
            });

            // UI
            ctx.fillStyle = '#ffff00';
            ctx.font = '16px "MS PGothic", monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`SCORE: ${scoreRef.current.toString().padStart(8, '0')}`, 10, 30);
            ctx.fillText(`BALLS: ${'●'.repeat(lives)}`, 10, 50);

            if (isGameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.85)';
                ctx.fillRect(0, 0, 400, 600);
                ctx.fillStyle = '#ff0000';
                ctx.textAlign = 'center';
                ctx.font = '32px "MS PGothic", monospace';
                ctx.fillText('G A M E   O V E R', 200, 280);
                ctx.font = '20px "MS PGothic", monospace';
                ctx.fillStyle = '#ffff00';
                ctx.fillText(`FINAL SCORE: ${scoreRef.current}`, 200, 320);
                ctx.font = '14px "MS PGothic", monospace';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('Press [R] to Restart', 200, 360);
            }

            if (glitchActive) {
                ctx.fillStyle = '#ff0000';
                ctx.font = '10px monospace';
                ctx.textAlign = 'left';
                ctx.fillText("⚠ CRITICAL ERROR: BUFFER OVERFLOW", 10, 580);
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
    }, [isGameOver, lives]);

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
            <div className="mt-4 flex flex-col items-center gap-2">
                <p className="text-[11px] text-gray-400 font-mono">
                    [← / →] or [Left/Right Shift] - Control Flippers | [R] - Reset
                </p>
                <div className="flex gap-4">
                    <div className="h-7 w-14 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-[9px] text-yellow-500 font-bold">
                        L-Shift
                    </div>
                    <div className="h-7 w-14 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-[9px] text-yellow-500 font-bold">
                        R-Shift
                    </div>
                </div>
            </div>
            {glitchActive && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-red-500 opacity-30"
                            style={{
                                width: Math.random() * 100 + '%',
                                height: '2px',
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
