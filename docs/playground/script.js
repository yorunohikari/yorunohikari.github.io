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
  // Get the selected value from the dropdown menu
  const salamDropdown = document.getElementById('salam');
  const selectedSalam = salamDropdown.value;

  // Parse the date string
  const date = new Date(absenceDates);

  // Define an array of Indonesian day names
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
  ];

  // Define an array of Indonesian month names
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  // Format the date
  const formattedDate = `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;


  // Generate message
  let message = '';

  if (selectedSalam === 'Aww') {
    message += `Assalamualaikum Warahmatullahi Wabarakatuh

Mohon maaf mengganggu waktu `;
  } else {
    message += `Selamat ${selectedSalam.toLowerCase()}

Mohon maaf mengganggu waktu `;
  }

  if (professorTitle === 'Sensei') {
    message += `${professorName} ${professorTitle}`;
  } else if (professorTitle === 'Prof') {
    message += `${professorTitle} ${professorName}`;
  } else {
    message += `${professorTitle} ${professorName}`;
  }

  message += `.

Saya ${yourName}, NIM ${NIM}, kelas ${courseDetails}. Melalui pesan ini, saya memberitahukan saat ini saya sedang ${situation}. Sehingga saya tidak bisa mengikuti kelas pada hari ${formattedDate}. 
Untuk itu, saya mohon pengertian dari `;

  if (professorTitle === 'Sensei') {
    message += `${professorName} ${professorTitle}`;
  } else if (professorTitle === 'Prof') {
    message += `${professorTitle} ${professorName}`;
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

