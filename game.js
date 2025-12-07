// Game State
const gameState = {
    currentLevel: 1,
    score: 0,
    lives: 3,
    totalLevels: 4
};

// Game Content for Each Level
const levels = [
    {
        id: 1,
        title: "Level 1: Operator Match",
        description: "Drag and drop operators to match with their symbols!",
        type: "matching",
        data: [
            { operator: "AND", symbol: "∧" },
            { operator: "OR", symbol: "∨" },
            { operator: "NOT", symbol: "¬" },
            { operator: "IMPLIES", symbol: "→" }
        ]
    },
    {
        id: 2,
        title: "Level 2: Truth Table Challenge",
        description: "Complete the truth table for (p ∧ q) → r",
        type: "truthTable",
        data: {
            expression: "(p ∧ q) → r",
            table: [
                { p: true, q: true, r: true, result: true },
                { p: true, q: true, r: false, result: false },
                { p: true, q: false, r: true, result: true },
                { p: true, q: false, r: false, result: true },
                { p: false, q: true, r: true, result: true },
                { p: false, q: true, r: false, result: true },
                { p: false, q: false, r: true, result: true },
                { p: false, q: false, r: false, result: true }
            ]
        }
    },
    {
        id: 3,
        title: "Level 3: Logic Puzzle",
        description: "Solve the knight and knave puzzle using propositional logic",
        type: "puzzle",
        data: {
            puzzle: "A knight (always tells truth) and a knave (always lies) are before you. The knight says: 'We are both knaves.' What are they really?",
            options: [
                "Both are knights",
                "Both are knaves",
                "First is knight, second is knave",
                "First is knave, second is knight"
            ],
            answer: 2
        }
    },
    {
        id: 4,
        title: "Level 4: Logical Equivalence",
        description: "Match equivalent logical expressions",
        type: "equivalence",
        data: [
            { left: "¬(p ∧ q)", right: "¬p ∨ ¬q" },
            { left: "¬(p ∨ q)", right: "¬p ∧ ¬q" },
            { left: "p → q", right: "¬p ∨ q" },
            { left: "p ∧ (q ∨ r)", right: "(p ∧ q) ∨ (p ∧ r)" }
        ]
    }
];

// DOM Elements
const levelElement = document.getElementById('level');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelTitle = document.getElementById('level-title');
const levelDescription = document.getElementById('level-description');
const gameContent = document.getElementById('game-content');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const hintBtn = document.getElementById('hint-btn');
const feedback = document.getElementById('feedback');
const modal = document.getElementById('completion-modal');
const completionMessage = document.getElementById('completion-message');
const continueBtn = document.getElementById('continue-btn');

// Initialize Game
function initGame() {
    updateUI();
    loadLevel(gameState.currentLevel);
}

// Update UI
function updateUI() {
    levelElement.textContent = gameState.currentLevel;
    scoreElement.textContent = gameState.score;
    livesElement.textContent = gameState.lives;
}

// Load Level
function loadLevel(levelNumber) {
    const level = levels[levelNumber - 1];
    levelTitle.textContent = level.title;
    levelDescription.textContent = level.description;
    
    switch(level.type) {
        case 'matching':
            loadMatchingGame(level.data);
            break;
        case 'truthTable':
            loadTruthTableGame(level.data);
            break;
        case 'puzzle':
            loadPuzzleGame(level.data);
            break;
        case 'equivalence':
            loadEquivalenceGame(level.data);
            break;
    }
    
    nextBtn.disabled = true;
    feedback.className = 'feedback';
    feedback.textContent = '';
}

// Load Matching Game
function loadMatchingGame(data) {
    gameContent.innerHTML = `
        <div class="matching-game">
            <div class="operator-list">
                <h3>Logical Operators</h3>
                ${data.map(item => `
                    <div class="operator-item" draggable="true" data-operator="${item.operator}">
                        ${item.operator}
                    </div>
                `).join('')}
            </div>
            <div class="symbol-list">
                <h3>Symbols</h3>
                ${data.map(item => `
                    <div class="symbol-item" data-symbol="${item.symbol}">
                        ${item.symbol}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add drag and drop functionality
    setupDragAndDrop();
}

// Setup Drag and Drop
function setupDragAndDrop() {
    const operatorItems = document.querySelectorAll('.operator-item');
    const symbolItems = document.querySelectorAll('.symbol-item');
    
    operatorItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('operator', e.target.dataset.operator);
        });
    });
    
    symbolItems.forEach(item => {
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const operator = e.dataTransfer.getData('operator');
            const symbol = e.target.dataset.symbol;
            
            // Check if match is correct
            const correctMatch = levels[gameState.currentLevel - 1].data.find(
                d => d.operator === operator && d.symbol === symbol
            );
            
            if (correctMatch) {
                e.target.style.background = 'rgba(0, 255, 0, 0.3)';
                e.target.textContent = `${operator} = ${symbol}`;
                e.target.draggable = false;
                checkAllMatches();
            } else {
                e.target.style.background = 'rgba(255, 0, 0, 0.3)';
                gameState.lives--;
                updateUI();
                if (gameState.lives <= 0) {
                    gameOver();
                }
            }
        });
    });
}

// Check all matches
function checkAllMatches() {
    const matchedItems = document.querySelectorAll('.symbol-item[style*="background: rgba(0, 255, 0, 0.3)"]');
    if (matchedItems.length === levels[gameState.currentLevel - 1].data.length) {
        levelComplete();
    }
}

