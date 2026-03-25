import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const TICK_RATE = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [dir, setDir] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Keep refs updated to avoid dependency issues in setInterval
  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 0, y: -1 });
    setFood(generateFood([{ x: 10, y: 10 }]));
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const changeDirection = (newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const currentDir = dirRef.current;
    switch (newDir) {
      case 'UP':
        if (currentDir.y !== 1) setDir({ x: 0, y: -1 });
        break;
      case 'DOWN':
        if (currentDir.y !== -1) setDir({ x: 0, y: 1 });
        break;
      case 'LEFT':
        if (currentDir.x !== 1) setDir({ x: -1, y: 0 });
        break;
      case 'RIGHT':
        if (currentDir.x !== -1) setDir({ x: 1, y: 0 });
        break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isPlaying || gameOver) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        changeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
      touchStartRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      const currentSnake = [...snakeRef.current];
      if (currentSnake.length === 0) return;
      
      const head = { ...currentSnake[0] };
      const currentDir = dirRef.current;

      head.x += currentDir.x;
      head.y += currentDir.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Self collision
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      currentSnake.unshift(head);

      // Food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10);
        setFood(generateFood(currentSnake));
      } else {
        currentSnake.pop();
      }

      setSnake(currentSnake);
    };

    const intervalId = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [isPlaying, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Score Board */}
      <div className="flex items-center justify-between w-full mb-4 px-4 py-3 bg-gray-900/80 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-sm">
        <div className="flex items-center gap-2 text-cyan-400">
          <Trophy className="w-5 h-5" />
          <span className="font-bold tracking-wider text-lg">SCORE</span>
        </div>
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
          {score.toString().padStart(4, '0')}
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative p-2 bg-gray-900/50 border-2 border-cyan-500/50 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-md touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div
          className="grid bg-gray-950/80 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(85vw, 400px)',
            height: 'min(85vw, 400px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isFood = food?.x === x && food?.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full border-[0.5px] border-gray-800/30 ${
                  isSnakeHead
                    ? 'bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)] rounded-sm z-10'
                    : isSnakeBody
                    ? 'bg-fuchsia-400/70 rounded-sm'
                    : isFood
                    ? 'bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.9)] rounded-full scale-75 animate-pulse'
                    : 'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-sm rounded-xl z-20">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-black text-red-500 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">GAME OVER</h2>
                <p className="text-cyan-300 mb-6 font-mono text-lg">Final Score: {score}</p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="font-bold tracking-widest">PLAY AGAIN</span>
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-6 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">SNAKED AND BEATS</h2>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-8 py-4 bg-red-500/20 hover:bg-red-500/40 border border-red-400 text-red-300 rounded-full transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:scale-105 active:scale-95"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span className="font-bold tracking-widest text-lg">START</span>
                </button>
                <p className="mt-6 text-gray-400 text-sm font-mono flex gap-4">
                  <span>[W A S D]</span>
                  <span>[ARROWS]</span>
                  <span className="md:hidden">[SWIPE]</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
