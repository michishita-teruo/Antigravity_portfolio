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

interface Wall {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export const RetroPinball: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const scoreRef = useRef(0);

    const balls = useRef<Ball[]>([]);
    const flippers = useRef<Flipper[]>([
        { side: 'left', angle: 0.4, targetAngle: 0.4, x: 115, y: 555, length: 65, width: 12 },
        { side: 'right', angle: Math.PI - 0.4, targetAngle: Math.PI - 0.4, x: 285, y: 555, length: 65, width: 12 }
    ]);
    const bumpers = useRef<Bumper[]>([
        { x: 100, y: 180, radius: 30, color: '#ff00ff', hitTime: 0 },
        { x: 200, y: 130, radius: 30, color: '#00ffff', hitTime: 0 },
        { x: 300, y: 180, radius: 30, color: '#ffff00', hitTime: 0 }
    ]);

    const wallsRef = useRef<Wall[]>([]);

    const GRAVITY = 0.3;
    const FRICTION = 0.995;
    const BOUNCE = 0.65;
    const FLOOR_Y = 600; // 床の明確な位置

    // 壁の初期化
    useEffect(() => {
        const walls: Wall[] = [];

        // 左ガイド（上から下へなだらかに）
        walls.push({ x1: 0, y1: 400, x2: 20, y2: 450 });
        walls.push({ x1: 20, y1: 450, x2: 50, y2: 500 });
        walls.push({ x1: 50, y1: 500, x2: 90, y2: 540 });
        walls.push({ x1: 90, y1: 540, x2: 115, y2: 555 }); // フリッパーへ

        // 右ガイド（シューターレーン壁 375 から開始）
        walls.push({ x1: 375, y1: 400, x2: 360, y2: 450 });
        walls.push({ x1: 360, y1: 450, x2: 340, y2: 500 });
        walls.push({ x1: 340, y1: 500, x2: 310, y2: 540 });
        walls.push({ x1: 310, y1: 540, x2: 285, y2: 555 }); // フリッパーへ

        // シューターレーンの壁
        walls.push({ x1: 375, y1: 600, x2: 375, y2: 100 });

        // 天井（カーブ）- セグメント数を増やして滑らかに
        const centerX = 200;
        const centerY = 100;
        const radiusX = 210;
        const radiusY = 120;
        const segments = 30; // セグメント数を増やす

        for (let i = 0; i < segments; i++) {
            const angle1 = Math.PI + (i / segments) * Math.PI;
            const angle2 = Math.PI + ((i + 1) / segments) * Math.PI;
            walls.push({
                x1: centerX + Math.cos(angle1) * radiusX,
                y1: centerY + Math.sin(angle1) * radiusY,
                x2: centerX + Math.cos(angle2) * radiusX,
                y2: centerY + Math.sin(angle2) * radiusY
            });
        }

        wallsRef.current = walls;
    }, []);

