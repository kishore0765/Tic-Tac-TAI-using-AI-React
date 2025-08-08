export const getAIMoverFromOpenRouter = async (board) => {
    console.log(import.meta.VITE_OPENROUTER_API_KEY)
    const systemPrompt = `
        You are a smart Tic Tac Toe AI is playing as "O".

        Your goal:
        1. Win the game if possible.
        2. Block the opponent if they are about to win.
        3. Otherwise : choose center > corners > sides.

        Only return ONE number (0-8). Do not explain.
    `

    const userPrompt = `
        Current board :${JSON.stringify(board)}

        Each cell is indexed like this:
        [0][1][2]
        [3][4][5]
        [6][7][8]

        "O" = you (AI)
        "X" = human
        null = empty 

        what is your move?
    `


    const getMoveFromClaude = async () => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer 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`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                temperature: 0.2,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            })
        })
        console.log(response)

        const data = await response.json();

        console.log(data)

        const text = data.choices?.[0]?.message?.content?.trim()

        console.log(text)

        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    }

        try {
            let move = await getMoveFromClaude();
            return move;
        
        }catch (error) {
            console.error("AI", error);
            const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];
            return preferredOrder.find(index => board[index] === null );

        }

    }
