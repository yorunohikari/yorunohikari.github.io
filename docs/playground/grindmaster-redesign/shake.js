let clickCount = 0;
let isPermanentChange = false;
let isAngrySoundPlayed = false;
let isAnimationRunning = false; // Flag to track if animation is running

const projectImg = document.getElementById('project-img');
const shakeSound = document.getElementById('shake-sound');
const angrySound = document.getElementById('angry-sound');

projectImg.addEventListener('click', () => {
  if (isPermanentChange || isAnimationRunning) return; // Ignore clicks during animation or after permanent change
  
  isAnimationRunning = true; // Set flag to true
  
  clickCount++;
  
  // Change to another image
  projectImg.src = "/assets/marcille-cri.png";
  projectImg.alt = "another image";
  
  // Add shake animation class
  projectImg.classList.add('shake');
  
  // Play shake sound
  playShakeSound();

  function playShakeSound() {
    shakeSound.currentTime = 0;
    shakeSound.play()
      .then(() => {
        // Animation end handling
        projectImg.addEventListener('animationend', onAnimationEnd, { once: true });
      })
      .catch((error) => {
        console.error('Error playing shake sound:', error);
        onAnimationEnd(); // Proceed to animation end handling despite error
      });
  }

  function onAnimationEnd() {
    projectImg.classList.remove('shake');
    
    // Revert to original image if not permanently changed
    if (!isPermanentChange) {
      projectImg.src = "/assets/marchile.png";
      projectImg.alt = "marchile";
    }
    
    isAnimationRunning = false; // Reset animation flag after animation ends
    
    // Check if it's time to permanently change the image
    if (clickCount >= 10 && !isAngrySoundPlayed) {
      isPermanentChange = true;
      isAngrySoundPlayed = true; // Mark angry sound as played
      
      // Pause shake sound if still playing
      shakeSound.pause();
      
      // Play angry sound
      playAngrySound();
      
      // Change to angry image
      projectImg.src = "/assets/marcille-angy.png";
      projectImg.alt = "angry image";
    }
  }

  function playAngrySound() {
    angrySound.currentTime = 0;
    angrySound.play()
      .catch(error => console.error('Error playing angry sound:', error));
  }
});