    const launchBall = () => {
        balls.current.push({
            x: 387, // 375-400の中央付近
            y: 580,
            vx: 0, // 摩擦を避けるため水平速度をゼロに
            vy: -26 - Math.random() * 4, // 射出力を大幅に強化
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

        // テスト用：5秒ごとにボールを追加
        const timer = setInterval(() => {
            if (!isGameOver) {
                launchBall();
            }
        }, 5000);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && (e.key === 'r' || e.key === 'R')) {
                resetGame();
                return;
            }

            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') {
                    flippers.current[0].targetAngle = -0.4;
                }
                if (e.location === 2 || e.key === 'ArrowRight') {
                    flippers.current[1].targetAngle = Math.PI + 0.4;
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') {
                    flippers.current[0].targetAngle = 0.4;
                }
                if (e.location === 2 || e.key === 'ArrowRight') {
                    flippers.current[1].targetAngle = Math.PI - 0.4;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationFrameId: number;
        const ctx = canvasRef.current?.getContext('2d');

        const update = () => {
            if (isGameOver) return;

            // フリッパーの更新
            flippers.current.forEach(f => {
                const diff = f.targetAngle - f.angle;
                f.angle += diff * 0.35;
            });

            // ボールの更新
            for (let i = balls.current.length - 1; i >= 0; i--) {
                const ball = balls.current[i];

                // 重力と摩擦
                ball.vy += GRAVITY;
                ball.vx *= FRICTION;
                ball.vy *= FRICTION;

                // 速度を適用
                ball.x += ball.vx;
                ball.y += ball.vy;

                // 左右の外壁（最終防衛線）
                if (ball.x < ball.radius) {
                    ball.x = ball.radius;
                    ball.vx = Math.abs(ball.vx) * BOUNCE;
                }
                if (ball.x > 400 - ball.radius) {
                    ball.x = 400 - ball.radius;
                    ball.vx = -Math.abs(ball.vx) * BOUNCE;
                }

                // 壁の衝突判定（改善版）
                let hasCollided = false;
                for (const wall of wallsRef.current) {
                    const dx = wall.x2 - wall.x1;
                    const dy = wall.y2 - wall.y1;
                    const wallLength = Math.sqrt(dx * dx + dy * dy);

                    if (wallLength === 0) continue;

                    // ボールから壁への投影
                    const toBallX = ball.x - wall.x1;
                    const toBallY = ball.y - wall.y1;
                    const t = Math.max(0, Math.min(1, (toBallX * dx + toBallY * dy) / (wallLength * wallLength)));

                    const closestX = wall.x1 + t * dx;
                    const closestY = wall.y1 + t * dy;

                    const distX = ball.x - closestX;
                    const distY = ball.y - closestY;
                    const distance = Math.sqrt(distX * distX + distY * distY);

                    if (distance < ball.radius && distance > 0) {
                        hasCollided = true;

                        // 法線方向
                        const normalX = distX / distance;
                        const normalY = distY / distance;

                        // 重なりを解消
                        const overlap = ball.radius - distance;
                        ball.x += normalX * overlap * 1.1; // 少し多めに押し出して詰まりを防ぐ
                        ball.y += normalY * overlap * 1.1;

                        // 速度の反射（壁に向かっている場合のみ）
                        const dotProduct = ball.vx * normalX + ball.vy * normalY;
                        if (dotProduct < 0) {
                            ball.vx -= 2 * dotProduct * normalX;
                            ball.vy -= 2 * dotProduct * normalY;
                            ball.vx *= BOUNCE;
                            ball.vy *= BOUNCE;
                        }
                    }
                }

                // グリッチトリガー（天井突破）
                if (ball.y < -50 && !ball.isGlitching && !hasCollided) {
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
                        // 衝突角度
                        const angle = Math.atan2(dy, dx);

                        // 重なりを解消
                        const overlap = (ball.radius + bumper.radius) - distance;
                        ball.x += Math.cos(angle) * overlap;
                        ball.y += Math.sin(angle) * overlap;

                        // 反発
                        const speed = 16;
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

                    if (len === 0) return;

                    const t = Math.max(0, Math.min(1,
                        ((ball.x - flipper.x) * dx + (ball.y - flipper.y) * dy) / (len * len)
                    ));

                    const closestX = flipper.x + t * dx;
                    const closestY = flipper.y + t * dy;

                    const distX = ball.x - closestX;
                    const distY = ball.y - closestY;
                    const distance = Math.sqrt(distX * distX + distY * distY);

                    if (distance < ball.radius + flipper.width / 2 && distance > 0) {
                        // 法線方向
                        const normalX = distX / distance;
                        const normalY = distY / distance;

                        // 重なりを解消
                        const overlap = (ball.radius + flipper.width / 2) - distance;
                        ball.x += normalX * overlap;
                        ball.y += normalY * overlap;

                        // フリッパーの速度を加える
                        const flipperVelocity = Math.abs(flipper.targetAngle - flipper.angle) * 30;
                        const ballSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
                        const totalSpeed = ballSpeed + flipperVelocity + 10;

                        // フリッパーの法線方向に打ち出す
                        const perpAngle = flipper.angle - Math.PI / 2;
                        ball.vx = Math.cos(perpAngle) * totalSpeed;
                        ball.vy = Math.sin(perpAngle) * totalSpeed;
                    }
                });

                // 床のすり抜け防止（CRITICAL）
                if (ball.y + ball.radius > FLOOR_Y) {
                    ball.y = FLOOR_Y - ball.radius;
                    ball.vy = -Math.abs(ball.vy) * 0.3; // 少し跳ね返る
                }

                // アウトオブバウンズ（画面下）
                if (ball.y > FLOOR_Y + 50) {
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

            // 床を描画（デバッグ用）
            ctx.strokeStyle = '#404040';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, FLOOR_Y);
            ctx.lineTo(400, FLOOR_Y);
            ctx.stroke();

            // 壁を描画
            ctx.strokeStyle = '#808080';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            wallsRef.current.forEach(wall => {
                ctx.beginPath();
                ctx.moveTo(wall.x1, wall.y1);
                ctx.lineTo(wall.x2, wall.y2);
                ctx.stroke();
            });

            // フリッパー
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

            // ボール
            balls.current.forEach(ball => {
                ctx.fillStyle = ball.color;
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // バンパー
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
            clearInterval(timer);
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
