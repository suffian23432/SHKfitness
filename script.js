// Default exercises (no image types needed)
let exercises = [
    { id: 1, name: "Neck Stretches", duration: "30 sec each side", completed: false },
    { id: 2, name: "Shoulder Rolls", duration: "10 forward, 10 backward", completed: false },
    { id: 3, name: "Chair Squats", duration: "15 reps", completed: false },
    { id: 4, name: "Wrist Stretches", duration: "30 sec each", completed: false },
    { id: 5, name: "Seated Leg Lifts", duration: "20 reps per leg", completed: false }
];

// Set current date
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Initialize the app
    initApp();
});

// Initialize tracker
function initializeTracker() {
    const exerciseList = document.querySelector('.exercise-list');
    if (!exerciseList) {
        console.error('Exercise list element not found!');
        return;
    }
    
    exerciseList.innerHTML = '';
    
    exercises.forEach(exercise => {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.innerHTML = `
            <div class="exercise-info">
                <div class="exercise-icon-small">
                    <i class="fas fa-dumbbell"></i>
                </div>
                <div class="exercise-text">
                    <h4>${exercise.name}</h4>
                    <p>${exercise.duration}</p>
                </div>
            </div>
            <div class="exercise-actions">
                <button class="complete-btn ${exercise.completed ? 'completed' : ''}" data-id="${exercise.id}">
                    ${exercise.completed ? 'Completed' : 'Mark Complete'}
                </button>
            </div>
        `;
        exerciseList.appendChild(exerciseItem);
    });
    
    updateStats();
    
    // Add event listeners to complete buttons
    document.querySelectorAll('.complete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const exercise = exercises.find(ex => ex.id === id);
            if (exercise) {
                exercise.completed = !exercise.completed;
                
                this.textContent = exercise.completed ? 'Completed' : 'Mark Complete';
                this.classList.toggle('completed', exercise.completed);
                
                updateStats();
                
                // Update streak if all exercises are completed
                const allCompleted = exercises.every(ex => ex.completed);
                if (allCompleted) {
                    const streakCount = document.getElementById('streak-count');
                    if (streakCount) {
                        let currentStreak = parseInt(streakCount.textContent) || 0;
                        streakCount.textContent = currentStreak + 1;
                    }
                }
                
                // Save to localStorage
                saveProgress();
            }
        });
    });
}

// Update statistics
function updateStats() {
    const completedCount = exercises.filter(ex => ex.completed).length;
    const completedElement = document.getElementById('completed-count');
    const totalElement = document.getElementById('total-count');
    
    if (completedElement) completedElement.textContent = completedCount;
    if (totalElement) totalElement.textContent = exercises.length;
}

// Start workout button functionality
function setupWorkoutButtons() {
    document.querySelectorAll('.start-workout-btn').forEach(button => {
        button.addEventListener('click', function() {
            const workoutType = this.getAttribute('data-workout');
            
            switch(workoutType) {
                case 'desk-break':
                    exercises = [
                        { id: 1, name: "Neck Stretches", duration: "30 sec each side", completed: false },
                        { id: 2, name: "Shoulder Rolls", duration: "10 forward, 10 backward", completed: false },
                        { id: 3, name: "Chair Squats", duration: "15 reps", completed: false },
                        { id: 4, name: "Wrist Stretches", duration: "30 sec each", completed: false },
                        { id: 5, name: "Seated Leg Lifts", duration: "20 reps per leg", completed: false }
                    ];
                    break;
                case 'morning-energizer':
                    exercises = [
                        { id: 1, name: "Jumping Jacks", duration: "1 minute", completed: false },
                        { id: 2, name: "Push-ups", duration: "15 reps", completed: false },
                        { id: 3, name: "Plank", duration: "45 seconds", completed: false },
                        { id: 4, name: "Bodyweight Squats", duration: "20 reps", completed: false },
                        { id: 5, name: "Lunges", duration: "10 per leg", completed: false },
                        { id: 6, name: "High Knees", duration: "1 minute", completed: false }
                    ];
                    break;
                case 'evening-recovery':
                    exercises = [
                        { id: 1, name: "Cat-Cow Stretch", duration: "1 minute", completed: false },
                        { id: 2, name: "Downward Dog", duration: "1 minute", completed: false },
                        { id: 3, name: "Child's Pose", duration: "1 minute", completed: false },
                        { id: 4, name: "Quad Stretch", duration: "30 sec each leg", completed: false },
                        { id: 5, name: "Side Stretches", duration: "30 sec each side", completed: false },
                        { id: 6, name: "Deep Breathing", duration: "2 minutes", completed: false }
                    ];
                    break;
            }
            
            // Reset tracker with new exercises
            initializeTracker();
            
            // Scroll to tracker
            const trackerElement = document.getElementById('tracker');
            if (trackerElement) {
                trackerElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        exercises: exercises,
        streak: parseInt(document.getElementById('streak-count')?.textContent || '0'),
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('shkfitnessProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('shkfitnessProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            
            // Check if last updated was today
            const lastUpdated = new Date(progress.lastUpdated);
            const today = new Date();
            
            if (lastUpdated.toDateString() === today.toDateString()) {
                exercises = progress.exercises || exercises;
                const streakCount = document.getElementById('streak-count');
                if (streakCount) {
                    streakCount.textContent = progress.streak || 0;
                }
            } else {
                // Reset exercises for new day but keep streak
                const streakCount = document.getElementById('streak-count');
                if (streakCount) {
                    streakCount.textContent = progress.streak || 0;
                }
                exercises.forEach(ex => ex.completed = false);
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
}

// Initialize the application
function initApp() {
    // Load saved progress
    loadProgress();
    
    // Initialize tracker
    initializeTracker();
    
    // Setup event listeners
    setupWorkoutButtons();
    setupMobileMenu();
    setupSmoothScrolling();
}