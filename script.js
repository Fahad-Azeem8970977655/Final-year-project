// Animal data with multiple image sources for reliability
const animals = [
    { 
        name: "Elephant", 
        imageSources: [
            "https://cdn.pixabay.com/photo/2016/11/14/04/45/elephant-1822636_640.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/3/37/African_Elephant_Loxodonta_africana_Male_7698.jpg",
            "https://images.unsplash.com/photo-1505148230895-d9a785a555fa"
        ]
    },
    { 
        name: "Lion", 
        imageSources: [
            "https://cdn.pixabay.com/photo/2017/10/25/16/54/lion-2888519_640.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg",
            "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6"
        ]
    },
    { 
        name: "Giraffe", 
        imageSources: [
            "https://cdn.pixabay.com/photo/2017/04/11/21/34/giraffe-2222908_640.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/9/9e/Giraffe_Mikumi_National_Park.jpg",
            "https://images.unsplash.com/photo-1517849845537-4d257902454a"
        ]
    },
    { 
        name: "Monkey", 
        imageSources: [
            "https://cdn.pixabay.com/photo/2016/04/01/09/04/amazon-1300271_640.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg",
            "https://images.unsplash.com/photo-1557128928-3e3855a5a1c1"
        ]
    },
    { 
        name: "Tiger", 
        imageSources: [
            "https://cdn.pixabay.com/photo/2017/07/24/19/57/tiger-2535888_640.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Walking_tiger_female.jpg",
            "https://images.unsplash.com/photo-1551410224-699683e15636"
        ]
    },
    { 
        name: "Kangaroo", 
        imageSources: [
            "https://cdn.pixabay.com/photo/2013/07/12/18/20/kangaroo-153434_640.png",
            "https://upload.wikimedia.org/wikipedia/commons/0/0c/Kangaroo_Australia_01_11_2008_-_retouch.JPG",
            "https://images.unsplash.com/photo-1581089781785-603411fa81e0"
        ]
    },
    { 
        name: "Panda", 
        imageSources: [
            "https://cdn.pixabay.com/photo/2018/04/04/14/17/panda-3289757_640.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/0/0f/Grosser_Panda.JPG",
            "https://images.unsplash.com/photo-1525385444278-b7968e7e28dc"
        ]
    }
];

// Game State Variables
let currentAnimal = null;
let correctOptionIndex = 0;
let score = 0;
let totalQuestions = 0;
let maxQuestions = 5;
let askedAnimals = [];
const imageCache = {};
let timerInterval;
let timePerQuestion = 15;
let isPracticeMode = false;
let animationsEnabled = true;
let optionsCount = 4;
let sessionStartTime;
let currentSessionId;
let sessionHistory = [];
let animalStats = {};
let notes = [];
let touchStartX = 0;
let touchEndX = 0;
let swipeMode = false;
let progressChart, recentPerformanceChart, animalPerformanceChart;

// Initialize animal stats
function initAnimalStats() {
    animals.forEach(animal => {
        if (!animalStats[animal.name]) {
            animalStats[animal.name] = {
                correct: 0,
                incorrect: 0,
                responseTimes: []
            };
        }
    });
}

