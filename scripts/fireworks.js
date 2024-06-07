// ----------------------- FIREWORKS ANIMATION -----------------------
function addFireworksContainer() {
    const svgNS = "http://www.w3.org/2000/svg";
    const fireworksContainer = document.createElementNS(svgNS, "svg");
    fireworksContainer.setAttribute("id", "fireworks-container");
    fireworksContainer.setAttribute("width", "100%");
    fireworksContainer.setAttribute("height", "100%");
    document.getElementById('game-board').appendChild(fireworksContainer); // Append to game-board
}

function startFireworks() {
    for (let i = 0; i < 30; i++) {
        setTimeout(createFirework, i * 100); // Stagger the fireworks
    }
}

function createFirework() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("fireworks-container");
    const gameBoard = document.getElementById("game-board");

    const rect = gameBoard.getBoundingClientRect();
    const cx = Math.random() * rect.width;
    const cy = Math.random() * rect.height;

    for (let i = 0; i < 10; i++) {
        const firework = document.createElementNS(svgNS, "circle");
        firework.setAttribute("cx", cx.toString());
        firework.setAttribute("cy", cy.toString());
        firework.setAttribute("r", "0");
        firework.setAttribute("fill", "transparent");
        firework.setAttribute("stroke", getRandomColor());
        firework.setAttribute("stroke-width", "2");
        svg.appendChild(firework);

        animateFirework(firework, i * 0.1);
    }
}

function animateFirework(element, delay) {
    const duration = 1;
    const endRadius = (50 + Math.random() * 50).toFixed(2);

    const keyframes = [
        { offset: 0, r: "0", opacity: 1 },
        { offset: 1, r: endRadius + "px", opacity: 0 }
    ];

    const timing = {
        duration: duration * 1000,
        delay: delay * 1000,
        fill: 'forwards'
    };

    const animation = element.animate(keyframes, timing);
    animation.onfinish = () => {
        element.remove();
    };
}

function getRandomColor() {
    const colors = ["#007900", "#00ff00", "#ed4dffff", "#b366ffff", "#ffffff"];
    return colors[Math.floor(Math.random() * colors.length)];
}