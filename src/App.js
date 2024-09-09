import React, { useState } from 'react';
import './App.css';
// ADD COMMENTS

const ROWS = 6;
const COLS = 7;

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
  const [playerOneColor, setPlayerOneColor] = useState('#00ff00'); 
  const [playerTwoColor, setPlayerTwoColor] = useState('#0000ff'); 
  const [fallingDisc, setFallingDisc] = useState({ row: null, col: null });
  const [isResetting, setIsResetting] = useState(false);
  const [winLength, setWinLength] = useState(4); // Set default win length to 4
  const [winner, setWinner] = useState(null);

  const handleClick = (col) => {
    if (isResetting || fallingDisc.row !== null || winner) return;

    const row = findLowestEmptyRow(col);
    if (row === -1) return;

    const newBoard = board.map((rowArr) => [...rowArr]);
    newBoard[row][col] = isPlayerOneTurn ? playerOneColor : playerTwoColor;

    setFallingDisc({ row, col });
    setBoard(newBoard);

    setTimeout(() => {
      setFallingDisc({ row: null, col: null });

      if (checkWin(newBoard, row, col, isPlayerOneTurn ? playerOneColor : playerTwoColor)) {
        setWinner(isPlayerOneTurn ? 'Player 1' : 'Player 2');
      } else {
        setIsPlayerOneTurn(!isPlayerOneTurn);
      }
    }, 500);
  };

  const findLowestEmptyRow = (col) => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  const checkWin = (board, row, col, color) => {
    return (
      checkDirection(board, row, col, color, 0, 1) || // Horizontal
      checkDirection(board, row, col, color, 1, 0) || // Vertical
      checkDirection(board, row, col, color, 1, 1) || // Diagonal /
      checkDirection(board, row, col, color, 1, -1)   // Diagonal \
    );
  };

  const checkDirection = (board, row, col, color, rowDir, colDir) => {
    let count = 1;

    count += countConsecutive(board, row, col, color, rowDir, colDir);
    
    count += countConsecutive(board, row, col, color, -rowDir, -colDir);

    return count >= winLength;
  };

  const countConsecutive = (board, row, col, color, rowDir, colDir) => {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;

    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === color) {
      count++;
      r += rowDir;
      c += colDir;
    }

    return count;
  };

  const resetGame = () => {
    setIsResetting(true);
    setTimeout(() => {
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
      setIsResetting(false);
      setIsPlayerOneTurn(true);
      setWinner(null);
    }, 2000);
  };

  return (
    <div>
      <h1>Connect Four</h1>
      <p>Click a column and play! 
        <br></br><label>Win Condition: Connect </label>
        <select value={winLength} onChange={(e) => setWinLength(parseInt(e.target.value))}>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select></p>
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
                  className={`disc ${fallingDisc.row === rowIndex && fallingDisc.col === colIndex ? 'falling' : ''}`}
                  style={{
                    backgroundColor: cell || 'transparent',
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>      
      <div className="feet"></div>

      {winner && <h2>{winner} Wins!</h2>}

      <button className="reset-btn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default Connect4Board;