// DOM Elements
const animalNameEl = document.getElementById('animalName');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const pauseBtn = document.getElementById('pauseBtn');
const finishBtn = document.getElementById('finishBtn');
const progressBarEl = document.getElementById('progressBar');
const timerBarEl = document.getElementById('timerBar');
const soundToggle = document.getElementById('soundToggle');
const musicToggle = document.getElementById('musicToggle');
const voiceToggle = document.getElementById('voiceToggle');
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const transitionSound = document.getElementById('transitionSound');
const calmSound = document.getElementById('calmSound');
const transitionScreen = document.getElementById('transitionScreen');
const countdownTimer = document.getElementById('countdownTimer');
const highContrastToggle = document.getElementById('highContrastToggle');
const parentToggle = document.getElementById('parentToggle');
const parentPanel = document.getElementById('parentPanel');
const practiceModeToggle = document.getElementById('practiceModeToggle');
const practiceModeIndicator = document.getElementById('practiceModeIndicator');
const optionsCountSelect = document.getElementById('optionsCount');
const timePerQuestionInput = document.getElementById('timePerQuestion');
const saveParentSettings = document.getElementById('saveParentSettings');
const animationsToggle = document.getElementById('animationsToggle');
const pauseScreen = document.getElementById('pauseScreen');
const happyBtn = document.getElementById('happyBtn');
const neutralBtn = document.getElementById('neutralBtn');
const sadBtn = document.getElementById('sadBtn');
const resumeBtn = document.getElementById('resumeBtn');
const welcomeScreen = document.getElementById('welcomeScreen');
const startGameBtn = document.getElementById('startGameBtn');
const visualSchedule = document.getElementById('visualSchedule');
const swipeInstruction = document.getElementById('swipeInstruction');
const dashboard = document.getElementById('dashboard');
const dashboardBtn = document.getElementById('dashboardBtn');
const closeDashboard = document.getElementById('closeDashboard');
const tabContents = document.querySelectorAll('.tab-content');
const tabButtons = document.querySelectorAll('.dashboard-tab');
const totalSessionsEl = document.getElementById('totalSessions');
const avgScoreEl = document.getElementById('avgScore');
const bestScoreEl = document.getElementById('bestScore');
const totalTimeEl = document.getElementById('totalTime');
const sessionTableBody = document.getElementById('sessionTableBody');
const animalStatsContainer = document.getElementById('animalStats');
const notesTextarea = document.getElementById('notesTextarea');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const notesList = document.getElementById('notesList');
const exportDataBtn = document.getElementById('exportDataBtn');

// Initialize the game
function initGame() {
    score = 0;
    totalQuestions = 0;
    askedAnimals = [];
    updateProgress();
    animalNameEl.classList.remove('end-game-message');
    nextBtn.textContent = 'Next Animal';
    nextBtn.onclick = nextAnimal;
    
    // Start new session
    currentSessionId = Date.now();
    sessionStartTime = new Date();
    
    // Update visual schedule
    updateVisualSchedule();
    
    // Show welcome screen
    welcomeScreen.classList.remove('hide');
    
    // Initialize animal stats
    initAnimalStats();
    
    // Handle music
    if (musicToggle.checked) {
        backgroundMusic.play().catch(e => console.error("Music playback failed:", e));
    } else {
        backgroundMusic.pause();
    }
    backgroundMusic.muted = !musicToggle.checked;
    
    // Load saved data
    loadSavedData();
}

// Start the game
function startGame() {
    // Reset game state
    score = 0;
    totalQuestions = 0;
    askedAnimals = [];
    updateProgress();
    updateVisualSchedule();
    
    // Hide welcome screen
    welcomeScreen.classList.add('hide');
    
    // Start first question
    nextAnimal();
}

// Update visual schedule
function updateVisualSchedule() {
    visualSchedule.innerHTML = '';
    for (let i = 0; i < maxQuestions; i++) {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        item.textContent = i + 1;
        if (i < totalQuestions) {
            item.classList.add('completed');
        } else if (i === totalQuestions) {
            item.classList.add('active');
        }
        visualSchedule.appendChild(item);
    }
}

// Start timer for current question
function startTimer() {
    if (isPracticeMode) return;
    
    clearInterval(timerInterval);
    let timeLeft = timePerQuestion;
    timerBarEl.style.width = '100%';
    timerBarEl.style.backgroundColor = '#ff9800';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        const percentage = (timeLeft / timePerQuestion) * 100;
        timerBarEl.style.width = `${percentage}%`;
        
        if (timeLeft <= 5) {
            timerBarEl.style.backgroundColor = '#f44336';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeUp();
        }
    }, 1000);
}

