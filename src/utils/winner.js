export const checkWinner = (board) => {


    const lines = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column

        [0, 4, 8], // Top-left to bottom-right diagonal
        [2, 4, 6]  // Top-right to bottom-left diagonal
        
    ]
    //loop through each possible winning 
    for(let line of lines){
        const [a, b, c] = line;
        //check
        //1.There is something in board[a] (not null)
        //2. board[a] == board[b] 
        //3. board[a] == board[c]

        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            return {winner: board[a], line};
        }
    }

    //if no winner but all cells are filled, it's a draw

    if(board.every(cell => cell !== null)){
        return {winner: "Draw",line: []};
    }

    //if no winner and board is not full, return null (game continues)
    return {winner: null, line: []};
}
