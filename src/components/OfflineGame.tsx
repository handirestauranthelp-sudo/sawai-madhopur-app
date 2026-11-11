import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';

interface OfflineGameProps {
  onRetryConnection?: () => void;
  isOfflineMode?: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'rock' | 'bird';
  speed: number;
}

export const OfflineGame: React.FC<OfflineGameProps> = ({ onRetryConnection, isOfflineMode = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sm_tiger_high_score');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game physics state refs to avoid closure stalls in requestAnimationFrame
  const gameState = useRef({
    tigerY: 0,
    tigerVelocityY: 0,
    isJumping: false,
    isDucking: false,
    groundY: 150,
    obstacles: [] as Obstacle[],
    frameCount: 0,
    score: 0,
    speed: 4.5,
    animationId: 0
  });

  const jump = useCallback(() => {
    const s = gameState.current;
    if (!s.isJumping) {
      s.tigerVelocityY = -11;
      s.isJumping = true;
      if (soundEnabled) playSound.jump();
    }
  }, [soundEnabled]);

  const startGame = useCallback(() => {
    const s = gameState.current;
    s.tigerY = s.groundY - 36;
    s.tigerVelocityY = 0;
    s.isJumping = false;
    s.isDucking = false;
    s.obstacles = [];
    s.frameCount = 0;
    s.score = 0;
    s.speed = 4.5;

    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    if (soundEnabled) playSound.click();
  }, [soundEnabled]);

  // Handle keyboard / touch inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!isPlaying || gameOver) {
          startGame();
        } else {
          jump();
        }
      } else if (e.code === 'ArrowDown') {
        gameState.current.isDucking = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        gameState.current.isDucking = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, gameOver, jump, startGame]);

  // Main 60fps Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const s = gameState.current;
      s.frameCount++;

      // Increase score & speed
      if (s.frameCount % 5 === 0) {
        s.score++;
        setScore(s.score);
        if (s.score > 0 && s.score % 100 === 0 && soundEnabled) {
          playSound.score();
        }
      }

      if (s.frameCount % 500 === 0 && s.speed < 9.5) {
        s.speed += 0.4;
      }

      // Physics: Gravity
      s.tigerVelocityY += 0.65; // gravity
      s.tigerY += s.tigerVelocityY;

      const defaultTigerHeight = s.isDucking ? 20 : 36;
      const groundPos = s.groundY - defaultTigerHeight;

      if (s.tigerY >= groundPos) {
        s.tigerY = groundPos;
        s.tigerVelocityY = 0;
        s.isJumping = false;
      }

      // Spawn Obstacles
      const minDistance = Math.max(70, 160 - s.speed * 8);
      const lastObstacle = s.obstacles[s.obstacles.length - 1];
      const canSpawn = !lastObstacle || (canvas.width - lastObstacle.x > minDistance);

      if (canSpawn && Math.random() < 0.025) {
        const isAir = Math.random() > 0.7 && s.score > 50;
        if (isAir) {
          // Bird
          s.obstacles.push({
            x: canvas.width,
            y: s.groundY - 50,
            width: 24,
            height: 16,
            type: 'bird',
            speed: s.speed + 1.2
          });
        } else {
          // Rock or Cactus
          const isRock = Math.random() > 0.5;
          s.obstacles.push({
            x: canvas.width,
            y: s.groundY - (isRock ? 22 : 32),
            width: isRock ? 22 : 18,
            height: isRock ? 22 : 32,
            type: isRock ? 'rock' : 'cactus',
            speed: s.speed
          });
        }
      }

      // Move & filter obstacles
      for (let i = 0; i < s.obstacles.length; i++) {
        s.obstacles[i].x -= s.obstacles[i].speed;
      }
      s.obstacles = s.obstacles.filter(obs => obs.x + obs.width > -20);

      // Collision Detection
      const tigerBox = {
        x: 36,
        y: s.tigerY + 4,
        width: 38,
        height: defaultTigerHeight - 4
      };

      for (const obs of s.obstacles) {
        const obsBox = {
          x: obs.x + 3,
          y: obs.y + 2,
          width: obs.width - 6,
          height: obs.height - 4
        };

        if (
          tigerBox.x < obsBox.x + obsBox.width &&
          tigerBox.x + tigerBox.width > obsBox.x &&
          tigerBox.y < obsBox.y + obsBox.height &&
          tigerBox.y + tigerBox.height > obsBox.y
        ) {
          // Hit! Game over
          if (soundEnabled) playSound.gameOver();
          setGameOver(true);
          setIsPlaying(false);

          if (s.score > highScore) {
            setHighScore(s.score);
            try {
              localStorage.setItem('sm_tiger_high_score', s.score.toString());
            } catch {
              // Ignore
            }
          }
          return;
        }
      }

      // --- RENDER ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Sky & Ranthambore Fort silhouette hills
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.7, '#1e293b');
      bgGrad.addColorStop(1, '#334155');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 15; i++) {
        const starX = (i * 27 + s.frameCount * 0.1) % canvas.width;
        const starY = (i * 13) % (s.groundY - 50);
        ctx.fillRect(starX, starY, 1.5, 1.5);
      }

      // Distant Aravalli hills / Ranthambore fort silhouette
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(40, s.groundY - 25);
      ctx.lineTo(90, s.groundY - 15);
      ctx.lineTo(140, s.groundY - 35);
      ctx.lineTo(200, s.groundY - 20);
      ctx.lineTo(260, s.groundY - 40);
      ctx.lineTo(320, s.groundY - 22);
      ctx.lineTo(canvas.width, s.groundY);
      ctx.closePath();
      ctx.fill();

      // Ground Line
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(canvas.width, s.groundY);
      ctx.stroke();

      // Ground details (moving track pebbles)
      ctx.fillStyle = '#b45309';
      for (let i = 0; i < 12; i++) {
        const px = ((i * 35) - (s.frameCount * s.speed * 0.8)) % canvas.width;
        const finalPx = px < 0 ? px + canvas.width : px;
        ctx.fillRect(finalPx, s.groundY + 4 + (i % 3) * 3, 4, 2);
      }

      // Render Obstacles
      for (const obs of s.obstacles) {
        if (obs.type === 'cactus') {
          // Desert cactus
          ctx.fillStyle = '#10b981';
          ctx.fillRect(obs.x + 6, obs.y, 6, obs.height);
          // branches
          ctx.fillRect(obs.x, obs.y + 8, 6, 4);
          ctx.fillRect(obs.x, obs.y + 4, 3, 6);
          ctx.fillRect(obs.x + 12, obs.y + 12, 6, 4);
          ctx.fillRect(obs.x + 15, obs.y + 8, 3, 6);
        } else if (obs.type === 'rock') {
          // Ancient fortress rock
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + 6, obs.y);
          ctx.lineTo(obs.x + obs.width - 4, obs.y + 4);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(obs.x + 4, obs.y + 5, 4, 4);
        } else if (obs.type === 'bird') {
          // Bird flapping
          ctx.fillStyle = '#38bdf8';
          const wingOffset = Math.sin(s.frameCount * 0.25) * 5;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + 8);
          ctx.lineTo(obs.x + 10, obs.y + 8 + wingOffset);
          ctx.lineTo(obs.x + 18, obs.y + 8);
          ctx.lineTo(obs.x + 10, obs.y + 12);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Render Player: Ranthambore Royal Tiger 🐅
      const tx = 36;
      const ty = s.tigerY;
      const legRun = Math.sin(s.frameCount * 0.35) * 4;

      // Tiger Body (Orange striped)
      ctx.fillStyle = '#f97316'; // Tiger orange
      if (s.isDucking) {
        ctx.fillRect(tx, ty + 6, 42, 14); // lower crouch
      } else {
        ctx.fillRect(tx + 4, ty + 8, 32, 18); // torso
        // Head
        ctx.fillRect(tx + 30, ty, 14, 16);
        // Ears
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(tx + 32, ty - 4, 4, 5);
        ctx.fillRect(tx + 38, ty - 4, 4, 5);
        // Eye
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(tx + 38, ty + 4, 3, 3);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(tx + 39, ty + 5, 2, 2);
        // Snout
        ctx.fillStyle = '#ffedd5';
        ctx.fillRect(tx + 41, ty + 9, 4, 5);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(tx + 43, ty + 8, 2, 2);
      }

      // Tiger Black Stripes
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(tx + 12, ty + 9, 3, 8);
      ctx.fillRect(tx + 19, ty + 9, 3, 9);
      ctx.fillRect(tx + 26, ty + 9, 3, 7);

      // Tail
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tx + 4, ty + 12);
      const tailWiggle = Math.sin(s.frameCount * 0.2) * 5;
      ctx.quadraticCurveTo(tx - 6, ty + 4 + tailWiggle, tx - 10, ty + 10);
      ctx.stroke();

      // Legs
      if (!s.isDucking) {
        ctx.fillStyle = '#ea580c';
        // Front legs
        ctx.fillRect(tx + 28 + legRun, ty + 24, 4, 12);
        ctx.fillRect(tx + 33 - legRun, ty + 24, 4, 12);
        // Back legs
        ctx.fillRect(tx + 6 - legRun, ty + 24, 4, 12);
        ctx.fillRect(tx + 12 + legRun, ty + 24, 4, 12);
      }

      s.animationId = requestAnimationFrame(loop);
    };

    gameState.current.animationId = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(gameState.current.animationId);
    };
  }, [isPlaying, gameOver, soundEnabled, highScore]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 text-white">
      {/* Offline Alert Banner */}
      {isOfflineMode && (
        <div className="w-full max-w-sm mb-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            <span>⚠️ इंटरनेट कनेक्शन नहीं है (No Internet)</span>
          </div>
          <p className="text-xs text-rose-200/90 font-medium leading-relaxed">
            इंटरनेट बंद होने के कारण वेबसाइट लिंक लोड नहीं हो सकता। कृपया अपना डेटा या Wi-Fi ऑन करें।
          </p>
          <p className="mt-2 text-[11px] text-rose-300/80">
            इंटरनेट वापस जुड़ते ही वेबसाइट अपने आप खुल जाएगी।
          </p>
        </div>
      )}

      {/* Game Card Container */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Game Top Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🐅</span>
            <span className="font-bold text-amber-400">Ranthambore Tiger Run</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-400 font-mono">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span className="tabular-nums font-semibold">{highScore}</span>
            </div>

            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              aria-label="Toggle sound"
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Live Score Strip */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/60 text-[11px] font-mono border-b border-slate-800/60">
          <span className="text-slate-400">Score: <strong className="text-white text-xs tabular-nums">{score}</strong></span>
          <span className="text-amber-400/90">Speed: {isPlaying ? gameState.current.speed.toFixed(1) + 'x' : '1.0x'}</span>
        </div>

        {/* Canvas Area */}
        <div 
          className="relative w-full h-[180px] bg-slate-950 cursor-pointer overflow-hidden touch-none"
          onClick={() => {
            if (!isPlaying || gameOver) {
              startGame();
            } else {
              jump();
            }
          }}
        >
          <canvas
            ref={canvasRef}
            width={340}
            height={180}
            className="w-full h-full block"
          />

          {/* Not Playing Overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2 animate-bounce">
                <Play className="w-6 h-6 fill-amber-400 ml-0.5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-0.5">ऑफलाइन गेम खेलें (Play Offline)</h3>
              <p className="text-[11px] text-slate-300 max-w-[220px] mb-3">
                स्क्रीन पर कहीं भी टैप करें या स्पेसबार दबाकर टाइगर को जंप कराएं!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>गेम शुरू करें (Start Run)</span>
              </button>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center animate-in fade-in">
              <span className="text-2xl mb-1">💥</span>
              <h3 className="font-bold text-sm text-rose-400 mb-0.5">गेम ओवर (Game Over!)</h3>
              <p className="text-xs text-slate-300 mb-2 font-mono">
                स्कोर: <span className="font-bold text-white text-sm">{score}</span>
                {score >= highScore && score > 0 && (
                  <span className="ml-1.5 text-amber-400 text-[10px] font-bold">✨ NEW RECORD!</span>
                )}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>फिर से खेलें (Try Again)</span>
              </button>
            </div>
          )}
        </div>

          {/* Bottom simple hint without buttons */}
          <div className="py-2 px-4 bg-slate-950 text-center text-[11px] text-slate-400 border-t border-slate-800">
            जंप करने के लिए स्क्रीन पर कहीं भी टैप करें (Tap anywhere to jump)
          </div>
        </div>
      </div>
  );
};
