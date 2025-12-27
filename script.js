// Function to handle the reveal/hide for cards, mimicking a terminal command
window.toggleReveal = function(element) {
    const toggleIcon = element.querySelector('.reveal-toggle');
    const content = element.nextElementSibling;
    
    if (content && toggleIcon) {
        // Toggle the 'visible' class, which triggers the CSS transition (max-height increase)
        content.classList.toggle('visible');
        
        // Toggle icon rotation
        toggleIcon.classList.toggle('rotated');
    }
};

// Initialize reveal state (all hidden by default by ensuring the initial class is present)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.data-terminal-card .hidden-content').forEach(content => {
        // Ensure initial state is set for the CSS transition to work on first click
        if (!content.classList.contains('hidden-content')) {
            content.classList.add('hidden-content');
        }
    });

    // Robot Typing Animation Re-initialization
    const typingElement = document.getElementById('typing-output');
    const initialText = "Hello, Explorer! Accessing Data Stream...";

    if (typingElement) {
        // Force reset and restart the CSS typing animation on load
        typingElement.textContent = initialText;
        typingElement.classList.remove('typing-text'); 
        // Small delay to trigger reflow and restart CSS animation
        setTimeout(() => {
            typingElement.classList.add('typing-text');
        }, 50); 
    }
});


// Robot Sign-off Animation on scroll
window.addEventListener('scroll', () => {
    const signoffSection = document.getElementById('ai-signoff');
    if (!signoffSection) return;

    const signoffText = document.getElementById('signoff-text');
    // Get the icon, whether it's the robot or the power-off icon
    const robot = signoffSection.querySelector('.fa-robot, .fa-power-off'); 

    if (!signoffText || !robot) return;

    const sectionTop = signoffSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    // Trigger effect when the section scrolls into the bottom 80% of the viewport
    if (sectionTop < windowHeight * 0.8) {
        // "Shutdown" state
        robot.style.color = '#ff0000'; // Red color for 'shutdown'
        robot.classList.add('fa-power-off');
        robot.classList.remove('fa-robot');
        // Apply blinking to the text (uses blink-caret keyframe from CSS)
        signoffText.style.animation = 'blink-caret 0.75s step-end infinite';
    } else {
        // Default "Active" state
        robot.style.color = '#00ffaa';
        robot.classList.remove('fa-power-off');
        robot.classList.add('fa-robot');
        signoffText.style.animation = 'none';
    }
});
