import React, { useEffect, useRef, useState } from 'react';
import './adventure.css';
import { useNavigate } from 'react-router-dom';

// --- GAME CONSTANTS ---
const TILE_SIZE = 32; // px
const GRID_W = 16;
const GRID_H = 12;
const PLAYER_COLOR = '#fff';
const WALL_COLOR = '#a00';
const FLOOR_COLOR = '#888';
const BIG_W = 26;
const BIG_H = 18;

// Room wall colors
const ROOM_COLORS = {
  'room_0_0': '#a00', // red
  'room_0_1': '#0a0', // green
  'room_0_2': '#00a', // blue
  'room_1_0': '#aa0', // yellow
  'room_1_1': '#a0a', // magenta
  'room_1_2': '#0aa', // cyan
  'room_2_0': '#fa0', // orange
  'room_2_1': '#0af', // light blue
  'room_2_2': '#222', // dark/black
};

// Helper to make a room with exits (up, down, left, right) and obstacles
function makeRoom({ up, down, left, right, obstacles = [], floorOverride = [] }) {
  // Start with all walls
  const room = Array(GRID_H).fill().map(() => Array(GRID_W).fill(1));
  // Make interior floor
  for (let y = 1; y < GRID_H - 1; y++)
    for (let x = 1; x < GRID_W - 1; x++)
      room[y][x] = 0;
  // Add exits (holes in wall)
  if (up) room[0][up] = 0;
  if (down) room[GRID_H - 1][down] = 0;
  if (left) room[left][0] = 0;
  if (right) room[right][GRID_W - 1] = 0;
  // Add obstacles (array of [x, y])
  for (const [x, y] of obstacles) room[y][x] = 1;
  // Add floorOverride (array of [x, y])
  for (const [x, y] of floorOverride) room[y][x] = 0;
  return room;
}

function makeBigRoom() {
  // Start with all floor
  const room = Array(BIG_H).fill().map(() => Array(BIG_W).fill(0));
  // Draw border walls
  for (let x = 0; x < BIG_W; x++) room[0][x] = room[BIG_H-1][x] = 1;
  for (let y = 0; y < BIG_H; y++) room[y][0] = room[y][BIG_W-1] = 1;
  // Add exits: left (y=BIG_H/2), right (y=BIG_H/2), up (x=BIG_W/2), down (x=BIG_W/2)
  const midY = Math.floor(BIG_H/2);
  const midX = Math.floor(BIG_W/2);
  room[midY][0] = 0;
  room[midY][BIG_W-1] = 0;
  room[0][midX] = 0;
  room[BIG_H-1][midX] = 0;
  // Make sure under/over/side each exit is also floor
  if (midY+1 < BIG_H) room[midY+1][0] = 0;
  if (midY-1 >= 0) room[midY-1][0] = 0;
  if (midY+1 < BIG_H) room[midY+1][BIG_W-1] = 0;
  if (midY-1 >= 0) room[midY-1][BIG_W-1] = 0;
  if (midX+1 < BIG_W) room[0][midX+1] = 0;
  if (midX-1 >= 0) room[0][midX-1] = 0;
  if (midX+1 < BIG_W) room[BIG_H-1][midX+1] = 0;
  if (midX-1 >= 0) room[BIG_H-1][midX-1] = 0;
  // Also make sure the tile below the top exit and above the bottom exit are floor
  if (1 < BIG_H) room[1][midX] = 0;
  if (BIG_H-2 >= 0) room[BIG_H-2][midX] = 0;
  // And left/right
  if (1 < BIG_W) room[midY][1] = 0;
  if (BIG_W-2 >= 0) room[midY][BIG_W-2] = 0;
  return room;
}

