// ----------------------- BACKGROUND MUSIC -----------------------
const AudioManager = {
    backgroundMusic: new Audio(),
    musicToggleButton: document.getElementById("music-toggle"),

    init: function() {
        if (this.backgroundMusic.canPlayType("audio/mpeg") !== "") {
            // Set the source of the audio file
            this.backgroundMusic.src = "/audio/music.mp3";
            // Set loop to true to play the audio in a loop
            this.backgroundMusic.loop = true;
        } else {
            console.log("Browser does not support MP3 audio.");
        }
        this.musicToggleButton.textContent = "Play Music";
        this.musicToggleButton.addEventListener("click", () => this.toggleMusic());
    },

    toggleMusic: function() {
        // Check if the audio is paused
        if (this.backgroundMusic.paused) {
            // Play the audio
            this.backgroundMusic.play().catch(error => {
                console.error("Error playing audio:", error);
            });
            // Update the button text
            this.musicToggleButton.textContent = "Stop Music";
        } else {
            // Pause the audio
            this.backgroundMusic.pause();
            // Update the button text
            this.musicToggleButton.textContent = "Play Music";
        }
    },

    playSound: function(filename) {
        const sound = new Audio(filename);
        sound.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    }
};

// Initialize AudioManager
AudioManager.init();