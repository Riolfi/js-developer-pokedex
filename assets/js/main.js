const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

pokemonList.addEventListener('click', (event) => {
    const pokemonElement = event.target.closest('.pokemon');

    if (pokemonElement) {
        const pokemonNumber = pokemonElement.dataset.number;
        console.log('Pokemon clicado:', pokemonNumber); // Verificar se o número é exibido no console


        pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/` })
        .then((pokemon) => {
            console.log('Detalhes do Pokémon:', pokemon); // Verificar se os dados estão sendo retornados corretamente
            showPokemonModal(pokemon);
        })
        .catch((error) => console.error('Erro ao buscar Pokémon:', error));
    
    }
});

function showPokemonModal(pokemon) {
    const modalDetails = document.getElementById('modalDetails');
    const pokemonModal = document.getElementById('pokemonModal');

    if (!pokemonModal) {
        console.error('Elemento modal não encontrado no DOM');
        return;
    }

    modalDetails.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
        <p><strong>Número:</strong> #${pokemon.number}</p>
        <p><strong>Tipo:</strong> ${pokemon.types.join(', ')}</p>
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Habilidades:</strong> ${pokemon.abilities.map((a) => a.ability.name).join(', ')}</p>
    `;

    // Abrir o modal
    pokemonModal.classList.remove('hidden');
}

const closeModal = document.getElementById('closeModal');
const pokemonModal = document.getElementById('pokemonModal');

closeModal.addEventListener('click', () => {
    pokemonModal.classList.add('hidden');
});

pokemonModal.addEventListener('click', (event) => {
    if (event.target === pokemonModal) {
        pokemonModal.classList.add('hidden');
    }
});

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})