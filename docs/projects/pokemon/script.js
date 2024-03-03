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

        // Display Pokémon name (automatically uppercased)
        const name = document.createElement('p');
        const pokemonName = pokemonData.name.toUpperCase();
        name.textContent = pokemonName;
        name.classList.add('text-2xl', 'font-semibold'); // Add multiple classes to the <p> element
        container.appendChild(name);

        // Display Pokémon image
        const pokemonImg = document.createElement('img');
        pokemonImg.src = pokemonData.sprites.front_default;
        container.appendChild(pokemonImg);

        // Create the parent div with classes
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid', 'grid-cols-3', 'items-center', 'justify-center', 'w-full', 'gap-2');

        // Extract HP, Attack, and Defense stats from the fetched data
        const hp = pokemonData.stats.find(stat => stat.stat.name === 'hp').base_stat;
        const attack = pokemonData.stats.find(stat => stat.stat.name === 'attack').base_stat;
        const defense = pokemonData.stats.find(stat => stat.stat.name === 'defense').base_stat;

        // Create an object to hold the stat values
        const stats = {
          HP: hp,
          Attack: attack,
          Defense: defense
        };

        // Loop through each stat and create corresponding elements
        Object.entries(stats).forEach(([label, value]) => {
          const flexContainer = document.createElement('div');
          flexContainer.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-1');

          // Create span elements with classes
          const labelSpan = document.createElement('span');
          labelSpan.classList.add('text-sm', 'font-semibold', 'justify-center');
          labelSpan.textContent = label;

          const valueSpan = document.createElement('span');
          valueSpan.classList.add('text-xl', 'font-semibold');
          valueSpan.textContent = value; // Set the stat value

          // Append span elements to the child div
          flexContainer.appendChild(labelSpan);
          flexContainer.appendChild(valueSpan);

          // Append the child div to the parent div
          gridContainer.appendChild(flexContainer);
        });

        // Append the parent div to the container
        container.appendChild(gridContainer);

        // Change page title to Pokémon name
        document.title = `${pokemonName} - Pokémon`;

        // Change favicon to Pokémon image
        changeFavicon(pokemonData.sprites.front_default);
      }



      function changeFavicon(iconUrl) {
        const favicon = document.querySelector('link[rel="shortcut icon"]');
        favicon.href = iconUrl;
      }

      // Example usage:
      fetchRandomPokemon();
