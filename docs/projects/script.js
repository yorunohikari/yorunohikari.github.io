// Get all app icons
var appIcons = document.querySelectorAll('.app-icon');

// Get the image widget
var imageWidget = document.querySelector('.image-widget');

// Initialize variables to keep track of open context menus
var openContextMenu = null;

function applyCustomBackground() {
    var phoneContainer = document.querySelector('.phone-container');
    var customBackground = localStorage.getItem('customBackground');

    if (customBackground) {
        phoneContainer.style.backgroundImage = `url('${customBackground}')`;
    } else {
        // Set the default background image here
        phoneContainer.style.backgroundImage = 'url("/assets/projects/backgroundahomev2.png")';
    }
}

function applyCustomImage() {
    var widgetImage = imageWidget.querySelector('img');
    var customImage = localStorage.getItem('customImage');

    if (customImage) {
        widgetImage.src = customImage;
    } else {
        // Set the default image here
        widgetImage.src = '/docs/assets/projects/nova.png';
    }
}

window.addEventListener('load', applyCustomBackground);
window.addEventListener('load', applyCustomImage);

// Add context menu to each app icon
appIcons.forEach(function (appIcon) {
    appIcon.addEventListener('contextmenu', function (event) {
        event.preventDefault(); // Prevent default right-click menu

        // Close any open context menu
        closeOpenContextMenu();

        // Create and position context menu
        var contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.top = event.pageY + 'px';

        // Add menu items
        var openMenuItem = document.createElement('div');
        openMenuItem.className = 'context-menu-item';
        openMenuItem.textContent = 'Open';
        openMenuItem.onclick = function () {
            var appLink = appIcon.parentNode.getAttribute('href');
            window.location.href = appLink;
        };
        contextMenu.appendChild(openMenuItem);

        var itemseparator = document.createElement('div');
        itemseparator.className = 'context-menu-separator';
        contextMenu.appendChild(itemseparator);
        
        var repoMenuItem = document.createElement('div');
        repoMenuItem.className = 'context-menu-item';
        repoMenuItem.textContent = 'Go to the Repository';
        repoMenuItem.onclick = function () {
            // Custom action for menu item 2 (go to repository)
            var appRepoLink = appIcon.parentNode.getAttribute('href') + 'repo';
            window.open(appRepoLink, '_blank');
        };
        contextMenu.appendChild(repoMenuItem);

        // Add context menu to the document
        document.body.appendChild(contextMenu);

        // Update openContextMenu variable
        openContextMenu = contextMenu;

        // Close context menu when clicking outside of it
        document.addEventListener('click', function (event) {
            if (!contextMenu.contains(event.target)) {
                closeOpenContextMenu();
            }
        });
    });
});

// Handle right-clicks on the image widget
imageWidget.addEventListener('contextmenu', function (event) {
    event.preventDefault(); // Prevent default right-click menu

    // Close any open context menu
    closeOpenContextMenu();

    // Create and position context menu
    var contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';

    // Add menu item to change the image
    var changeImageMenuItem = document.createElement('div');
    changeImageMenuItem.className = 'context-menu-item';
    changeImageMenuItem.textContent = 'Change Image';
    changeImageMenuItem.onclick = function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageUrl = e.target.result;
                    localStorage.setItem('customImage', imageUrl);
                    applyCustomImage(); // Call the function to update the image
                    closeOpenContextMenu();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };
    contextMenu.appendChild(changeImageMenuItem);

    // Add context menu to the document
    document.body.appendChild(contextMenu);

    // Update openContextMenu variable
    openContextMenu = contextMenu;

    // Close context menu when clicking outside of it
    document.addEventListener('click', function (event) {
        if (!contextMenu.contains(event.target)) {
            closeOpenContextMenu();
        }
    });
});

