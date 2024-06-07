let timerInterval;
let startTime;

let timer = {
    startTimer: function () {
        if (!timerInterval) {
            timerInterval = setInterval(timer.updateTimerDisplay, 1000);
        }
    },
    updateTimerDisplay: function() {
        if (startTime) {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            document.getElementById('time').textContent = `${timer.padZero(minutes)}:${timer.padZero(seconds)}`;
        } else {
            document.getElementById('time').textContent = '00:00';
        }
    },
    stopTimer: function() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    },
    resetTimerDisplay: function() {
        timer.stopTimer();
        startTime = null;
        document.getElementById('time').textContent = '00:00';
    },
    padZero: function(value) {
        return String(value).padStart(2, '0');
    }
};
