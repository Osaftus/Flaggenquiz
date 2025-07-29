const express = require("express");
const cors = require("cors");
const path = require("path"); // <--- NEU
const app = express();
const PORT = 3000;

const quizData = require("./data");

app.use(cors());

// 🔧 Statische Dateien aus dem ../client-Ordner bereitstellen
app.use(express.static(path.join(__dirname, "../client")));

app.get("/api/quiz/:region", (req, res) => {
  const region = req.params.region;
  const questions = quizData[region];
  if (!questions) {
    return res.status(404).json({ error: "Region nicht gefunden" });
  }
  res.json(questions);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft unter http://localhost:${PORT}`);
});
