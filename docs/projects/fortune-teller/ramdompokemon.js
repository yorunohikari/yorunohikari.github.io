const totalPokemons = 898; // Total number of Pokémon in the PokeAPI (as of Gen 8)

function getRandomPokemonId() {
  // Generate a random ID between 1 and the total number of Pokémon
  return Math.floor(Math.random() * totalPokemons) + 1;
}

function fetchRandomPokemon() {
  const randomId = getRandomPokemonId();
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayPokemon(data);
    })
    .catch(error => {
      console.error('Error fetching random Pokémon:', error);
    });
}

function displayPokemon(pokemonData) {
  const container = document.getElementById('pokemon-container');

  // Clear previous content
  container.innerHTML = '';

  // Display Pokémon name
  const name = document.createElement('p');
  name.textContent = pokemonData.name;
  container.appendChild(name);

  // Display only the front default image
  const frontDefaultImg = document.createElement('img');
  frontDefaultImg.src = pokemonData.sprites.front_default;
  container.appendChild(frontDefaultImg);
}

// Example usage
fetchRandomPokemon();
