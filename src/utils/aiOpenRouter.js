// utils/aiOpenRouter.js

export const getAIMoverFromOpenRouter = async (board) => {
    // Access the API key from environment variables
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    

    const systemPrompt = `
        You are a smart Tic Tac Toe AI is playing as "O".

        Your goal:
        1. Win the game if possible.
        2. Block the opponent if they are about to win.
        3. Otherwise : choose center > corners > sides.

        Only return ONE number (0-8). Do not explain.
    `;

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
    `;

    const getMoveFromClaude = async () => {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                // --- Add these lines ---
                "HTTP-Referer": `${window.location.hostname}`,
                "X-Title": "Tic Tac TAI",
                // ----------------------
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b:free",
                temperature: 0.2,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            console.error("API request failed:", response.status, response.statusText);
            throw new Error("API request failed");
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    };

    try {
        let move = await getMoveFromClaude();
        return move;
    } catch (error) {
        console.error("AI move fetch failed, falling back to default logic:", error);
        // Fallback logic if the API fails
        const preferredOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7];
        return preferredOrder.find(index => board[index] === null);
    }
};