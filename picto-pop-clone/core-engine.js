// Shadow Monastery Animations (Gothic Adult Themes)

// Undress Animation
function undressAnimation(element, steps, duration) {
    let currentState = 0;
    const interval = duration / steps.length;

    const intervalID = setInterval(() => {
        if (currentState >= steps.length) {
            clearInterval(intervalID);
            return;
        }
        element.style.backgroundImage = `url(${steps[currentState]})`;
        currentState++;
    }, interval);
}

// Face Swap Animation
function faceSwapAnimation(element, faceStates, duration) {
    let currentFace = 0;

    const faceInterval = setInterval(() => {
        if (currentFace >= faceStates.length) {
            clearInterval(faceInterval);
            return;
        }
        element.style.backgroundImage = `url(${faceStates[currentFace]})`;
        currentFace++;
    }, duration / faceStates.length);
}

// Export Animations
export { undressAnimation, faceSwapAnimation };