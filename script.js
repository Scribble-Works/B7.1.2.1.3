// Word problem bank — all solvable with mental math
const questions = [
    {
        problem: "A pack of pencils costs $2.99. How much do 4 packs cost?",
        correctAnswer: "$11.96",
        options: ["$10.96", "$11.96", "$12.00", "$12.04"],
        hint: "Use compensation: $3.00 × 4 = $12.00, then subtract $0.01×4 = $0.04"
    },
    {
        problem: "A bus travels 65 km each hour. How far does it go in 8 hours?",
        correctAnswer: "520 km",
        options: ["480 km", "500 km", "520 km", "560 km"],
        hint: "Break apart: 60×8 = 480, 5×8 = 40, total = 520"
    },
    {
        problem: "You have $50. You buy a shirt for $24.95 and socks for $5.05. How much is left?",
        correctAnswer: "$20.00",
        options: ["$19.00", "$20.00", "$21.00", "$25.00"],
        hint: "Compatible numbers: $24.95 + $5.05 = $30.00, so $50 – $30 = $20"
    },
    {
        problem: "A pizza is cut into 12 slices. 3 friends share it equally. How many slices does each get?",
        correctAnswer: "4 slices",
        options: ["3 slices", "4 slices", "6 slices", "9 slices"],
        hint: "Known fact: 12 ÷ 3 = 4"
    },
    {
        problem: "A movie starts at 3:45 PM and lasts 1 hour 50 minutes. What time does it end?",
        correctAnswer: "5:35 PM",
        options: ["5:25 PM", "5:30 PM", "5:35 PM", "5:45 PM"],
        hint: "Add 1h → 4:45, then add 50 min: 4:45 + 15 = 5:00, +35 = 5:35"
    },
    {
        problem: "A box holds 25 books. How many books in 16 boxes?",
        correctAnswer: "400 books",
        options: ["350 books", "400 books", "450 books", "500 books"],
        hint: "Compatible numbers: 25 × 4 = 100, so 25 × 16 = 100 × 4 = 400"
    },
    {
        problem: "You run 2.8 km on Monday and 3.2 km on Tuesday. How far did you run total?",
        correctAnswer: "6.0 km",
        options: ["5.0 km", "5.8 km", "6.0 km", "6.2 km"],
        hint: "Compatible decimals: 2.8 + 3.2 = 6.0"
    },
    {
        problem: "A notebook costs $1.49. How much for 6 notebooks?",
        correctAnswer: "$8.94",
        options: ["$8.49", "$8.94", "$9.00", "$9.06"],
        hint: "Compensation: $1.50 × 6 = $9.00, minus $0.01×6 = $0.06 → $8.94"
    },
    {
        problem: "There are 98 students in Grade 7. If each needs 5 pencils, how many pencils are needed?",
        correctAnswer: "490 pencils",
        options: ["450 pencils", "480 pencils", "490 pencils", "500 pencils"],
        hint: "Compensation: 100×5 = 500, minus 2×5 = 10 → 490"
    },
    {
        problem: "A recipe calls for ¾ cup of sugar. If you double the recipe, how much sugar do you need?",
        correctAnswer: "1½ cups",
        options: ["1 cup", "1¼ cups", "1½ cups", "2 cups"],
        hint: "Double ¾ = 6/4 = 1½"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let correctSound, wrongSound;

// Audio
function initAudio() {
    correctSound = new Audio('assets/brass-fanfare-reverberated-146263.mp3');
    wrongSound = new Audio('assets/cartoon-fail-trumpet-278822.mp3');
    correctSound.load();
    wrongSound.load();
}

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    switchScreen('quiz-screen');
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        gameOver();
        return;
    }

    const q = questions[currentQuestionIndex];
    document.getElementById('question-number').textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    document.getElementById('word-problem').textContent = q.problem;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    let shuffledOptions = [...q.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.textContent = option;
        button.onclick = () => selectOption(button, option, q.correctAnswer);
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedButton, selectedAnswer, correctAnswer) {
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn === selectedButton) {
            btn.classList.add('incorrect');
        }
    });

    if (selectedAnswer === correctAnswer) {
        score++;
        correctSound.currentTime = 0;
        correctSound.play().catch(e => console.log("Correct sound:", e.message));
    } else {
        wrongSound.currentTime = 0;
        wrongSound.play().catch(e => console.log("Wrong sound:", e.message));
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function gameOver() {
    document.getElementById('final-score').textContent = `You scored ${score} out of ${questions.length}!`;
    switchScreen('game-over-screen');
}

function restartGame() {
    switchScreen('start-screen');
}

document.addEventListener('DOMContentLoaded', () => {
    initAudio();
    switchScreen('start-screen');
});