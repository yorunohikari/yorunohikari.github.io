function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Adding 1 because January is 0-indexed
    const year = now.getFullYear();

    const timeString = `${hours}:${minutes}`;
    const dateString = `${month}/${day}/${year}`;

    document.getElementById('current-time').innerHTML = `${timeString}<br/>${dateString}`;
}

// Update time every second
setInterval(updateTime, 5000);

// Initial call to display time immediately
updateTime();


// Get all app icons
var appIcons = document.querySelectorAll('.app-icon');

// Get the image widget
var imageWidget = document.querySelector('.image-widget');

// Initialize variables to keep track of open context menus
var openContextMenu = null;

const phoneContainer = document.querySelector('.phone-container');

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
        widgetImage.src = '/assets/projects/nova.png';
    }
}

window.addEventListener('load', applyCustomBackground);
window.addEventListener('load', applyCustomImage);

// Add context menu to each app icon
appIcons.forEach(function (appIcon) {
    appIcon.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        closeOpenContextMenu();

        var contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';

        // Get screen dimensions
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        // Get context menu dimensions
        var contextMenuWidth = 200; // Replace with the actual width of your context menu
        var contextMenuHeight = 150; // Replace with the actual height of your context menu

        // Calculate the position of the context menu based on cursor location and screen dimensions
        var left = event.pageX;
        var top = event.pageY;

        // Check if the context menu will go out of the visible screen area
        if (left + contextMenuWidth > screenWidth) {
            left = screenWidth - contextMenuWidth;
        }
        if (top + contextMenuHeight > screenHeight) {
            top = screenHeight - contextMenuHeight;
        }

        contextMenu.style.left = left + 'px';
        contextMenu.style.top = top + 'px';

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

        var copyLinkMenuItem = document.createElement('div');
        copyLinkMenuItem.className = 'context-menu-item';
        copyLinkMenuItem.textContent = 'Copy Link';
        copyLinkMenuItem.onclick = function () {
            var appLink = "https://yorunohikari.github.io/projects/" + appIcon.parentNode.getAttribute('href');
            navigator.clipboard.writeText(appLink)
                .then(() => console.log('Link copied to clipboard'))
                .catch(err => console.error('Failed to copy link: ', err));
            closeOpenContextMenu();
        };
        contextMenu.appendChild(copyLinkMenuItem);

        var repoMenuItem = document.createElement('div');
        repoMenuItem.className = 'context-menu-item';
        repoMenuItem.textContent = 'Go to the Repository';
        repoMenuItem.onclick = function () {
            // Custom action for menu item 2 (go to repository)
            var appRepoLink = appIcon.parentNode.getAttribute('href') + 'repo';
            window.open(appRepoLink, '_blank');
        };
        contextMenu.appendChild(repoMenuItem);

        var itemseparator = document.createElement('div');
        itemseparator.className = 'context-menu-separator';
        contextMenu.appendChild(itemseparator);

        var propertiesMenuItem = document.createElement('div');
        propertiesMenuItem.className = 'context-menu-item';
        propertiesMenuItem.textContent = 'Properties';
        propertiesMenuItem.onclick = function () {
            // Custom action for the "Properties" menu item
            closeOpenContextMenu()
            showPropertiesModal(appIcon);
        };
        contextMenu.appendChild(propertiesMenuItem);

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

function fetchAppProperties(appLink) {
    // Construct the URL of the JSON file based on the app link
    const jsonUrl = `${appLink}properties.json`;

    return fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching app properties:', error);
            // Return a default properties object or handle the error as needed
            return {
                version: 'Unknown',
                lastUpdated: 'Unknown',
                owner: 'Unknown'
            };
        });
}

