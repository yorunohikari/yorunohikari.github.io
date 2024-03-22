const infoContainer = document.getElementById('info-container');
const loadingElement = document.getElementById('loading');

fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
  .then(response => response.json())
  .then(data => {
    const earthquake = data.Infogempa.gempa;
    loadingElement.style.display = 'none';
    infoContainer.style.display = 'block';

    const feltRegions = earthquake.Dirasakan.split(', ');
    const formattedFeltRegions = feltRegions.join('<br>');

    const html = `
      <div class="info-item">
        <span class="label">Tanggal:</span>
        <span class="value">${earthquake.Tanggal}</span>
      </div>
      <div class="info-item">
        <span class="label">Jam:</span>
        <span class="value">${earthquake.Jam}</span>
      </div>
      <div class="info-item">
        <span class="label">Koordinat:</span>
        <span class="value">${earthquake.Coordinates}</span>
      </div>
      <div class="info-item">
        <span class="label">Magnitude:</span>
        <span class="value">${earthquake.Magnitude}</span>
      </div>
      <div class="info-item">
        <span class="label">Kedalaman:</span>
        <span class="value">${earthquake.Kedalaman}</span>
      </div>
      <div class="info-item">
        <span class="label">Wilayah:</span>
        <span class="value">${earthquake.Wilayah}</span>
      </div>
      <div class="info-item">
        <span class="label">Potensi:</span>
        <span class="value">${earthquake.Potensi}</span>
      </div>
      <div class="info-item">
        <span class="label">Dirasakan:</span>
        <span class="value">${formattedFeltRegions}</span>
      </div>
    `;

    infoContainer.innerHTML = html;
  })
  .catch(error => {
    console.error('Error fetching earthquake data:', error);
    loadingElement.textContent = 'Error loading data';
  });