// Handle when time runs out
function timeUp() {
    Array.from(optionsEl.children).forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.opacity = '0.6';
    });
    
    feedbackEl.textContent = `Let's try again! It's a ${currentAnimal.name}.`;
    feedbackEl.className = 'feedback incorrect';
    
    optionsEl.children[correctOptionIndex].style.border = '3px solid #2b6a3e';
    
    if (soundToggle.checked) {
        incorrectSound.currentTime = 0;
        incorrectSound.play().catch(e => console.error("Incorrect sound playback failed:", e));
    }
    
    nextBtn.style.display = 'inline-block';
    
    // Update animal stats
    if (currentAnimal) {
        animalStats[currentAnimal.name].incorrect++;
    }
}

// Show transition animation with countdown
async function showTransition() {
    if (!animationsEnabled) {
        return;
    }
    
    if (soundToggle.checked) {
        transitionSound.currentTime = 0;
        transitionSound.play().catch(e => console.error("Transition sound playback failed:", e));
    }
    
    transitionScreen.classList.add('active');
    
    // Countdown from 3
    for (let i = 3; i > 0; i--) {
        countdownTimer.textContent = i;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    transitionScreen.classList.remove('active');
}

// Load image with multiple fallbacks
async function loadImageWithFallbacks(animal) {
    if (imageCache[animal.name]) {
        return imageCache[animal.name];
    }

    for (const src of animal.imageSources) {
        try {
            const img = await loadImage(src);
            imageCache[animal.name] = src;
            return src;
        } catch (error) {
            console.log(`Failed to load image from ${src}, trying next source`);
            continue;
        }
    }
    
    return null;
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
        img.src = src;
    });
}

function createOptionElement(animal, index) {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.onclick = () => checkAnswer(index);
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    optionDiv.appendChild(spinner);
    
    const optionText = document.createElement('div');
    optionText.className = 'option-text';
    optionText.textContent = animal.name;
    optionText.style.display = 'none';
    optionDiv.appendChild(optionText);
    
    return optionDiv;
}

// Select and display the next animal and options
async function nextAnimal() {
    if (totalQuestions >= maxQuestions) {
        endGame();
        return;
    }

    try {
        await showTransition();
        
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        nextBtn.style.display = 'none';
        optionsEl.innerHTML = 'Loading animals...';

        const availableAnimals = animals.filter(animal => !askedAnimals.includes(animal));
        if (availableAnimals.length === 0) {
            askedAnimals = [];
        }
        currentAnimal = animals[Math.floor(Math.random() * animals.length)];
        askedAnimals.push(currentAnimal);

        animalNameEl.textContent = currentAnimal.name;

        if (voiceToggle.checked) {
            speak(currentAnimal.name);
        }

        // Prepare options (1 correct + wrong options)
        const options = [currentAnimal];
        
        while (options.length < optionsCount) {
            let wrongAnimal;
            do {
                wrongAnimal = animals[Math.floor(Math.random() * animals.length)];
            } while (options.includes(wrongAnimal));
            
            options.push(wrongAnimal);
        }

        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        correctOptionIndex = options.indexOf(currentAnimal);

        optionsEl.innerHTML = '';
        
        const optionPromises = options.map(async (animal, index) => {
            const optionDiv = createOptionElement(animal, index);
            optionsEl.appendChild(optionDiv);
            
            try {
                const imageSrc = await loadImageWithFallbacks(animal);
                if (imageSrc) {
                    optionDiv.style.backgroundImage = `url(${imageSrc})`;
                    optionDiv.querySelector('.loading-spinner').style.display = 'none';
                } else {
                    const optionText = optionDiv.querySelector('.option-text');
                    optionText.style.display = 'block';
                    optionText.style.position = 'relative';
                    optionText.style.bottom = 'auto';
                    optionText.style.background = 'transparent';
                    optionDiv.querySelector('.loading-spinner').style.display = 'none';
                }
            } catch (error) {
                console.error('Error loading image:', error);
                const optionText = optionDiv.querySelector('.option-text');
                optionText.style.display = 'block';
                optionText.style.position = 'relative';
                optionText.style.bottom = 'auto';
                optionText.style.background = 'transparent';
                optionDiv.querySelector('.loading-spinner').style.display = 'none';
            }
            
            return optionDiv;
        });

        await Promise.all(optionPromises);
        totalQuestions++;
        updateProgress();
        updateVisualSchedule();
        startTimer();
        
    } catch (error) {
        console.error("Error in nextAnimal:", error);
        feedbackEl.textContent = "Oops! Something went wrong. Please try again.";
        feedbackEl.className = 'feedback incorrect';
        nextBtn.style.display = 'inline-block';
    }
}

