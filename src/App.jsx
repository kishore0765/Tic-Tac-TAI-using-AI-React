import React from 'react'
import ScoreBoard from './components/ScoreBoard';
import GameBoard from './components/GameBoard';
import { useState,useEffect } from 'react';
import { getAIMoverFromOpenRouter } from './utils/aiOpenRouter';
import { checkWinner } from './utils/winner';

const App = () => {

  //State for the 3x3 board (9 cells)
  const [board, setBoard] = useState(Array(9).fill(null));

  //Is it the player's turn or the AI's turn?
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  //Who won? ("X" or "O" or "Draw")
  const [winner, setWinner] = useState(null);

  //Score tracking
  const [score, setScore] = useState({X:0, O:0});

  //when a player clicks a square
  const handleClick = (i)=>{

    if(!isPlayerTurn || board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = "X"; 
    setBoard(newBoard);
    setIsPlayerTurn(false);

  }
  
  useEffect(() => {
    // Don't do anything if the game is already won
    if (winner) return;

    // Check for a winner or a draw
    const gameResult = checkWinner(board);
    if (gameResult.winner) {
      setWinner(gameResult.winner);
      if (gameResult.winner !== 'Draw') {
        setScore((prev) => ({
          ...prev,
          [gameResult.winner]: prev[gameResult.winner] + 1,
        }));
      }
      // Game is over, so we return early and don't proceed to AI's turn.
      return;
    }

    // If it's AI's turn and the game is not over
    if (!isPlayerTurn) {
      const aiTurn = async () => {
        const move = await getAIMoverFromOpenRouter(board);
        if (move !== null && board[move] === null) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
      };
      const timeout = setTimeout(aiTurn, 600);
      return () => clearTimeout(timeout);
    }
  }, [board, isPlayerTurn, winner]);

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  }



  return (
    <div className='min-h-screen bg-[#0f172A] text-white flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold mb-4'>Tic Tac TAI 🤖</h1>
      <ScoreBoard score={score}/>
      <GameBoard board={board} handleClick={handleClick}/>
      {winner && (
        <div className='mt-4 text-xl'>
          {winner === "Draw" ? "Its a draw" : `${winner} won!`}

          <button onClick={restartGame} className='ml-4 px-4 py-2 bg-blue text-black rounded hover:bg-blue-600 '>
            Play Again
          </button>
        </div>
      )}
        
    </div>
  )
}

export default App