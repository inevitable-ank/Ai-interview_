import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    
    const audioFile = req.body.audio;

    if (!audioFile) {
      return res.status(400).json({ error: "Audio file is required." });
    }

    // Transcription API 
    const transcriptionResponse = await fetch("https://api.transcription-service.com/transcribe", {
      method: "POST",
      headers: {
        "Authorization": `Bearer YOUR_API_KEY_HERE`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio: audioFile }),
    });

    if (!transcriptionResponse.ok) {
      return res.status(500).json({ error: "Failed to transcribe audio." });
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcription = transcriptionData.text; 

    res.status(200).json({ transcription });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
