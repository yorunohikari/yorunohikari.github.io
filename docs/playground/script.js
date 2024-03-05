document.getElementById("messageForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get input values
  const yourName = document.getElementById("yourName").value;
  const NIM = document.getElementById("NIM").value;
  const professorTitleElement = document.querySelector('.radio-options input[name="professorTitle"]:checked');
  const professorTitle = professorTitleElement ? professorTitleElement.value : '';
  const professorName = document.getElementById("professorName").value;
  const courseDetails = document.getElementById("courseDetails").value;
  const absenceDates = document.getElementById("absenceDates").value;
  const situation = document.getElementById("situation").value;

  // Generate message
  let message = `Assalamualaikum warahmatullahi wabarakatuh

Mohon maaf mengganggu waktu `;
  
  if (professorTitle === 'Sensei') {
    message += `${professorName} ${professorTitle}`;
  } else {
    message += `${professorTitle} ${professorName}`;
  }
  
  message += `.

Saya ${yourName}, NIM ${NIM}, kelas ${courseDetails}. Melalui pesan ini, saya memberitahukan saat ini saya sedang ${situation}. Sehingga saya tidak bisa mengikuti kelas pada hari ${absenceDates}. 
Untuk itu, saya mohon pengertian dari `;

  if (professorTitle === 'Sensei') {
    message += `${professorName} ${professorTitle}`;
  } else {
    message += `${professorTitle} ${professorName}`;
  }

  message += ` agar memberi izin saya untuk tidak mengikuti kelas. Demikian yang dapat saya sampaikan. Mohon maaf apabila ada kata-kata yang kurang berkenan. 

Terima kasih 🙏🏻`;

  // Display generated message
  document.getElementById("outputMessage").value = message;
});


document.getElementById("copyButton").addEventListener("click", function () {
  // Select the text inside the textarea
  const outputMessage = document.getElementById("outputMessage");
  outputMessage.select();
  // Copy the selected text
  document.execCommand("copy");
  // Deselect the text
  window.getSelection().removeAllRanges();
  // Notify the user
  alert("Pesan tersalin!");
});

