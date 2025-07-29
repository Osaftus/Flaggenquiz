const API_URL = `${window.location.origin}/api/quiz/`;
let currentRegion = "";
let regionData = [];
let currentQuestion = 0;
let score = 0;

const flagImg = document.getElementById("flag");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");

function startQuiz(region) {
  fetch(API_URL + region)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP-Fehler ${res.status}`);
      return res.json();
    })
    .then(data => {
      currentRegion = region;
      regionData = shuffleArray([...data]);
      currentQuestion = 0;
      score = 0;

      document.getElementById("menu").style.display = "none";
      document.getElementById("quiz").style.display = "block";
      document.getElementById("end-screen").style.display = "none";

      loadQuestion();
    })
    .catch(err => {
      alert("❌ Fehler beim Laden der Fragen: " + err.message);
    });
}

function loadQuestion() {
  feedback.textContent = "";
  nextBtn.style.display = "none";
  const question = regionData[currentQuestion];
  flagImg.src = question.flag;
  optionsContainer.innerHTML = "";

  const shuffledOptions = shuffleArray([...question.options]);
  shuffledOptions.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selected) {
  const correct = regionData[currentQuestion].country;
  if (selected === correct) score++;

  feedback.textContent = selected === correct ? "✅ Richtig!" : `❌ Falsch! Richtige Antwort: ${correct}`;
  Array.from(optionsContainer.children).forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.style.backgroundColor = "#c8e6c9";
    else if (btn.textContent === selected) btn.style.backgroundColor = "#ffcdd2";
  });

  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  currentQuestion++;
  if (currentQuestion < regionData.length) loadQuestion();
  else showEndScreen();
};

function showEndScreen() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("end-screen").style.display = "block";
  document.getElementById("score").textContent = `Du hast ${score} von ${regionData.length} Punkten erreicht.`;
}

function returnToMenu() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("quiz").style.display = "none";
  document.getElementById("end-screen").style.display = "none";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