// Check the user's selected answer
function checkAnswer(selectedIndex) {
    clearInterval(timerInterval);
    
    Array.from(optionsEl.children).forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.opacity = '0.8';
    });

    if (selectedIndex === correctOptionIndex) {
        score++;
        feedbackEl.textContent = `Great job! That's a ${currentAnimal.name}!`;
        feedbackEl.className = 'feedback correct';

        if (animationsEnabled) {
            const selectedOption = optionsEl.children[selectedIndex];
            selectedOption.classList.add('glow-border');
            
            for (let i = 0; i < 3; i++) {
                createFloatingHeart(selectedOption);
            }
        }

        if (soundToggle.checked) {
            correctSound.currentTime = 0;
            correctSound.play().catch(e => console.error("Correct sound playback failed:", e));
        }
        
        if (currentAnimal) {
            animalStats[currentAnimal.name].correct++;
        }
    } else {
        feedbackEl.textContent = `Try again! That's not the ${currentAnimal.name}.`;
        feedbackEl.className = 'feedback incorrect';

        if (soundToggle.checked) {
            incorrectSound.currentTime = 0;
            incorrectSound.play().catch(e => console.error("Incorrect sound playback failed:", e));
        }

        optionsEl.children[correctOptionIndex].style.border = '3px solid #2b6a3e';
        
        if (currentAnimal) {
            animalStats[currentAnimal.name].incorrect++;
        }
    }

    nextBtn.style.display = 'inline-block';
}

