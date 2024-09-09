import React, { useState } from 'react';
import './App.css';


const ROWS = 6;
const COLS = 7;

// Utility function to darken the hex color
const darkenColor = (hex, amount) => {
  let color = hex.replace(/^#/, '');

  if (color.length === 3) {
    color = color.split('').map(char => char + char).join('');
  }

  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const Connect4Board = () => {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [playerOneColor, setPlayerOneColor] = useState('#00ff00'); // Changed to hex
  const [playerTwoColor, setPlayerTwoColor] = useState('#0000ff'); // Changed to hex
  const [isResetting, setIsResetting] = useState(false);

  const handleClick = (col) => {
    if (isResetting) return; // Disable click during reset animation
    const row = findLowestEmptyRow(col);
    if (row === -1) return; // Column is full

    const newBoard = board.map((rowArr) => [...rowArr]);

    // Set the color based on the current player
    newBoard[row][col] = isPlayerOneTurn ? playerOneColor : playerTwoColor;

    setBoard(newBoard);
    setIsPlayerOneTurn(!isPlayerOneTurn);
  };

  const findLowestEmptyRow = (col) => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  const resetGame = () => {
    setIsResetting(true);
    // Delay clearing the board until after the animation (1 second)
    setTimeout(() => {
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
      setIsResetting(false);
      setIsPlayerOneTurn(true);
    }, 2000);
  };

  return (
    <div>
      <h1>Connect Four</h1>
      <div className="indicator">
        Current Turn:
        <div
          className="circle-indicator"
          style={{
            backgroundColor: isPlayerOneTurn ? playerOneColor : playerTwoColor,
            border: `3px dashed ${
              isPlayerOneTurn
                ? darkenColor(playerOneColor, 60)
                : darkenColor(playerTwoColor, 60)
            }`,
          }}
        />
      </div>

      {/* Game Board */}
      <div className={`board ${isResetting ? 'resetting' : ''}`}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell ? 'filled' : ''}`}
                onClick={() => handleClick(colIndex)}
              >
                <div
                  className={`disc ${cell ? 'drop' : ''}`}
                  style={{
                    backgroundColor: cell || 'transparent',
                    animationDuration: `${2.5 + rowIndex * 0.1}s`,
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="feet"></div>
      <button className="reset-btn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default Connect4Board;