// Handle right-clicks outside of app icons
document.addEventListener('contextmenu', function (event) {
    var isAppIconClicked = Array.from(appIcons).some(function (icon) {
        return icon.contains(event.target);
    });

    var isImageWidgetClicked = imageWidget.contains(event.target);

    if (!isAppIconClicked && !isImageWidgetClicked) {
        event.preventDefault(); // Prevent default right-click menu

        // Close any open context menu
        closeOpenContextMenu();

        // Create and position context menu for outside clicks
        var outsideContextMenu = document.createElement('div');
        outsideContextMenu.className = 'context-menu';
        outsideContextMenu.style.left = event.pageX + 'px';
        outsideContextMenu.style.top = event.pageY + 'px';

        // Add menu items for outside clicks
        var changeBackgroundMenuItem = document.createElement('div');
        changeBackgroundMenuItem.className = 'context-menu-item';
        changeBackgroundMenuItem.textContent = 'Change Background';
        changeBackgroundMenuItem.onclick = function () {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function (e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const imageUrl = e.target.result;
                        localStorage.setItem('customBackground', imageUrl);
                        applyCustomBackground(); // Call the function to update the background
                        closeOpenContextMenu()
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };
        outsideContextMenu.appendChild(changeBackgroundMenuItem);

        var refreshMenuItem = document.createElement('div');
        refreshMenuItem.className = 'context-menu-item';
        refreshMenuItem.textContent = 'Refresh';
        refreshMenuItem.onclick = function () {
            location.reload();
        };
        outsideContextMenu.appendChild(refreshMenuItem);

        // Add context menu for outside clicks to the document
        document.body.appendChild(outsideContextMenu);

        // Update openContextMenu variable
        openContextMenu = outsideContextMenu;

        // Close context menu for outside clicks when clicking outside of it
        document.addEventListener('click', function (event) {
            if (!outsideContextMenu.contains(event.target)) {
                closeOpenContextMenu();
            }
        });
    }
});


// Function to close the currently open context menu
function closeOpenContextMenu() {
    if (openContextMenu !== null) {
        openContextMenu.remove();
        openContextMenu = null;
    }
}

// Get the phone container element
const phoneContainer = document.querySelector('.phone-container');

// Define variables for touch events
let startX, currentX, translateX = 0;

// Add event listeners for touch events
phoneContainer.addEventListener('touchstart', touchStart);
phoneContainer.addEventListener('touchmove', touchMove);
phoneContainer.addEventListener('touchend', touchEnd);

function touchStart(e) {
  startX = e.touches[0].clientX;
  // Get the current translation value
  translateX = parseInt(document.querySelector('.content-container').style.transform.replace(/[^0-9\-]/g, '')) || 0;
}

function touchMove(e) {
  currentX = e.touches[0].clientX;
  const diff = currentX - startX; // Reversed the order of subtraction
  const newTranslateX = translateX + diff;

  // Limit the translation to the width of the content container
  const contentContainer = document.querySelector('.content-container');
  const maxTranslation = contentContainer.offsetWidth * 0.4; // 80% of the container width
  const clampedTranslation = Math.max(-maxTranslation, Math.min(maxTranslation, newTranslateX));
  contentContainer.style.transform = `translateX(${clampedTranslation}px)`;
}

function touchEnd(e) {
  const contentContainer = document.querySelector('.content-container');
  const containerWidth = contentContainer.offsetWidth;
  const threshold = containerWidth * 0.2; // 20% of the container width
  const maxTranslation = containerWidth * 0.4; // 80% of the container width

  // Reverse the swipe direction: swiping from left to right moves to the previous "page"
  if (translateX < -threshold) {
    translateX += containerWidth;
  } else if (translateX > threshold) {
    translateX -= containerWidth;
  }

  // Limit the translation to the maximum allowed value
  translateX = Math.max(-maxTranslation, Math.min(maxTranslation, translateX));

  // Reset the translation to a multiple of the container width
  const clampedTranslation = Math.round(translateX / containerWidth) * containerWidth;
  contentContainer.style.transform = `translateX(${clampedTranslation}px)`;
}