// Check if names exist in local storage and display them
window.onload = function() {
    if (localStorage.getItem('names')) {
      document.getElementById('nameInput').value = localStorage.getItem('names');
    }
  }
  
  // Function to display set names modal
function displaySetModal() {
    // Fetch names from local storage
    var savedNames = localStorage.getItem('names');
    if(savedNames) {
      // Set names in the text area
      document.getElementById('nameInput').value = savedNames;
    }
    document.getElementById('setModal').style.display = 'block';
  }
  
  
  // Function to close set names modal
  function closeSetModal() {
    document.getElementById('setModal').style.display = 'none';
  }
  
  // Function to set names from input field
  function setNames() {
    var names = document.getElementById('nameInput').value.split('\n').filter(Boolean);
    localStorage.setItem('names', names.join('\n'));
    closeSetModal();
  }
  
// Function to pick a random name with spinning animation
function pickName() {
    var names = localStorage.getItem('names');
    if (names) {
      names = names.split('\n').filter(Boolean);
      if (names.length > 0) {
        var duration = 3000; // Total animation duration in milliseconds
        var nameSlot = document.getElementById('nameSlot');
        var pickNameBtn = document.getElementById('pickNameBtn');
        var nameElements = []; // Define and initialize nameElements array
        
        pickNameBtn.disabled = true;
        
        // Create and append name elements to the name slot
        names.forEach(function(name) {
          var nameElement = document.createElement('div');
          nameElement.className = 'name-element';
          nameElement.innerText = name;
          nameSlot.appendChild(nameElement);
          nameElements.push(nameElement);
        });
        
        // Start animation
        setTimeout(function() {
          nameElements.forEach(function(element) {
            var angle = Math.random() * 360; // Random angle between 0 and 360 degrees
            var distance = Math.random() * 100 + 200; // Random distance between 200 and 300 pixels
            var transform = 'translate(-50%, -50%) rotate(' + angle + 'deg) translate(' + distance + 'px) rotate(-' + angle + 'deg)';
            element.style.transform = transform;
            element.style.opacity = 1; // Show the element
          });
          
          // Pick a random final name
          var finalIndex = Math.floor(Math.random() * names.length);
          var finalName = names[finalIndex];
          nameSlot.innerText = finalName; // Display the final picked name
          pickNameBtn.disabled = false;
          pickNameBtn.innerText = 'Pick Again';
          document.getElementById('removeNameBtn').style.display = 'inline-block';
        }, 100); // Delay before starting animation
        
      } else {
        alert('Please set names first.');
      }
    } else {
      alert('Please set names first.');
    }
  }
  
  
  
  // Function to remove picked name from the list
  function removeName() {
    var pickedName = document.getElementById('nameSlot').innerText;
    var names = localStorage.getItem('names').split('\n').filter(Boolean);
    var index = names.indexOf(pickedName);
    if (index > -1) {
      names.splice(index, 1);
    }
    localStorage.setItem('names', names.join('\n'));
    document.getElementById('nameSlot').innerText = '';
    document.getElementById('pickNameBtn').innerText = 'Pick Name';
    document.getElementById('removeNameBtn').style.display = 'none';
  }
  