// État de l'application
let state = {
    totalTime: 240, // en secondes (4 minutes par défaut)
    remainingTime: 240,
    isRunning: false,
    isPaused: false,
    intervalId: null,
    selectedCategory: 'Moyenne (4min)',
    vibrationEnabled: true,
    history: [],
    alertedTimes: new Set(), // Pour suivre les alertes déjà envoyées
    wakeLock: null, // Pour empêcher la mise en veille
    startTime: null, // Timestamp du démarrage
    startRemaining: null // Temps restant au démarrage
};

// Éléments DOM
const timerDisplay = document.getElementById('timerDisplay');
const progressFill = document.getElementById('progressFill');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const categoryButtons = document.querySelectorAll('.category-btn');
const customTimeInput = document.getElementById('customTimeInput');
const customMinutes = document.getElementById('customMinutes');
const customSeconds = document.getElementById('customSeconds');
const setCustomTimeBtn = document.getElementById('setCustomTime');
const vibrationToggle = document.getElementById('vibrationToggle');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const timeAdjustControls = document.getElementById('timeAdjustControls');
const addMinuteBtn = document.getElementById('addMinuteBtn');
const removeMinuteBtn = document.getElementById('removeMinuteBtn');

// Initialisation
function init() {
    loadHistory();
    updateDisplay();
    attachEventListeners();
}

// Attacher les event listeners
function attachEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => selectCategory(btn));
    });
    
    setCustomTimeBtn.addEventListener('click', setCustomTime);
    vibrationToggle.addEventListener('change', (e) => {
        state.vibrationEnabled = e.target.checked;
    });
    
    addMinuteBtn.addEventListener('click', addMinute);
    removeMinuteBtn.addEventListener('click', removeMinute);
    
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// Sélectionner une catégorie
function selectCategory(btn) {
    if (state.isRunning) {
        if (!confirm('Un chrono est en cours. Voulez-vous vraiment changer de catégorie ?')) {
            return;
        }
        resetTimer();
    }
    
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const time = btn.getAttribute('data-time');
    
    if (time === 'custom') {
        customTimeInput.style.display = 'flex';
        state.selectedCategory = 'Personnalisé';
    } else {
        customTimeInput.style.display = 'none';
        const seconds = parseInt(time);
        state.totalTime = seconds;
        state.remainingTime = seconds;
        state.selectedCategory = btn.textContent;
        updateDisplay();
    }
}

// Définir un temps personnalisé
function setCustomTime() {
    const minutes = parseInt(customMinutes.value) || 0;
    const seconds = parseInt(customSeconds.value) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
        alert('Veuillez entrer un temps valide.');
        return;
    }
    
    state.totalTime = totalSeconds;
    state.remainingTime = totalSeconds;
    state.selectedCategory = `Personnalisé (${minutes}m ${seconds}s)`;
    updateDisplay();
}

// Ajouter une minute
function addMinute() {
    state.startRemaining += 60;
    state.totalTime += 60;
    
    // Recalculer le temps restant avec le nouvel offset
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    state.remainingTime = Math.max(0, state.startRemaining - elapsed);
    
    // Notification visuelle
    showAdjustmentNotification('+1 minute');
    
    // Petite vibration de confirmation
    if (state.vibrationEnabled) {
        vibratePattern([50, 50, 50]);
    }
    
    updateDisplay();
}

// Retirer une minute
function removeMinute() {
    state.startRemaining -= 60;
    state.totalTime = Math.max(0, state.totalTime - 60);
    
    // Recalculer le temps restant avec le nouvel offset
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    state.remainingTime = Math.max(0, state.startRemaining - elapsed);
    
    // Ne pas descendre en dessous de 0
    if (state.remainingTime <= 0) {
        endTimer();
        return;
    }
    
    // Notification visuelle
    showAdjustmentNotification('-1 minute');
    
    // Petite vibration de confirmation
    if (state.vibrationEnabled) {
        vibratePattern([50, 50, 50]);
    }
    
    updateDisplay();
}