// Create floating heart animation for correct answers
function createFloatingHeart(parentElement) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'correct-feedback';
    heart.style.left = `${Math.random() * 100}px`;
    heart.style.top = `${Math.random() * 100}px';
    
    parentElement.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// End the game and show the final score
function endGame() {
    clearInterval(timerInterval);
    animalNameEl.textContent = 'Game Over!';
    animalNameEl.classList.add('end-game-message');
    optionsEl.innerHTML = '';
    feedbackEl.textContent = `You got ${score} out of ${maxQuestions} correct! 🌟`;
    feedbackEl.className = 'feedback';

    nextBtn.textContent = 'Play Again';
    nextBtn.onclick = initGame;
    nextBtn.style.display = 'inline-block';

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    recordSession();
}

// Record session data
function recordSession() {
    const sessionEndTime = new Date();
    const sessionDuration = (sessionEndTime - sessionStartTime) / 1000;
    const percentageScore = Math.round((score / maxQuestions) * 100);
    
    const sessionData = {
        id: currentSessionId,
        date: sessionStartTime.toLocaleDateString(),
        time: sessionStartTime.toLocaleTimeString(),
        score: score,
        totalQuestions: maxQuestions,
        percentage: percentageScore,
        duration: sessionDuration,
        settings: {
            optionsCount: optionsCount,
            timePerQuestion: timePerQuestion,
            isPracticeMode: isPracticeMode
        }
    };
    
    sessionHistory.push(sessionData);
    saveDataToLocalStorage();
}

// Pause the game
function pauseGame() {
    clearInterval(timerInterval);
    pauseScreen.classList.add('show');
    backgroundMusic.pause();
    
    if (soundToggle.checked) {
        calmSound.currentTime = 0;
        calmSound.play().catch(e => console.error("Calm sound playback failed:", e));
    }
}

// Resume the game
function resumeGame() {
    pauseScreen.classList.remove('show');
    calmSound.pause();
    
    if (musicToggle.checked) {
        backgroundMusic.play().catch(e => console.error("Music playback failed:", e));
    }
    
    startTimer();
}

// Helper Functions
function speak(text) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        speechSynthesis.speak(utterance);
    }
}

function updateProgress() {
    const progressPercentage = (totalQuestions / maxQuestions) * 100;
    progressBarEl.style.width = `${progressPercentage}%`;
}

// Toggle high contrast mode
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    highContrastToggle.textContent = isHighContrast ? 'Normal Mode' : 'High Contrast Mode';
    localStorage.setItem('highContrastMode', isHighContrast);
}

// Toggle parent panel
function toggleParentPanel() {
    parentPanel.classList.toggle('show');
}

// Save parent settings
function saveSettings() {
    isPracticeMode = practiceModeToggle.checked;
    optionsCount = parseInt(optionsCountSelect.value);
    timePerQuestion = parseInt(timePerQuestionInput.value);
    animationsEnabled = animationsToggle.checked;
    
    practiceModeIndicator.style.display = isPracticeMode ? 'block' : 'none';
    parentPanel.classList.remove('show');
    
    if (currentAnimal && totalQuestions < maxQuestions) {
        clearInterval(timerInterval);
        startTimer();
    }
}

// Dashboard Functions
function showDashboard() {
    dashboard.classList.add('show');
    updateDashboard();
}

function hideDashboard() {
    dashboard.classList.remove('show');
}

function updateDashboard() {
    updateOverviewStats();
    updateSessionTable();
    updateAnimalStats();
    updateNotesList();
    updateCharts();
}

function updateOverviewStats() {
    if (sessionHistory.length === 0) return;
    
    totalSessionsEl.textContent = sessionHistory.length;
    
    const totalScore = sessionHistory.reduce((sum, session) => sum + session.percentage, 0);
    const avgScore = Math.round(totalScore / sessionHistory.length);
    avgScoreEl.textContent = `${avgScore}%`;
    
    const bestScore = Math.max(...sessionHistory.map(session => session.percentage));
    bestScoreEl.textContent = `${bestScore}%`;
    
    const totalSeconds = sessionHistory.reduce((sum, session) => sum + session.duration, 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    totalTimeEl.textContent = `${totalMinutes}m`;
}

function updateSessionTable() {
    sessionTableBody.innerHTML = '';
    
    const sortedSessions = [...sessionHistory].sort((a, b) => b.id - a.id);
    
    sortedSessions.forEach(session => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${session.date}<br>${session.time}</td>
            <td>${session.score}/${session.totalQuestions}<br>(${session.percentage}%)</td>
            <td>${Math.round(session.duration)}s</td>
            <td class="progress-cell">
                <span>${session.percentage}%</span>
                <div class="mini-progress">
                    <div class="mini-progress-bar" style="width: ${session.percentage}%"></div>
                </div>
            </td>
            <td>
                <button class="view-details-btn" data-session-id="${session.id}">View</button>
            </td>
        `;
        
        sessionTableBody.appendChild(row);
    });
    
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sessionId = parseInt(btn.getAttribute('data-session-id'));
            viewSessionDetails(sessionId);
        });
    });
}

function viewSessionDetails(sessionId) {
    const session = sessionHistory.find(s => s.id === sessionId);
    if (!session) return;
    
    alert(`Session Details:\n
Date: ${session.date} ${session.time}\n
Score: ${session.score}/${session.totalQuestions} (${session.percentage}%)\n
Duration: ${Math.round(session.duration)} seconds\n
Settings:\n
- Options per question: ${session.settings.optionsCount}\n
- Time per question: ${session.settings.timePerQuestion}s\n
- Practice mode: ${session.settings.isPracticeMode ? 'Yes' : 'No'}`);
}