// 3x3 grid of rooms
const ROOMS = {};
// Room coordinates: [row, col] (row: 0-2, col: 0-2)
// Each room: exits (up, down, left, right) = x or y coordinate of hole
// Obstacles: array of [x, y] positions
ROOMS['room_0_0'] = makeRoom({ 
  down: 8, 
  right: 6, 
  obstacles: [
    // L-shaped obstacle
    [4,4], [5,4], [6,4],
    [4,5], [4,6],
    // Small square
    [10,8], [11,8],
    [10,9], [11,9]
  ] 
});
ROOMS['room_0_1'] = makeRoom({ 
  down: 8, 
  left: 6, 
  right: 8, 
  obstacles: [
    // Zigzag pattern
    [3,3], [4,4], [5,3], [6,4], [7,3], [8,4], [9,3],
    // T-shaped obstacle
    [12,6], [13,6], [14,6],
    [13,7], [13,8]
  ] 
});
ROOMS['room_0_2'] = makeRoom({ 
  down: 8, 
  left: 8, 
  obstacles: [
    // Spiral pattern
    [2,2], [3,2], [4,2], [5,2],
    [5,3], [5,4], [5,5],
    [4,5], [3,5], [2,5],
    [2,4], [2,3],
    [3,3], [4,3],
    // Small maze
    [10,8], [11,8], [12,8],
    [10,9], [12,9],
    [10,10], [11,10], [12,10]
  ] 
});
ROOMS['room_1_0'] = makeRoom({ 
  up: 8, 
  down: 8, 
  right: 6, 
  obstacles: [
    // Cross pattern
    [6,4], [7,4], [8,4],
    [7,3], [7,5],
    // Diamond
    [11,7], [12,6], [13,7], [12,8]
  ] 
});
ROOMS['room_1_1'] = makeRoom({ 
  up: 8, 
  down: 8, 
  left: 6, 
  right: 8, 
  obstacles: [
    // Maze-like pattern
    [5,2], [6,2], [7,2], [8,2], [9,2],
    [5,3], [9,3],
    [5,4], [6,4], [7,4], [8,4], [9,4],
    [5,5], [9,5],
    [5,6], [6,6], [7,6], [8,6], [9,6],
    // Additional obstacles
    [11,4], [12,4], [13,4],
    [11,5], [13,5],
    [11,6], [12,6], [13,6]
  ] 
});
ROOMS['room_1_2'] = makeRoom({ 
  up: 8, 
  down: 8, 
  left: 8, 
  obstacles: [
    // Star pattern
    [6,4], [7,4], [8,4],
    [7,3], [7,5],
    [6,6], [8,6],
    // Arrow
    [11,3], [12,3], [13,3],
    [12,4],
    [11,5], [12,5], [13,5]
  ] 
});
ROOMS['room_2_0'] = makeRoom({ 
  up: 8, 
  right: 6, 
  obstacles: [
    // Castle-like structure
    [4,4], [5,4], [6,4], [7,4], [8,4],
    [4,5], [8,5],
    [4,6], [5,6], [6,6], [7,6], [8,6],
    // Small maze
    [11,8], [12,8], [13,8],
    [11,9], [13,9],
    [11,10], [12,10], [13,10]
  ] 
});
ROOMS['room_2_1'] = makeRoom({ 
  up: 8, 
  left: 6, 
  right: 8, 
  obstacles: [
    // Complex pattern
    [3,3], [4,3], [5,3], [6,3],
    [3,4], [6,4],
    [3,5], [4,5], [5,5], [6,5],
    // Additional obstacles
    [10,7], [11,7], [12,7],
    [10,8], [12,8],
    [10,9], [11,9], [12,9]
  ] 
});
ROOMS['room_2_2'] = makeRoom({ 
  up: 8, 
  left: 8, 
  obstacles: [
    // Final challenge pattern
    [2,2], [3,2], [4,2], [5,2], [6,2],
    [2,3], [6,3],
    [2,4], [3,4], [4,4], [5,4], [6,4],
    [2,5], [6,5],
    [2,6], [3,6], [4,6], [5,6], [6,6],
    // Additional obstacles
    [9,8], [10,8], [11,8],
    [9,9], [11,9],
    [9,10], [10,10], [11,10]
  ] 
});
ROOMS['room_2_2'][11][8] = 0; // Ensure bottom center is a floor tile (exit)
ROOMS['big_room'] = makeBigRoom();