// Démarrer le timer
async function startTimer() {
    if (state.isRunning) return;
    
    state.isRunning = true;
    state.isPaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    state.alertedTimes.clear(); // Réinitialiser les alertes
    
    // Désactiver les boutons de catégorie pendant le chrono
    categoryButtons.forEach(btn => btn.disabled = true);
    
    // Afficher les boutons d'ajustement du temps
    timeAdjustControls.style.display = 'flex';
    
    // Activer le Wake Lock pour empêcher la mise en veille
    await requestWakeLock();
    
    state.startTime = Date.now();
    state.startRemaining = state.remainingTime;
    
    state.intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        state.remainingTime = Math.max(0, state.startRemaining - elapsed);
        
        updateDisplay();
        
        // Vérifier les alertes pour les signes de main
        checkTimeAlerts();
        
        // Timer terminé
        if (state.remainingTime <= 0) {
            endTimer();
        }
    }, 100); // Mise à jour toutes les 100ms pour plus de précision
}

// Mettre en pause le timer
function pauseTimer() {
    if (!state.isRunning) return;
    
    clearInterval(state.intervalId);
    state.isRunning = false;
    state.isPaused = true;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Garder les boutons d'ajustement visibles en pause
    
    // Libérer le Wake Lock
    releaseWakeLock();
}

// Réinitialiser le timer
function resetTimer() {
    clearInterval(state.intervalId);
    state.isRunning = false;
    state.isPaused = false;
    state.remainingTime = state.totalTime;
    state.alertedTimes.clear();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Réactiver les boutons de catégorie
    categoryButtons.forEach(btn => btn.disabled = false);
    
    // Cacher les boutons d'ajustement du temps
    timeAdjustControls.style.display = 'none';
    
    // Libérer le Wake Lock
    releaseWakeLock();
    
    updateDisplay();
}

// Terminer le timer
function endTimer() {
    clearInterval(state.intervalId);
    state.isRunning = false;
    state.remainingTime = 0;
    updateDisplay();
    
    // Vibration de fin (longue)
    if (state.vibrationEnabled) {
        vibratePattern([500, 200, 500, 200, 500]);
    }
    
    // Ajouter à l'historique
    addToHistory();
    
    // Réactiver les boutons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    categoryButtons.forEach(btn => btn.disabled = false);
    
    // Cacher les boutons d'ajustement du temps
    timeAdjustControls.style.display = 'none';
    
    // Libérer le Wake Lock
    releaseWakeLock();
    
    // Notification visuelle
    timerDisplay.style.animation = 'none';
    setTimeout(() => {
        timerDisplay.style.animation = '';
    }, 10);
}

// Mettre à jour l'affichage
function updateDisplay() {
    const minutes = Math.floor(state.remainingTime / 60);
    const seconds = state.remainingTime % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Mise à jour de la barre de progression
    const progress = (state.remainingTime / state.totalTime) * 100;
    progressFill.style.width = `${progress}%`;
    
    // Couleurs d'alerte
    timerDisplay.classList.remove('warning', 'danger');
    progressFill.classList.remove('warning', 'danger');
    
    if (state.remainingTime <= state.warningTime && state.remainingTime > 0) {
        timerDisplay.classList.add('warning');
        progressFill.classList.add('warning');
    }
    
    if (state.remainingTime === 0) {
        timerDisplay.classList.add('danger');
        progressFill.classList.add('danger');
    }
}

