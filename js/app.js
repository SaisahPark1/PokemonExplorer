let pokemonList

async function makePokemon(){
    pokemonList = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then(res => res.json());
    pokemonList = pokemonList["results"]
    console.log(pokemonList)
    printPokemon()
}

async function printPokemon(){
    for(let i = 0; i < pokemonList.length; i++){
        let pokemon = await fetch("https://pokeapi.co/api/v2/pokemon/"+(i+1)+"/").then(res => res.json());
        console.log(pokemon)
        let pokeCard = document.getElementById("pokemonHolder").firstChild.cloneNode(true)
        pokeCard.id = i
        pokeCard.querySelector('#image').src = pokemon["sprites"]["front_default"]
        pokeCard.querySelector("#name").innerHTML = pokemon["name"]
        document.getElementById("pokemonHolder").appendChild(pokeCard)
    }
}

makePokemon()
