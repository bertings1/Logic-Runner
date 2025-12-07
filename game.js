// Game State Manager
class LogicRunnerGame {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.totalLevels = 4;
        this.gameStarted = false;
        this.currentStreak = 0;
        
        // Game data
        this.levels = this.createLevels();
        
        // DOM Elements
        this.elements = {
            level: document.getElementById('current-level'),
            score: document.getElementById('score-value'),
            lives: document.getElementById('lives-value'),
            levelTitle: document.getElementById('level-title'),
            levelDesc: document.getElementById('level-description'),
            gameContent: document.getElementById('game-content'),
            feedback: document.getElementById('feedback-content'),
            feedbackPanel: document.getElementById('game-feedback'),
            hintBtn: document.getElementById('hint-btn'),
            checkBtn: document.getElementById('check-btn'),
            nextBtn: document.getElementById('next-btn'),
            timer: document.getElementById('timer'),
            modal: document.getElementById('completion-modal'),
            finalScore: document.getElementById('final-score'),
            continueBtn: document.getElementById('continue-game')
        };
        
        this.init();
    }
    
    createLevels() {
        return [
            {
                id: 1,
                title: "Level 1: Operator Match",
                description: "Drag logical operators to match with their symbols",
                type: "matching",
                timeLimit: 180,
                data: [
                    { operator: "AND", symbol: "∧", description: "Both must be true" },
                    { operator: "OR", symbol: "∨", description: "At least one true" },
                    { operator: "NOT", symbol: "¬", description: "Opposite truth value" },
                    { operator: "IMPLIES", symbol: "→", description: "If p then q" }
                ],
                hints: [
                    "AND (∧) requires both propositions to be true",
                    "OR (∨) requires at least one proposition to be true",
                    "NOT (¬) simply reverses the truth value",
                    "IM