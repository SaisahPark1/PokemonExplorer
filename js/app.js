let pokemonList

async function makePokemon(){
    let data = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then(res => res.json());
    pokemonList = data.results
    await printPokemon()
}

async function printPokemon(){
    const template = document.getElementById("pokemonHolder").firstElementChild
    template.style.display = 'none' // hide the template so it doesn't show as a blank card
    for(let i = 0; i < pokemonList.length; i++){
        let pokemon = await fetch("https://pokeapi.co/api/v2/pokemon/"+(i+1)+"/").then(res => res.json());

        let pokeCard = template.cloneNode(true)
        pokeCard.style.display = '' // make sure the clone is visible
        pokeCard.id = "pokemon-"+i
        pokeCard.querySelector('#image').src = pokemon.sprites.front_default
        pokeCard.querySelector('#name').innerHTML = pokemon.name

        document.getElementById("pokemonHolder").appendChild(pokeCard)
        console.log("Pokemon Loaded: "+(i+1))
    }
}

async function load(){
    $("body").css("overflow", "hidden");
    await makePokemon()
    $("body").css("overflow", "visible");
    $('#loader').fadeTo(1000, 0)
}

load()