function updateAnimalStats() {
    animalStatsContainer.innerHTML = '';
    
    animals.forEach(animal => {
        const stats = animalStats[animal.name];
        const totalAttempts = stats.correct + stats.incorrect;
        const accuracy = totalAttempts > 0 ? Math.round((stats.correct / totalAttempts) * 100) : 0;
        
        const statElement = document.createElement('div');
        statElement.className = 'animal-stat';
        
        statElement.innerHTML = `
            <div class="animal-name-stat">${animal.name}</div>
            <div class="animal-details">
                <div class="animal-detail">
                    <div class="detail-value">${stats.correct}</div>
                    <div class="detail-label">Correct</div>
                </div>
                <div class="animal-detail">
                    <div class="detail-value">${stats.incorrect}</div>
                    <div class="detail-label">Incorrect</div>
                </div>
                <div class="animal-detail">
                    <div class="detail-value">${accuracy}%</div>
                    <div class="detail-label">Accuracy</div>
                </div>
            </div>
        `;
        
        animalStatsContainer.appendChild(statElement);
    });
}

function updateNotesList() {
    notesList.innerHTML = '';
    
    const sortedNotes = [...notes].sort((a, b) => b.timestamp - a.timestamp);
    
    sortedNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        
        const date = new Date(note.timestamp);
        const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        noteElement.innerHTML = `
            <div class="note-date">${dateString}</div>
            <div class="note-content">${note.content}</div>
            <button class="delete-note" data-note-id="${note.timestamp}">×</button>
        `;
        
        notesList.appendChild(noteElement);
    });
    
    document.querySelectorAll('.delete-note').forEach(btn => {
        btn.addEventListener('click', () => {
            const noteId = parseInt(btn.getAttribute('data-note-id'));
            deleteNote(noteId);
        });
    });
}

function saveNote() {
    const content = notesTextarea.value.trim();
    if (!content) return;
    
    const newNote = {
        timestamp: Date.now(),
        content: content
    };
    
    notes.push(newNote);
    notesTextarea.value = '';
    saveDataToLocalStorage();
    updateNotesList();
}

function deleteNote(timestamp) {
    notes = notes.filter(note => note.timestamp !== timestamp);
    saveDataToLocalStorage();
    updateNotesList();
}

