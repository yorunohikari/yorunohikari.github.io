var modaldr = document.getElementById("propertiesModal");
var modalHeaderdr = document.querySelector(".modal-header");

// Variables to store the initial cursor position and modal position
var isDragging = false;
var initialX, initialY, currentX, currentY, xOffset = 0, yOffset = 0;

// Add event listener for mousedown and touchstart events on the modal header
modalHeaderdr.addEventListener("mousedown", dragStart);
modalHeaderdr.addEventListener("touchstart", dragStart);

// Add event listener for mousemove and touchmove events on the document
document.addEventListener("mousemove", dragMove);
document.addEventListener("touchmove", dragMove);

// Add event listener for mouseup and touchend events on the document
document.addEventListener("mouseup", dragEnd);
document.addEventListener("touchend", dragEnd);

// Function to handle the start of the drag
function dragStart(e) {
    e = e || window.event; // Get the event object
    e.preventDefault(); // Prevent default behavior (e.g., text selection)

    // Get the current cursor position and modal position
    initialX = e.clientX || e.touches[0].clientX;
    initialY = e.clientY || e.touches[0].clientY;
    currentX = modaldr.offsetLeft;
    currentY = modaldr.offsetTop;

    // Calculate the offset between the cursor position and the modal position
    xOffset = initialX - currentX;
    yOffset = initialY - currentY;

    // Set the isDragging flag to true
    isDragging = true;

    // Add the 'dragging' class to the modal for styling purposes (optional)
    modaldr.classList.add("dragging");
}

// Function to handle the movement of the drag
function dragMove(e) {
    e = e || window.event; // Get the event object
    e.preventDefault(); // Prevent default behavior (e.g., text selection)

    // If the modal is being dragged
    if (isDragging) {
        // Get the new cursor position
        currentX = e.clientX || e.touches[0].clientX;
        currentY = e.clientY || e.touches[0].clientY;

        // Calculate the new modal position
        var newX = currentX - xOffset;
        var newY = currentY - yOffset;

        // Update the modal position
        modaldr.style.left = newX + "px";
        modaldr.style.top = newY + "px";
    }
}

// Function to handle the end of the drag
function dragEnd(e) {
    // Reset the isDragging flag to false
    isDragging = false;

    // Remove the 'dragging' class from the modal (optional)
    modaldr.classList.remove("dragging");
}