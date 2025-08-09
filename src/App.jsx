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

  // New state to track if the AI is thinking
  const [isAiThinking, setIsAiThinking] = useState(false);

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
      // Ensure "thinking" message is hidden when game ends
      setIsAiThinking(false); 
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
      // Set thinking to true when AI's turn starts
      setIsAiThinking(true);
      const aiTurn = async () => {
        const move = await getAIMoverFromOpenRouter(board);
        if (move !== null && board[move] === null) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsPlayerTurn(true);
        }
        // Set thinking to false after AI has moved
        setIsAiThinking(false);
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
    <div 
      className='min-h-screen text-white flex flex-col items-center justify-center'
      // Set background image using inline styles
      style={{ 
        backgroundImage: `url('/bg-image.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
      }}
    >
      <h1 className='text-3xl font-bold mb-4 bg-gradient-to-r from-[#38BDF8] to-[#F472B6] text-transparent bg-clip-text'>Tic Tac TAI</h1>
      <ScoreBoard score={score}/>
      <GameBoard board={board} handleClick={handleClick}/>
      
      {/* Display AI thinking message */}
      <div className="h-8 mt-4">
        {isAiThinking && !winner && (
            <div className='text-lg text-slate-400 italic bg-gradient-to-r from-[#38BDF8] to-[#F472B6] text-transparent bg-clip-text '>
              AI is thinking...
            </div>
        )}
      </div>

      {winner && (
        <div className=' text-xl flex items-center gap-5 font-bold'>
          <span className={`
            font-bold
            ${winner === 'X' ? 'text-[#38BDF8]' : ''}
            ${winner === 'O' ? 'text-[#F472B6]' : ''}
          `}>
            {winner === "Draw" ? "It's a draw 🤝" : `${winner} Won 🏆`}
          </span>

          <button onClick={restartGame} className='ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors'>
            Play Again 🖖
          </button>
        </div>
      )}
        
    </div>
  )
}

export default App