// Load Truth Table Game
function loadTruthTableGame(data) {
    gameContent.innerHTML = `
        <div class="truth-table-game">
            <h3>Complete the truth table for: ${data.expression}</h3>
            <table class="truth-table">
                <tr>
                    <th>p</th>
                    <th>q</th>
                    <th>r</th>
                    <th>${data.expression}</th>
                </tr>
                ${data.table.map((row, index) => `
                    <tr>
                        <td>${row.p}</td>
                        <td>${row.q}</td>
                        <td>${row.r}</td>
                        <td>
                            <input type="text" id="cell-${index}" placeholder="T/F">
                        </td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

// Load Puzzle Game
function loadPuzzleGame(data) {
    gameContent.innerHTML = `
        <div class="puzzle-game">
            <h3>Logic Puzzle</h3>
            <p>${data.puzzle}</p>
            <div class="options">
                ${data.options.map((option, index) => `
                    <label class="option">
                        <input type="radio" name="answer" value="${index}">
                        ${option}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

// Load Equivalence Game
function loadEquivalenceGame(data) {
    gameContent.innerHTML = `
        <div class="equivalence-game">
            <h3>Match Equivalent Expressions</h3>
            <div class="pairs">
                ${data.map((pair, index) => `
                    <div class="pair">
                        <span class="expression left">${pair.left}</span>
                        <select id="select-${index}" class="match-select">
                            <option value="">Select equivalent...</option>
                            ${data.map((p, i) => `
                                <option value="${p.right}">${p.right}</option>
                            `).join('')}
                        </select>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Check Answer
submitBtn.addEventListener('click', () => {
    const currentLevel = levels[gameState.currentLevel - 1];
    
    switch(currentLevel.type) {
        case 'truthTable':
            checkTruthTable();
            break;
        case 'puzzle':
            checkPuzzle();
            break;
        case 'equivalence':
            checkEquivalence();
            break;
    }
});

// Check Truth Table Answers
function checkTruthTable() {
    const currentLevel = levels[gameState.currentLevel - 1];
    let allCorrect = true;
    
    currentLevel.data.table.forEach((row, index) => {
        const input = document.getElementById(`cell-${index}`);
        const userAnswer = input.value.toLowerCase();
        const correctAnswer = row.result ? 't' : 'f';
        
        if (userAnswer === correctAnswer) {
            input.style.background = 'rgba(0, 255, 0, 0.3)';
        } else {
            input.style.background = 'rgba(255, 0, 0, 0.3)';
            allCorrect = false;
        }
    });
    
    if (allCorrect) {
        levelComplete();
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Some answers are incorrect. Try again!';
        gameState.lives--;
        updateUI();
        if (gameState.lives <= 0) {
            gameOver();
        }
    }
}

// Check Puzzle Answer
function checkPuzzle() {
    const selected = document.querySelector('input[name="answer"]:checked');
    const currentLevel = levels[gameState.currentLevel - 1];
    
    if (!selected) {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Please select an answer!';
        return;
    }
    
    if (parseInt(selected.value) === currentLevel.data.answer) {
        levelComplete();
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Incorrect! Try again.';
        gameState.lives--;
        updateUI();
        if (gameState.lives <= 0) {
            gameOver();
        }
    }
}

// Check Equivalence Answers
function checkEquivalence() {
    const currentLevel = levels[gameState.currentLevel - 1];
    let allCorrect = true;
    
    currentLevel.data.forEach((pair, index) => {
        const select = document.getElementById(`select-${index}`);
        if (select.value !== pair.right) {
            allCorrect = false;
            select.style.background = 'rgba(255, 0, 0, 0.3)';
        } else {
            select.style.background = 'rgba(0, 255, 0, 0.3)';
        }
    });
    
    if (allCorrect) {
        levelComplete();
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = 'Some matches are incorrect!';
        gameState.lives--;
        updateUI();
        if (gameState.lives <= 0) {
            gameOver();
        }
    }
}

// Level Complete
function levelComplete() {
    feedback.className = 'feedback correct';
    feedback.textContent = 'Excellent! Level Complete!';
    gameState.score += 25;
    nextBtn.disabled = false;
    
    // Show completion modal
    if (gameState.currentLevel === gameState.totalLevels) {
        completionMessage.textContent = `Congratulations! You completed all levels! Final Score: ${gameState.score}`;
        modal.style.display = 'flex';
    }
}

// Game Over
function gameOver() {
    feedback.className = 'feedback incorrect';
    feedback.textContent = 'Game Over! Try again?';
    submitBtn.disabled = true;
}

// Next Level
nextBtn.addEventListener('click', () => {
    if (gameState.currentLevel < gameState.totalLevels) {
        gameState.currentLevel++;
        initGame();
    }
});

// Hint Button
hintBtn.addEventListener('click', () => {
    const hints = [
        "Remember: AND (∧) requires both to be true",
        "OR (∨) needs at least one true statement",
        "NOT (¬) reverses the truth value",
        "IMPLIES (→) is only false when p is true and q is false"
    ];
    
    feedback.className = 'feedback';
    feedback.textContent = `Hint: ${hints[Math.floor(Math.random() * hints.length)]}`;
});

// Continue Button
continueBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    // Restart game or show final score
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.lives = 3;
    initGame();
});

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', initGame);