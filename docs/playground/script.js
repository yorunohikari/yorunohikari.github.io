document.getElementById("messageForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Get input values
    const professorName = document.getElementById("professorName").value;
    const courseDetails = document.getElementById("courseDetails").value;
    const absenceDates = document.getElementById("absenceDates").value;
    const situation = document.getElementById("situation").value;
    const yourName = document.getElementById("yourName").value;
  
    // Generate message
    const message = `Dear Professor ${professorName},

I am writing to share with you that I will be unable to attend your class ${courseDetails} on the following dates: ${absenceDates} due to ${situation} situation. I hope to maintain and complete all course requirements that I will miss during my time away.
Can we set up a time to meet and discuss my upcoming absence and coursework?
Thank you in advance for your time. I look forward to talking to you soon.

Sincerely,
${yourName}`;
  
    // Display generated message
    document.getElementById("outputMessage").value = message;
  });
  
  document.getElementById("copyButton").addEventListener("click", function() {
    // Copy message to clipboard
    const outputMessage = document.getElementById("outputMessage");
    outputMessage.select();
    document.execCommand("copy");
  
    // Notify user
    alert("Message copied to clipboard!");
  });
  