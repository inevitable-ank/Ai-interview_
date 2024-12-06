// Gemini For Backend
// Don't want to use it

import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ error: "Response is required." });
    }

    
    const geminiResponse = await fetch("https://api.gemini.com/v1/generate-question", {
      method: "POST",
      headers: {
        "Authorization": `Bearer YOUR_GEMINI_API_KEY`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: response }),
    });

    if (!geminiResponse.ok) {
      return res.status(500).json({ error: "Failed to generate a question." });
    }

    const data = await geminiResponse.json();
    const nextQuestion = data.generatedQuestion;

    res.status(200).json({ nextQuestion });
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
