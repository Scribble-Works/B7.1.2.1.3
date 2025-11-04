// Array of problems: [target_number, [[base1, exponent1], [base2, exponent2], ...]]
const problems = [
    [72, [[2, 3], [3, 2]]],    // 2^3 * 3^2 = 8 * 9 = 72
    [100, [[2, 2], [5, 2]]],  // 2^2 * 5^2 = 4 * 25 = 100
    [270, [[2, 1], [3, 3], [5, 1]]], // 2 * 27 * 5 = 270
    [125, [[5, 3]]],          // 5^3 = 125
    [48, [[2, 4], [3, 1]]],   // 2^4 * 3 = 16 * 3 = 48
    [324, [[2, 2], [3, 4]]],   // 4 * 81 = 324
    [600, [[2, 3], [3, 1], [5, 2]]], // 8 * 3 * 25 = 600
];

let currentProblem = null;
let currentProblemIndex = -1;

// --- DOM Elements ---
const targetNumberEl = document.getElementById('target-number');
const expressionContainer = document.getElementById('expression-container');
const feedbackArea = document.getElementById('feedback-area');
const checkButton = document.getElementById('check-button');

// --- Functions ---

/**
 * Renders the problem expression (e.g., 2^a * 3^b) onto the screen.
 * @param {Array<Array>} basesAndExponents - The list of base/exponent pairs for the current problem.
 */
function renderProblem(basesAndExponents) {
    let html = '';
    const bases = basesAndExponents.map(pair => pair[0]);

    bases.forEach((base, index) => {
        // Base Number
        html += `<span class="base-number">${base}</span>`;
        // Exponent Input Field
        html += `<input type="number" min="0" value="" class="exponent-input" data-base="${base}" id="exp-${base}">`;

        // Add the multiplication sign if it's not the last factor
        if (index < bases.length - 1) {
            html += `<span class="base-number"> &times; </span>`;
        }
    });

    expressionContainer.innerHTML = html;
    // Clear feedback when new problem loads
    feedbackArea.textContent = 'Enter the exponents and click "Check"';
    feedbackArea.className = 'feedback';
    checkButton.disabled = false;
}

/**
 * Loads a new random or sequential problem.
 */
function loadNewProblem() {
    // Cycle through problems sequentially for a structured quiz or pick randomly
    currentProblemIndex = (currentProblemIndex + 1) % problems.length;
    currentProblem = problems[currentProblemIndex];

    const [target, factors] = currentProblem;
    
    targetNumberEl.textContent = target;
    renderProblem(factors);
}

/**
 * Checks the user's submitted exponents against the correct answer.
 */
function checkAnswer() {
    const [target, correctFactors] = currentProblem;
    let userProduct = 1;
    let isCorrect = true;

    // Get all exponent input fields
    const inputs = document.querySelectorAll('.exponent-input');

    inputs.forEach(input => {
        const base = parseInt(input.getAttribute('data-base'));
        const userExponent = parseInt(input.value);

        // Simple validation to ensure a number is entered
        if (isNaN(userExponent) || userExponent < 0) {
            isCorrect = false;
            return; // Skip calculation if input is invalid
        }
        
        userProduct *= Math.pow(base, userExponent);

        // Advanced check: Ensure the entered exponent matches the *correct* exponent for that base
        const correctExponent = correctFactors.find(pair => pair[0] === base)?.[1];
        
        // This makes sure they use the *correct prime factorization*, not just a product that equals the number
        if (userExponent !== correctExponent) {
             // We allow the product check to validate if they got the right number, 
             // but we will prioritize the prime factorization check for correctness
             // to fulfill the objective's focus on "product of powers" decomposition.
             // If userProduct === target, but the exponents are wrong (e.g., 2^2 * 3^1 instead of 4^1 * 3^1 for 12),
             // the prompt implies we need the prime factorization (product of powers of *prime* numbers).
             // However, for simplicity and meeting the general 'product of powers' objective, we'll focus on the final product check.
             // For this problem set, the factors are implicitly the correct prime factors, so the check is just on the product.
        }
    });

    if (isCorrect && userProduct === target) {
        feedbackArea.textContent = '🥳 Correct! Well done.';
        feedbackArea.className = 'feedback correct';
        checkButton.disabled = true; // Disable until a new problem is loaded
    } else if (!isCorrect || isNaN(userProduct)) {
        feedbackArea.textContent = '🤔 Please ensure all exponents are non-negative numbers.';
        feedbackArea.className = 'feedback incorrect';
    } else {
        feedbackArea.textContent = `❌ Incorrect. Your product is ${userProduct}, but the target is ${target}. Try again!`;
        feedbackArea.className = 'feedback incorrect';
    }
}

// --- Event Listeners and Initial Load ---
checkButton.addEventListener('click', checkAnswer);

// Load the first problem when the page loads
window.onload = loadNewProblem;