function showPropertiesModal(appIcon) {
    const appName = appIcon.parentNode.querySelector('.app-name').textContent;
    const appLink = appIcon.parentNode.getAttribute('href');
    const appIconSrc = appIcon.querySelector('img').src;
    const taksbarico = document.getElementById('taskbar-app-icon');
    // Set the src attribute of the taskbar app icon to the appIconSrc


    // Fetch app properties from JSON (you'll need to provide the JSON file)
    fetchAppProperties(appLink)
        .then(properties => {
            // Create the modal
            taksbarico.src = appIconSrc;
            taksbarico.style.display = 'flex';
            const modal = document.createElement('div');
            modal.id = 'propertiesModal';
            modal.className = 'modal';

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';

            // Create the main elements
            const modalHeader = document.createElement('div');
            modalHeader.className = 'modal-header';

            const rowheadContainer = document.createElement('div');
            rowheadContainer.className = 'rowhead';

            const rowheadInner = document.createElement('div');
            rowheadInner.className = 'rowhead';

            const appIconMini = document.createElement('div');
            appIconMini.className = 'app-icon-mini';

            const img = document.createElement('img');
            img.src = appIconSrc;
            img.alt = '';

            const appNameHeading = document.createElement('p');
            appNameHeading.textContent = `${appName} Properties`;

            const closeSpan = document.createElement('span');
            closeSpan.className = 'close';
            closeSpan.textContent = '×';
            closeSpan.onclick = function () {
                modal.remove();
                taksbarico.style.display = 'none';
            }

            // Append the elements to their respective parents
            appIconMini.appendChild(img);
            rowheadInner.appendChild(appIconMini);
            rowheadInner.appendChild(appNameHeading);
            rowheadContainer.appendChild(rowheadInner);
            rowheadContainer.appendChild(closeSpan);
            modalHeader.appendChild(rowheadContainer);


            const modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container';

            const modalBody = document.createElement('div');
            modalBody.className = 'modal-body';

            const appIconRow = document.createElement('div');
            appIconRow.className = 'row';

            const appIconElement = document.createElement('div');
            appIconElement.className = 'app-icon-p';

            const appIconImg = document.createElement('img');
            appIconImg.src = appIconSrc;
            appIconImg.alt = '';

            appIconElement.appendChild(appIconImg);

            const appNameInput = document.createElement('input');
            appNameInput.type = 'text';
            appNameInput.placeholder = appName + ".HTML";
            appNameInput.style.height = '20px';

            appIconRow.appendChild(appIconElement);
            appIconRow.appendChild(appNameInput);

            const fileTypeRow = document.createElement('div');
            fileTypeRow.className = 'row';

            const fileTypeLabel = document.createElement('p');
            fileTypeLabel.textContent = 'Type of file:';

            const fileTypeValue = document.createElement('p');
            fileTypeValue.textContent = 'HTML Document (.HTML)';

            fileTypeRow.appendChild(fileTypeLabel);
            fileTypeRow.appendChild(fileTypeValue);

            const separator1 = document.createElement('div');
            separator1.className = 'row-separator';

            const locationRow = document.createElement('div');
            locationRow.className = 'row';

            const locationLabel = document.createElement('p');
            locationLabel.textContent = 'Location:';

            const locationValue = document.createElement('p');
            locationValue.textContent = "./" + appLink;

            locationRow.appendChild(locationLabel);
            locationRow.appendChild(locationValue);

            const versionRow = document.createElement('div');
            versionRow.className = 'row';

            const versionLabel = document.createElement('p');
            versionLabel.textContent = 'Version:';

            const versionValue = document.createElement('p');
            versionValue.textContent = properties.version || 'Unknown';

            versionRow.appendChild(versionLabel);
            versionRow.appendChild(versionValue);

            const lastUpdatedRow = document.createElement('div');
            lastUpdatedRow.className = 'row';

            const lastUpdatedLabel = document.createElement('p');
            lastUpdatedLabel.textContent = 'Last updated:';

            const lastUpdatedValue = document.createElement('p');
            lastUpdatedValue.textContent = properties.lastUpdated || 'Unknown';

            lastUpdatedRow.appendChild(lastUpdatedLabel);
            lastUpdatedRow.appendChild(lastUpdatedValue);

            const separator2 = document.createElement('div');
            separator2.className = 'row-separator';

            const ownerRow = document.createElement('div');
            ownerRow.className = 'row';

            const ownerLabel = document.createElement('p');
            ownerLabel.textContent = 'Owner:';

            const ownerValue = document.createElement('p');
            ownerValue.textContent = properties.owner || 'Unknown';

            ownerRow.appendChild(ownerLabel);
            ownerRow.appendChild(ownerValue);

            modalBody.appendChild(appIconRow);
            modalBody.appendChild(fileTypeRow);
            modalBody.appendChild(separator1);
            modalBody.appendChild(locationRow);
            modalBody.appendChild(versionRow);
            modalBody.appendChild(lastUpdatedRow);
            modalBody.appendChild(separator2);
            modalBody.appendChild(ownerRow);

            modalContainer.appendChild(modalBody);

            const modalFooter = document.createElement('div');
            modalFooter.className = 'modal-footer';

            const okButton = document.createElement('button');
            okButton.id = 'okButton';
            okButton.textContent = 'OK';
            okButton.onclick = function () {
                modal.remove();
                taksbarico.style.display = 'none';
            };


            modalFooter.appendChild(okButton);

            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalContainer);
            modalContent.appendChild(modalFooter);

            modal.appendChild(modalContent);

            document.body.appendChild(modal);
            var modaldr = document.getElementById("propertiesModal");
            var modalHeaderdr = document.querySelector(".modal-header");

            // Variables to store the initial cursor position and modal position
            var isDragging = false;
            var initialX, initialY, currentX, currentY, xOffset = 0, yOffset = 0;

            // Add event listener for mousedown and touchstart events on the modal header
            modalHeaderdr.addEventListener("mousedown", dragStart);
            modalHeaderdr.addEventListener("touchstart", dragStart, { passive: false });

            // Add event listener for mousemove and touchmove events on the document
            document.addEventListener("mousemove", dragMove);
            document.addEventListener("touchmove", dragMove, { passive: true });

            // Add event listener for mouseup and touchend events on the document
            document.addEventListener("mouseup", dragEnd);
            document.addEventListener("touchend", dragEnd);

            // Function to handle the start of the drag
            function dragStart(e) {
                e = e || window.event; // Get the event object
                e.preventDefault();

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
        })
        .catch(error => {
            console.error('Error fetching app properties:', error);
        });
}