function updateCharts() {
    if (progressChart) progressChart.destroy();
    if (recentPerformanceChart) recentPerformanceChart.destroy();
    if (animalPerformanceChart) animalPerformanceChart.destroy();
    
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    progressChart = new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: sessionHistory.map((_, i) => `Session ${i + 1}`),
            datasets: [{
                label: 'Score Percentage',
                data: sessionHistory.map(session => session.percentage),
                borderColor: '#3a6ea5',
                backgroundColor: 'rgba(58, 110, 165, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    
    const recentSessions = sessionHistory.slice(0, 5).reverse();
    const recentCtx = document.getElementById('recentPerformanceChart').getContext('2d');
    recentPerformanceChart = new Chart(recentCtx, {
        type: 'bar',
        data: {
            labels: recentSessions.map((_, i) => `Session ${sessionHistory.length - i}`),
            datasets: [{
                label: 'Score',
                data: recentSessions.map(session => session.percentage),
                backgroundColor: '#3a6ea5'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    
    const animalCtx = document.getElementById('animalPerformanceChart').getContext('2d');
    const animalLabels = animals.map(animal => animal.name);
    const animalCorrectData = animals.map(animal => animalStats[animal.name].correct);
    const animalIncorrectData = animals.map(animal => animalStats[animal.name].incorrect);
    
    animalPerformanceChart = new Chart(animalCtx, {
        type: 'bar',
        data: {
            labels: animalLabels,
            datasets: [
                {
                    label: 'Correct',
                    data: animalCorrectData,
                    backgroundColor: '#2b6a3e'
                },
                {
                    label: 'Incorrect',
                    data: animalIncorrectData,
                    backgroundColor: '#b71c1c'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

function exportData() {
    const data = {
        sessionHistory: sessionHistory,
        animalStats: animalStats,
        notes: notes
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const dataUrl = URL.createObjectURL(dataBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = `animal-quiz-data-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Data persistence functions
function saveDataToLocalStorage() {
    const data = {
        sessionHistory: sessionHistory,
        animalStats: animalStats,
        notes: notes
    };
    localStorage.setItem('animalQuizData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('animalQuizData');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        sessionHistory = data.sessionHistory || [];
        animalStats = data.animalStats || {};
        notes = data.notes || [];
        initAnimalStats();
    } catch (e) {
        console.error('Error loading saved data:', e);
    }
}

// Tab switching
function switchTab(tabId) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const tabContent = document.getElementById(`${tabId}Tab`);
    const tabButton = document.querySelector(`.dashboard-tab[data-tab="${tabId}"]`);
    
    if (tabContent && tabButton) {
        tabContent.classList.add('active');
        tabButton.classList.add('active');
        
        if (tabId === 'overview' || tabId === 'animals') {
            updateCharts();
        }
    }
}

// Handle swipe gestures
function handleSwipe() {
    const options = Array.from(optionsEl.children);
    const currentIndex = options.findIndex(opt => opt === document.activeElement);
    
    if (touchEndX < touchStartX) {
        // Swipe left - move to next option
        const newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        if (options[newIndex]) options[newIndex].focus();
    } else if (touchEndX > touchStartX) {
        // Swipe right - move to previous option
        const newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        if (options[newIndex]) options[newIndex].focus();
    }
}

// Event Listeners
function setupEventListeners() {
    startGameBtn.addEventListener('click', startGame);
    repeatBtn.addEventListener('click', () => {
        if (voiceToggle.checked && currentAnimal) {
            speak(currentAnimal.name);
        }
    });
    
    soundToggle.addEventListener('change', function() {
        correctSound.muted = !this.checked;
        incorrectSound.muted = !this.checked;
        transitionSound.muted = !this.checked;
        calmSound.muted = !this.checked;
    });

    musicToggle.addEventListener('change', function() {
        backgroundMusic.muted = !this.checked;
        if (this.checked) {
            backgroundMusic.play().catch(e => console.error("Music playback failed:", e));
        } else {
            backgroundMusic.pause();
        }
    });

    voiceToggle.addEventListener('change', function() {
        if (!this.checked) {
            speechSynthesis.cancel();
        }
    });

    highContrastToggle.addEventListener('click', toggleHighContrast);
    parentToggle.addEventListener('click', toggleParentPanel);
    saveParentSettings.addEventListener('click', saveSettings);
    pauseBtn.addEventListener('click', pauseGame);
    resumeBtn.addEventListener('click', resumeGame);
    finishBtn.addEventListener('click', endGame);
    dashboardBtn.addEventListener('click', showDashboard);
    closeDashboard.addEventListener('click', hideDashboard);
    saveNotesBtn.addEventListener('click', saveNote);
    exportDataBtn.addEventListener('click', exportData);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    happyBtn.addEventListener('click', () => {
        feedbackEl.textContent = "I'm happy to play! 😊";
        feedbackEl.className = 'feedback correct';
    });

    neutralBtn.addEventListener('click', () => {
        feedbackEl.textContent = "I'm feeling okay. 😐";
        feedbackEl.className = 'feedback';
    });

    sadBtn.addEventListener('click', () => {
        feedbackEl.textContent = "I'm feeling sad. 😢";
        feedbackEl.className = 'feedback incorrect';
    });

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (swipeMode) handleSwipe();
    }, false);

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
            const options = Array.from(optionsEl.children);
            const currentIndex = options.findIndex(opt => opt === document.activeElement);
            const newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
            if (options[newIndex]) options[newIndex].focus();
        } else if (e.key === 'ArrowLeft') {
            const options = Array.from(optionsEl.children);
            const currentIndex = options.findIndex(opt => opt === document.activeElement);
            const newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
            if (options[newIndex]) options[newIndex].focus();
        } else if (e.key === 'Enter') {
            if (document.activeElement.classList.contains('option')) {
                const options = Array.from(optionsEl.children);
                const index = options.indexOf(document.activeElement);
                if (index !== -1) checkAnswer(index);
            }
        }
    });

    setInterval(() => {
        if (swipeMode) {
            swipeInstruction.style.display = 'block';
        } else {
            swipeInstruction.style.display = 'none';
        }
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('highContrastMode') === 'true') {
        document.body.classList.add('high-contrast');
        highContrastToggle.textContent = 'Normal Mode';
    }
    
    setupEventListeners();
    initGame();
});