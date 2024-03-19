// Get all app icons
var appIcons = document.querySelectorAll('.app-icon');

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

window.addEventListener('load', applyCustomBackground);

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

// Handle right-clicks outside of app icons
document.addEventListener('contextmenu', function (event) {
    var isAppIconClicked = Array.from(appIcons).some(function (icon) {
        return icon.contains(event.target);
    });

    if (!isAppIconClicked) {
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