// Handle right-clicks on the image widget
imageWidget.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    closeOpenContextMenu();

    var contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';

    // Get screen dimensions
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    // Get context menu dimensions
    var contextMenuWidth = 200; // Replace with the actual width of your context menu
    var contextMenuHeight = 150; // Replace with the actual height of your context menu

    // Calculate the position of the context menu based on cursor location and screen dimensions
    var left = event.pageX;
    var top = event.pageY;

    // Check if the context menu will go out of the visible screen area
    if (left + contextMenuWidth > screenWidth) {
        left = screenWidth - contextMenuWidth;
    }
    if (top + contextMenuHeight > screenHeight) {
        top = screenHeight - contextMenuHeight;
    }

    contextMenu.style.left = left + 'px';
    contextMenu.style.top = top + 'px';

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
        event.preventDefault();
        closeOpenContextMenu();

        var outsideContextMenu = document.createElement('div');
        outsideContextMenu.className = 'context-menu';

        // Get screen dimensions
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        // Get context menu dimensions
        var contextMenuWidth = 160; // Replace with the actual width of your context menu
        var contextMenuHeight = 145; // Replace with the actual height of your context menu

        // Calculate the position of the context menu based on cursor location and screen dimensions
        var left = event.pageX;
        var top = event.pageY;

        // Check if the context menu will go out of the visible screen area
        if (left + contextMenuWidth > screenWidth) {
            left = screenWidth - contextMenuWidth;
        }
        if (top + contextMenuHeight > screenHeight) {
            top = screenHeight - contextMenuHeight;
        }

        outsideContextMenu.style.left = left + 'px';
        outsideContextMenu.style.top = top + 'px';

        // Add menu items for outside clicks
        var sortMenuItem = document.createElement('div');
        sortMenuItem.className = 'context-menu-item';
        sortMenuItem.textContent = 'Sort App';
        sortMenuItem.onclick = function () {
            sortAppsByName();
        };
        outsideContextMenu.appendChild(sortMenuItem);

        var refreshMenuItem = document.createElement('div');
        refreshMenuItem.className = 'context-menu-item';
        refreshMenuItem.textContent = 'Refresh';
        refreshMenuItem.onclick = function () {
            location.reload();
        };
        outsideContextMenu.appendChild(refreshMenuItem);

        var itemseparator = document.createElement('div');
        itemseparator.className = 'context-menu-separator';
        outsideContextMenu.appendChild(itemseparator);


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
                        try {
                            localStorage.setItem('customBackground', imageUrl);
                        } catch (error) {
                            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                                // Show a warning popup for quota exceeded error
                                alert('file too big, try another files');
                            } else {
                                throw error; // Re-throw other errors
                            }
                        }
                        applyCustomBackground(); // Call the function to update the background
                        closeOpenContextMenu();
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };

        outsideContextMenu.appendChild(changeBackgroundMenuItem);

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