// Map of exits: {from, dir, x, y, to, toX, toY}
const EXITS = [
  // row 0
  { from: 'room_0_0', dir: 'down', x: 8, y: 11, to: 'room_1_0', toX: 8, toY: 1 },
  { from: 'room_0_0', dir: 'right', x: 15, y: 6, to: 'room_0_1', toX: 1, toY: 6 },
  { from: 'room_0_1', dir: 'down', x: 8, y: 11, to: 'room_1_1', toX: 8, toY: 1 },
  { from: 'room_0_1', dir: 'left', x: 0, y: 6, to: 'room_0_0', toX: 14, toY: 6 },
  { from: 'room_0_1', dir: 'right', x: 15, y: 8, to: 'room_0_2', toX: 1, toY: 8 },
  { from: 'room_0_2', dir: 'down', x: 8, y: 11, to: 'room_1_2', toX: 8, toY: 1 },
  { from: 'room_0_2', dir: 'left', x: 0, y: 8, to: 'room_0_1', toX: 14, toY: 8 },
  // row 1
  { from: 'room_1_0', dir: 'up', x: 8, y: 0, to: 'room_0_0', toX: 8, toY: 10 },
  { from: 'room_1_0', dir: 'down', x: 8, y: 11, to: 'room_2_0', toX: 8, toY: 1 },
  { from: 'room_1_0', dir: 'right', x: 15, y: 6, to: 'room_1_1', toX: 1, toY: 6 },
  { from: 'room_1_1', dir: 'up', x: 8, y: 0, to: 'room_0_1', toX: 8, toY: 10 },
  { from: 'room_1_1', dir: 'down', x: 8, y: 11, to: 'room_2_1', toX: 8, toY: 1 },
  { from: 'room_1_1', dir: 'left', x: 0, y: 6, to: 'room_1_0', toX: 14, toY: 6 },
  { from: 'room_1_1', dir: 'right', x: 15, y: 8, to: 'room_1_2', toX: 1, toY: 8 },
  { from: 'room_1_2', dir: 'up', x: 8, y: 0, to: 'room_0_2', toX: 8, toY: 10 },
  { from: 'room_1_2', dir: 'down', x: 8, y: 11, to: 'room_2_2', toX: 8, toY: 1 },
  { from: 'room_1_2', dir: 'left', x: 0, y: 8, to: 'room_1_1', toX: 14, toY: 8 },
  // row 2
  { from: 'room_2_0', dir: 'up', x: 8, y: 0, to: 'room_1_0', toX: 8, toY: 10 },
  { from: 'room_2_0', dir: 'right', x: 15, y: 6, to: 'room_2_1', toX: 1, toY: 6 },
  { from: 'room_2_1', dir: 'up', x: 8, y: 0, to: 'room_1_1', toX: 8, toY: 10 },
  { from: 'room_2_1', dir: 'left', x: 0, y: 6, to: 'room_2_0', toX: 14, toY: 6 },
  { from: 'room_2_1', dir: 'right', x: 15, y: 8, to: 'room_2_2', toX: 1, toY: 8 },
  { from: 'room_2_2', dir: 'up', x: 8, y: 0, to: 'room_1_2', toX: 8, toY: 10 },
  { from: 'room_2_2', dir: 'left', x: 0, y: 8, to: 'room_2_1', toX: 14, toY: 8 },
];

// Add exits to and from big_room
EXITS.push(
  { from: 'room_2_2', dir: 'down', x: 8, y: 11, to: 'big_room', toX: Math.floor(BIG_W/2), toY: Math.floor(BIG_H/2) },
  { from: 'big_room', dir: 'up', x: Math.floor(BIG_W/2), y: 0, to: 'room_2_2', toX: 8, toY: 10 }
);

const PLAYER_START = { x: 8, y: 6, screen: 'room_1_1' };