// Vibrations
function vibratePattern(pattern) {
    if (!state.vibrationEnabled) return;
    
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Alertes pour les signes de main
function checkTimeAlerts() {
    const time = state.remainingTime;
    
    // Définir les moments clés pour les signes de main
    const alerts = [
        { time: 180, pattern: [200, 100, 200, 100, 200], label: '3 minutes' },  // 3 doigts
        { time: 120, pattern: [200, 100, 200], label: '2 minutes' },            // 2 doigts
        { time: 60, pattern: [200], label: '1 minute' },                        // 1 doigt
        { time: 30, pattern: [100, 50, 100], label: '30 secondes' },            // Signe spécial
        { time: 10, pattern: [100, 50, 100, 50, 100], label: '10 secondes' },   // Alerte finale
        { time: 5, pattern: [50, 50, 50, 50, 50], label: '5 secondes' }         // Alerte urgente
    ];
    
    alerts.forEach(alert => {
        if (time === alert.time && !state.alertedTimes.has(alert.time)) {
            vibratePattern(alert.pattern);
            state.alertedTimes.add(alert.time);
            showTimeNotification(alert.label);
        }
    });
}

// Afficher une notification visuelle temporaire
function showTimeNotification(label) {
    const notification = document.createElement('div');
    notification.className = 'time-notification';
    notification.textContent = `✋ ${label}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Afficher une notification d'ajustement de temps
function showAdjustmentNotification(label) {
    const notification = document.createElement('div');
    notification.className = 'time-notification adjustment';
    notification.textContent = label;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 1500);
}

// Wake Lock API pour empêcher la mise en veille
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            state.wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock activé - l\'écran ne se mettra pas en veille');
            
            // Réactiver le Wake Lock si l'écran est rallumé
            state.wakeLock.addEventListener('release', () => {
                console.log('Wake Lock libéré');
            });
        } catch (err) {
            console.error('Erreur Wake Lock:', err);
        }
    } else {
        console.warn('Wake Lock API non supportée sur ce navigateur');
    }
}

function releaseWakeLock() {
    if (state.wakeLock !== null) {
        state.wakeLock.release()
            .then(() => {
                state.wakeLock = null;
                console.log('Wake Lock libéré');
            })
            .catch(err => {
                console.error('Erreur libération Wake Lock:', err);
            });
    }
}

// Historique
function addToHistory() {
    const historyItem = {
        category: state.selectedCategory,
        totalTime: state.totalTime,
        timestamp: new Date().toLocaleString('fr-FR')
    };
    
    state.history.unshift(historyItem);
    
    // Garder seulement les 10 derniers
    if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
    }
    
    saveHistory();
    renderHistory();
}

function saveHistory() {
    try {
        localStorage.setItem('chronoHistory', JSON.stringify(state.history));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde de l\'historique:', e);
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('chronoHistory');
        if (saved) {
            state.history = JSON.parse(saved);
            renderHistory();
        }
    } catch (e) {
        console.error('Erreur lors du chargement de l\'historique:', e);
    }
}

function renderHistory() {
    if (state.history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">Aucun chrono enregistré</p>';
        return;
    }
    
    historyList.innerHTML = state.history.map(item => {
        const minutes = Math.floor(item.totalTime / 60);
        const seconds = item.totalTime % 60;
        const timeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;
        
        return `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-category">${item.category}</div>
                    <div class="history-time">📅 ${item.timestamp}</div>
                </div>
                <div class="history-duration">⏱ ${timeStr}</div>
            </div>
        `;
    }).join('');
}

function clearHistory() {
    if (state.history.length === 0) return;
    
    if (confirm('Voulez-vous vraiment effacer tout l\'historique ?')) {
        state.history = [];
        saveHistory();
        renderHistory();
    }
}

// PWA - Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker enregistré avec succès:', registration.scope);
            })
            .catch(error => {
                console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
            });
    });
}

// PWA - Bouton d'installation
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Empêche l'affichage automatique du prompt
    e.preventDefault();
    deferredPrompt = e;
    
    // Affiche le bouton d'installation personnalisé
    if (installPrompt) {
        installPrompt.style.display = 'block';
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            return;
        }
        
        // Affiche le prompt d'installation
        deferredPrompt.prompt();
        
        // Attend la réponse de l'utilisateur
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Installation: ${outcome}`);
        
        // Cache le bouton après l'installation
        if (installPrompt) {
            installPrompt.style.display = 'none';
        }
        
        deferredPrompt = null;
    });
}

// Détecter si l'app est déjà installée
window.addEventListener('appinstalled', () => {
    console.log('Application installée avec succès!');
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
});

// Démarrer l'application
init();
