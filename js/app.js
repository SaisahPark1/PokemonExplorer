let pokemonList

async function makePokemon(){
    pokemonList = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then(res => res.json());
    pokemonList = pokemonList["results"]
    printPokemon()
}

function printPokemon(){
    for(let i = 0; i < pokemonList.length; i++){
        let pokemon = pokemonList[i]
        let pokeCard = document.getElementById("pokemonHolder").firstChild.cloneNode(true)
        pokeCard.id = i
        document.getElementById("pokemonHolder").appendChild(pokeCard)
    }
}

makePokemon()