function AdventureGame() {
  const [player, setPlayer] = useState({ ...PLAYER_START });
  const [screen, setScreen] = useState(PLAYER_START.screen);
  const [showVictory, setShowVictory] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Focus canvas on mount
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, []);

  // Handle victory state
  useEffect(() => {
    if (screen === 'big_room') {
      setShowVictory(true);
      const timer = setTimeout(() => {
        navigate('/'); // Redirect to home page
      }, 10000); // Changed to 10 seconds
      return () => clearTimeout(timer);
    }
  }, [screen, navigate]);

  // Handle movement
  useEffect(() => {
    function handleKey(e) {
      if (screen === 'big_room') return; // Disable movement in big room
      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp' || e.key === 'w') dy = -1;
      if (e.key === 'ArrowDown' || e.key === 's') dy = 1;
      if (e.key === 'ArrowLeft' || e.key === 'a') dx = -1;
      if (e.key === 'ArrowRight' || e.key === 'd') dx = 1;
      if (dx === 0 && dy === 0) return;
      e.preventDefault();
      movePlayer(dx, dy);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, screen]);

  function movePlayer(dx, dy) {
    const map = ROOMS[screen];
    let nx = player.x + dx;
    let ny = player.y + dy;
    // Check for exit
    for (const exit of EXITS) {
      if (
        exit.from === screen &&
        exit.x === player.x &&
        exit.y === player.y &&
        ((dx === 0 && exit.dir === 'up' && dy === -1) ||
         (dx === 0 && exit.dir === 'down' && dy === 1) ||
         (dy === 0 && exit.dir === 'left' && dx === -1) ||
         (dy === 0 && exit.dir === 'right' && dx === 1))
      ) {
        setScreen(exit.to);
        setPlayer({ x: exit.toX, y: exit.toY, screen: exit.to });
        return;
      }
    }
    // Out of bounds?
    if (nx < 0 || nx >= GRID_W || ny < 0 || ny >= GRID_H) return;
    const tile = map[ny][nx];
    if (tile === 1) return; // wall
    setPlayer({ ...player, x: nx, y: ny });
  }

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Special handling for big_room
    if (screen === 'big_room') {
      ctx.clearRect(0, 0, TILE_SIZE * BIG_W, TILE_SIZE * BIG_H);
      const map = ROOMS[screen];
      for (let y = 0; y < BIG_H; y++) {
        for (let x = 0; x < BIG_W; x++) {
          ctx.fillStyle = map[y][x] === 1 ? '#a00' : FLOOR_COLOR;
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
      ctx.fillStyle = PLAYER_COLOR;
      ctx.fillRect(player.x * TILE_SIZE + 8, player.y * TILE_SIZE + 8, TILE_SIZE - 16, TILE_SIZE - 16);
      return;
    }
    ctx.clearRect(0, 0, TILE_SIZE * GRID_W, TILE_SIZE * GRID_H);
    const map = ROOMS[screen];
    const wallColor = ROOM_COLORS[screen] || '#a00';
    for (let y = 0; y < GRID_H; y++) {
      for (let x = 0; x < GRID_W; x++) {
        ctx.fillStyle = map[y][x] === 1 ? wallColor : FLOOR_COLOR;
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(player.x * TILE_SIZE + 8, player.y * TILE_SIZE + 8, TILE_SIZE - 16, TILE_SIZE - 16);
  }, [player, screen]);

  return (
    <div className="adventure-game-fullscreen">
      <div style={{position:'relative', width: screen === 'big_room' ? TILE_SIZE * BIG_W : TILE_SIZE * GRID_W, margin:'0 auto'}}>
        <canvas
          ref={canvasRef}
          width={screen === 'big_room' ? TILE_SIZE * BIG_W : TILE_SIZE * GRID_W}
          height={screen === 'big_room' ? TILE_SIZE * BIG_H : TILE_SIZE * GRID_H}
          style={{ border: '4px solid #222', background: '#000', display: 'block', margin: '40px auto' }}
          tabIndex={0}
          onClick={() => canvasRef.current && canvasRef.current.focus()}
        />
        {showVictory && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#4CAF50',
            fontSize: '3rem',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            textShadow: '2px 2px 8px #000, 0 0 16px #fff',
            letterSpacing: '0.1em',
            userSelect: 'none',
            textAlign: 'center',
            animation: 'fadeIn 1s ease-in'
          }}>
            <div>YOU FOUND THE FLAG!</div>
            <div style={{ fontSize: '2rem', marginTop: '20px', color: '#fff' }}>
              flag_solved()
            </div>
            <div style={{ fontSize: '1.5rem', marginTop: '20px' }}>
              Redirecting in 10 seconds...
            </div>
          </div>
        )}
      </div>
      <div className="adventure-instructions">
        <p>Sterowanie: strzałki lub WASD</p>
      </div>
    </div>
  );
}

export default AdventureGame; 