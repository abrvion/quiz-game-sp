import "./style.css";

// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text"); // Double check HTML matches this!
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// Quiz Data Array
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

// Application State Variables
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// Initialize Static Content safely
if (totalQuestionsSpan && maxScoreSpan) {
  totalQuestionsSpan.textContent = quizQuestions.length;
  maxScoreSpan.textContent = quizQuestions.length;
}

// Event Listeners
if (startButton) startButton.addEventListener("click", startQuiz);
if (restartButton) restartButton.addEventListener("click", restartQuiz);

// Core Engineering Functions
function startQuiz() {
  console.log("Execution: Start Quiz triggered.");
  currentQuestionIndex = 0;
  score = 0;
  if (scoreSpan) scoreSpan.textContent = score;

  // View Transitions
  if (startScreen) startScreen.classList.remove("active");
  if (resultScreen) resultScreen.classList.remove("active");
  if (quizScreen) quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  answersDisabled = false;

  // CRITICAL FIX: Read from the data array (quizQuestions), NOT the DOM node container (quizScreen)
  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    console.error(
      "Architect Alert: No question data exists at index: " +
        currentQuestionIndex,
    );
    return;
  }

  if (currentQuestionSpan) {
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
  }

  // Progress Bar update using standard arithmetic clustering
  if (progressBar) {
    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + "%";
  }

  // Inject question text safely
  if (questionText) {
    questionText.textContent = currentQuestion.question;
  } else {
    console.error(
      "Architect Alert: DOM element 'question-text' is null. Check your HTML spelling!",
    );
  }

  // Clear container options cleanly
  if (answersContainer) {
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.textContent = answer.text;
      button.classList.add("answer-btn");
      button.dataset.correct = answer.correct;

      button.addEventListener("click", selectAnswer);
      answersContainer.appendChild(button);
    });
  }
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    if (scoreSpan) scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  if (quizScreen) quizScreen.classList.remove("active");
  if (resultScreen) resultScreen.classList.add("active");

  if (finalScoreSpan) finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (resultMessage) {
    if (percentage === 100) {
      resultMessage.textContent = "Perfect! You're a genius!";
    } else if (percentage >= 80) {
      resultMessage.textContent = "Great job, you know your stuff!";
    } else if (percentage >= 60) {
      resultMessage.textContent = "Good effort, keep learning!";
    } else {
      resultMessage.textContent = "Keep studying. You'll get better!";
    }
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  startQuiz();
}