// Define variables for touch events
let startX, currentX, translateX = 0;

// Add event listeners for touch events
phoneContainer.addEventListener('touchstart', touchStart, { passive: true });
phoneContainer.addEventListener('touchmove', touchMove, { passive: true });
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


let isReverseSort = false;

function sortAppsByName() {
    const container = document.querySelector('.content-container');
    const anchors = Array.from(container.querySelectorAll('a'));

    const anchorTextsAndElements = anchors.map(anchor => {
        const appNameDiv = anchor.querySelector('.app-name');
        const textContent = appNameDiv ? appNameDiv.textContent : '';
        return { text: textContent, element: anchor };
    });

    anchorTextsAndElements.sort((a, b) => {
        if (isReverseSort) {
            return a.text.localeCompare(b.text);
        } else {
            return b.text.localeCompare(a.text);
        }
    });

    const fragment = document.createDocumentFragment();
    const imageWidget = container.querySelector('.image-widget');

    anchorTextsAndElements.forEach(({ element }) => {
        if (!element.classList.contains('image-widget')) {
            fragment.appendChild(element);
        }
    });

    const childNodes = Array.from(container.childNodes);
    childNodes.forEach(node => {
        if (!node.classList?.contains('image-widget')) {
            node.remove();
        }
    });
    closeOpenContextMenu();
    container.appendChild(fragment);
    container.appendChild(imageWidget);
    saveOrder();

    // Toggle the sorting order for the next function call
    isReverseSort = !isReverseSort;
}


const draggables = document.querySelectorAll('.content-container > a, .content-container > #nova-widget');
const container = document.querySelector('.content-container');

window.addEventListener('load', () => {
    const order = JSON.parse(localStorage.getItem('contentOrder'));
    if (order && order.length > 0) {
        const container = document.querySelector('.content-container');
        order.forEach(item => {
            if (item.startsWith('image-widget-')) {
                const widgetId = item.replace('image-widget-', '');
                const widget = container.querySelector(`#${widgetId}`);
                if (widget) {
                    container.appendChild(widget);
                }
            } else {
                const link = container.querySelector(`a[href="${item}"]`);
                if (link) {
                    container.appendChild(link);
                }
            }
        });
    }
});


draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('appdragging');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('appdragging');
        saveOrder();
    });
});

container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientX);
    const draggable = document.querySelector('.appdragging');

    if (afterElement == null) {
        container.appendChild(draggable);
    } else {
        container.insertBefore(draggable, afterElement);
    }
});

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.content-container > a:not(.appdragging), .content-container > #nova-widget:not(.appdragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveOrder() {
    const order = [...container.querySelectorAll('.content-container > a, .content-container > #nova-widget')].map(item => {
        if (item.tagName === 'A') {
            return item.getAttribute('href');
        } else {
            return `image-widget-${item.id}`;
        }
    });
    localStorage.setItem('contentOrder', JSON.stringify(order));
}

// Get all the app links
const appLinks = Array.from(document.querySelectorAll('.content-container a'));
let selectedLink = null; // Track the currently selected link

// Detect if the user is on a desktop or mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Function to remove the 'selected' class from the currently selected link
function removeSelectedClass() {
    if (selectedLink) {
        selectedLink.classList.remove('selected');
        selectedLink = null;
    }
}

// Loop through each app link
appLinks.forEach(link => {
    // If on desktop, add a click event listener for double click
    if (!isMobile) {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the default link behavior

            removeSelectedClass(); // Remove the 'selected' class from the previously selected link

            // Add the 'selected' class to the clicked link
            link.classList.add('selected');
            selectedLink = link; // Update the currently selected link
        });

        link.addEventListener('dblclick', () => {
            window.location.href = link.href; // Navigate to the link on double click
        });
    }
});

// Add event listener to the document or parent container to remove the 'selected' class when clicking outside the app links
document.addEventListener('click', (e) => {
    const isClickInsideAppLinks = appLinks.some(link => link.contains(e.target));
    if (!isClickInsideAppLinks) {
        removeSelectedClass();
    }
});