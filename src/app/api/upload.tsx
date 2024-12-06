import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";

// Disable Next.js body parser (required for formidable)


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const uploadsDir = path.join(process.cwd(), "uploads");

    // Ensure the "uploads" folder exists 
    // not working few errors are there
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const form = formidable({ uploadDir: uploadsDir, keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(500).json({ error: "Failed to upload file" });
      }
      console.log("Received fields:", fields);
      console.log("Received files:", files);
      // File is saved to the uploads folder
      console.log("Uploaded file:", files);
      res.status(200).json({ message: "Chunk uploaded successfully!" });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
