const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 649;  
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    const li = document.createElement('li');
    li.classList.add('pokemon', pokemon.type);
    li.setAttribute('data-pokemon-id', pokemon.number);

    li.innerHTML = `
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
    `;

    // Adicionar o evento de clique
    addPokemonClickEvent(li, pokemon);

    return li;
}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
    
    pokemon.abilities = pokeDetail.abilities.map(abilitySlot => abilitySlot.ability.name);

    const stats = pokeDetail.stats.reduce((acc, stat) => {
        if (stat.stat.name === 'hp') acc.hp = stat.base_stat;
        if (stat.stat.name === 'attack') acc.attack = stat.base_stat;
        if (stat.stat.name === 'defense') acc.defense = stat.base_stat;
        if (stat.stat.name === 'speed') acc.speed = stat.base_stat;
        if (stat.stat.name === 'special-attack') acc.specialAttack = stat.base_stat;
        if (stat.stat.name === 'special-defense') acc.specialDefense = stat.base_stat;
        return acc;
    }, {});

    pokemon.hp = stats.hp;
    pokemon.attack = stats.attack;
    pokemon.defense = stats.defense;
    pokemon.speed = stats.speed;
    pokemon.specialAttack = stats.specialAttack;
    pokemon.specialDefense = stats.specialDefense;

    return pokemon;
}

function showPokemonStatus(pokemon) {
    const statusContainer = document.getElementById('pokemonStatusContainer');

    statusContainer.className = 'pokemon-status';
    statusContainer.classList.add(pokemon.type);

    statusContainer.innerHTML = `
        <h2>${pokemon.name} (#${pokemon.number})</h2>
        <div class="detail">
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <div class="info">
                <h3>Habilidades:</h3>
                <ul>
                    ${pokemon.abilities.map(ability => `<li>${ability}</li>`).join('')}
                </ul>
                <h3>Status Base:</h3>
                <ul>
                    <li>HP: ${pokemon.hp}</li>
                    <li>Attack: ${pokemon.attack}</li>
                    <li>Defense: ${pokemon.defense}</li>
                    <li>Special Attack: ${pokemon.specialAttack}</li>
                    <li>Special Defense: ${pokemon.specialDefense}</li>
                    <li>Speed: ${pokemon.speed}</li>
                </ul>
            </div>
        </div>
    `;

    statusContainer.classList.remove('hidden');
    statusContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function addPokemonClickEvent(pokemonLi, pokemon) {
    pokemonLi.addEventListener('click', () => {
        showPokemonStatus(pokemon);
    });
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.forEach(pokemon => {
            const pokemonLi = convertPokemonToLi(pokemon);
            pokemonList.appendChild(pokemonLi);
        });
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;

    // Calcula o número total de registros a serem carregados
    const qtdRecordsWithNextPage = offset + limit;

    // Verifica se o próximo carregamento ultrapassaria o máximo de Pokémon
    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;  // Ajusta o limite para o número restante até 659
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);  // Remove o botão ao atingir o limite
    } else {
        loadPokemonItens(offset, limit);
    }
});