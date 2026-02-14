import React, { useEffect, useRef, useState } from 'react';

/**
 * 物理演算の安定性を極限まで高めた「究極のピンボール」
 * 1. サブステッピング (1フレーム10回計算) による「すり抜け」防止
 * 2. 位置ベースの衝突解消による「めり込み」防止
 * 3. 卵型コンテナ構造による「引っかかり」の物理的排除
 */

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
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

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 540;
const SUB_STEPS = 10; // 物理演算の細かさ
const GRAVITY = 0.25;
const FRICTION = 0.998;
const BOUNCE = 0.6;

export const RetroPinball: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);
    const scoreRef = useRef(0);

    const balls = useRef<Ball[]>([]);
    const flippers = useRef<Flipper[]>([
        { side: 'left', angle: 0.4, targetAngle: 0.4, x: 100, y: 500, length: 70, width: 14 },
        { side: 'right', angle: Math.PI - 0.4, targetAngle: Math.PI - 0.4, x: 260, y: 500, length: 70, width: 14 }
    ]);
    const bumpers = useRef<Bumper[]>([
        { x: 100, y: 180, radius: 28, color: '#ff00ff', hitTime: 0 },
        { x: 180, y: 120, radius: 28, color: '#00ffff', hitTime: 0 },
        { x: 260, y: 180, radius: 28, color: '#ffff00', hitTime: 0 }
    ]);

    const walls = useRef<Wall[]>([]);

    // フィールド形状の初期化
    useEffect(() => {
        const w: Wall[] = [];

        // 1. シューターレーン (右端)
        w.push({ x1: 330, y1: 540, x2: 330, y2: 120 });

        // 2. 左側の壁とファンネル (なだらかな器形状)
        w.push({ x1: 0, y1: 540, x2: 0, y2: 120 });
        w.push({ x1: 0, y1: 420, x2: 100, y2: 500 }); // 左ファンネル

        // 3. 右側のファンネル
        w.push({ x1: 330, y1: 420, x2: 260, y2: 500 });

        // 4. 天井 (滑らかなアーチ - 多数のセグメントで隙間を完全に埋める)
        const centerX = 165; // シューターレーンを除いた中央
        const centerY = 120;
        const radiusX = 165;
        const radiusY = 120;
        const segments = 40;
        for (let i = 0; i < segments; i++) {
            const a1 = Math.PI + (i / segments) * Math.PI;
            const a2 = Math.PI + ((i + 1) / segments) * Math.PI;
            w.push({
                x1: centerX + Math.cos(a1) * radiusX,
                y1: centerY + Math.sin(a1) * radiusY,
                x2: centerX + Math.cos(a2) * radiusX,
                y2: centerY + Math.sin(a2) * radiusY
            });
        }

        walls.current = w;
    }, []);

    const launchBall = () => {
        balls.current = [{
            x: 345,
            y: 520,
            vx: 0,
            vy: -22 - Math.random() * 4,
            radius: 8,
            color: '#ffffff'
        }];
    };

    const resetGame = () => {
        scoreRef.current = 0;
        setScore(0);
        setLives(3);
        setIsGameOver(false);
        launchBall();
    };

    useEffect(() => {
        resetGame();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && (e.key === 'r' || e.key === 'R')) {
                resetGame();
                return;
            }
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = -0.5;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = Math.PI + 0.5;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (e.location === 1 || e.key === 'ArrowLeft') flippers.current[0].targetAngle = 0.4;
                if (e.location === 2 || e.key === 'ArrowRight') flippers.current[1].targetAngle = Math.PI - 0.4;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animeId: number;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        const physicsStep = () => {
            if (isGameOver) return;

            // フリッパー回転
            flippers.current.forEach(f => {
                f.angle += (f.targetAngle - f.angle) * 0.4;
            });

            // サブステッピングによる超精密演算
            for (let step = 0; step < SUB_STEPS; step++) {
                balls.current.forEach((ball, bIdx) => {
                    // 速度更新
                    ball.vy += GRAVITY / SUB_STEPS;
                    ball.vx *= Math.pow(FRICTION, 1 / SUB_STEPS);
                    ball.vy *= Math.pow(FRICTION, 1 / SUB_STEPS);

                    // 位置更新
                    ball.x += ball.vx / SUB_STEPS;
                    ball.y += ball.vy / SUB_STEPS;

                    // 1. 壁との衝突判定 (シームレス判定)
                    walls.current.forEach(wall => {
                        const dx = wall.x2 - wall.x1;
                        const dy = wall.y2 - wall.y1;
                        const lenSq = dx * dx + dy * dy;
                        if (lenSq === 0) return;

                        const t = Math.max(0, Math.min(1, ((ball.x - wall.x1) * dx + (ball.y - wall.y1) * dy) / lenSq));
                        const closestX = wall.x1 + t * dx;
                        const closestY = wall.y1 + t * dy;

                        const distX = ball.x - closestX;
                        const distY = ball.y - closestY;
                        const dist = Math.sqrt(distX * distX + distY * distY);

                        if (dist < ball.radius && dist > 0) {
                            // 法線ベクトル
                            const nx = distX / dist;
                            const ny = distY / dist;

                            // 押し出し (めり込み解消)
                            const overlap = ball.radius - dist;
                            ball.x += nx * overlap;
                            ball.y += ny * overlap;

                            // 反射
                            const dot = ball.vx * nx + ball.vy * ny;
                            if (dot < 0) {
                                ball.vx = (ball.vx - 2 * dot * nx) * BOUNCE;
                                ball.vy = (ball.vy - 2 * dot * ny) * BOUNCE;
                            }
                        }
                    });

                    // 2. バンパー
                    bumpers.current.forEach(bump => {
                        const dx = ball.x - bump.x;
                        const dy = ball.y - bump.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < ball.radius + bump.radius) {
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const overlap = (ball.radius + bump.radius) - dist;
                            ball.x += nx * overlap;
                            ball.y += ny * overlap;

                            const speed = 18;
                            ball.vx = nx * speed;
                            ball.vy = ny * speed;
                            bump.hitTime = Date.now();
                            if (step === 0) { // スコア加算は1フレームに1回
                                scoreRef.current += 100;
                                setScore(scoreRef.current);
                            }
                        }
                    });

                    // 3. フリッパー
                    flippers.current.forEach(f => {
                        const ex = f.x + Math.cos(f.angle) * f.length;
                        const ey = f.y + Math.sin(f.angle) * f.length;
                        const dx = ex - f.x;
                        const dy = ey - f.y;
                        const lenSq = dx * dx + dy * dy;
                        const t = Math.max(0, Math.min(1, ((ball.x - f.x) * dx + (ball.y - f.y) * dy) / lenSq));
                        const cx = f.x + t * dx;
                        const cy = f.y + t * dy;
                        const dist = Math.sqrt((ball.x - cx) ** 2 + (ball.y - cy) ** 2);

                        if (dist < ball.radius + f.width / 2) {
                            const nx = (ball.x - cx) / dist;
                            const ny = (ball.y - cy) / dist;
                            const overlap = (ball.radius + f.width / 2) - dist;
                            ball.x += nx * overlap;
                            ball.y += ny * overlap;

                            const fv = Math.abs(f.targetAngle - f.angle) * 40;
                            const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2) + fv + 10;
                            const outAngle = f.angle - Math.PI / 2;
                            ball.vx = Math.cos(outAngle) * speed;
                            ball.vy = Math.sin(outAngle) * speed;
                        }
                    });

                    // アウト判定
                    if (ball.y > CANVAS_HEIGHT + 20) {
                        balls.current.splice(bIdx, 1);
                        if (lives > 1) {
                            setLives(l => l - 1);
                            setTimeout(launchBall, 800);
                        } else {
                            setLives(0);
                            setIsGameOver(true);
                        }
                    }
                });
            }
        };

        const render = () => {
            if (!ctx) return;
            ctx.fillStyle = '#000022';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // 壁
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            walls.current.forEach(w => {
                ctx.beginPath(); ctx.moveTo(w.x1, w.y1); ctx.lineTo(w.x2, w.y2); ctx.stroke();
            });

            // バンパー
            bumpers.current.forEach(b => {
                const s = Date.now() - b.hitTime < 100 ? 5 : 0;
                ctx.fillStyle = b.color;
                ctx.beginPath(); ctx.arc(b.x, b.y, b.radius + s, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
            });

            // フリッパー
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 14;
            flippers.current.forEach(f => {
                ctx.beginPath(); ctx.moveTo(f.x, f.y);
                ctx.lineTo(f.x + Math.cos(f.angle) * f.length, f.y + Math.sin(f.angle) * f.length);
                ctx.stroke();
            });

            // ボール
            balls.current.forEach(b => {
                ctx.fillStyle = b.color;
                ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
            });

            // UI
            ctx.fillStyle = '#ffff00';
            ctx.font = '14px monospace';
            ctx.fillText(`SCORE: ${scoreRef.current.toString().padStart(8, '0')}`, 10, 25);
            ctx.fillText(`BALLS: ${'●'.repeat(lives)}`, 10, 45);

            if (isGameOver) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.fillStyle = '#f00';
                ctx.font = '24px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                ctx.font = '14px monospace';
                ctx.fillStyle = '#fff';
                ctx.fillText('Press [R] to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
                ctx.textAlign = 'left';
            }
        };

        const loop = () => {
            physicsStep();
            render();
            animeId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animeId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isGameOver, lives]);

    return (
        <div className="flex flex-col items-center bg-black p-4 select-none">
            <div className="border-4 border-gray-600 shadow-2xl overflow-hidden bg-gray-900">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="block"
                    style={{ imageRendering: 'pixelated', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
                />
            </div>
            <div className="mt-4 text-[10px] text-gray-500 font-mono text-center">
                [Shift] or [Left/Right Keys] to Flip | [R] to Reset<br />
                Sub-stepping Physics v2.0
            </div>
        </div>
    );
};
