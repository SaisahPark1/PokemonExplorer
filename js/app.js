let pokemonList
let selectedPokemon

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
        pokeCard.querySelector('#name').innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        document.getElementById("pokemonHolder").appendChild(pokeCard)
        console.log("Pokemon Loaded: "+(i+1))
        document.getElementById("pokemon-"+i).addEventListener("click", function() {
            let audio = new Audio(pokemon.cries.legacy);
            audio.play();
            loadPokemonData(i+1);
        });
    }
}

async function load(){
    $("body").css("overflow", "hidden");
    await makePokemon()
    $("body").css("overflow", "visible");
    $('#loader').fadeTo(1000, 0, function() {
        $(this).hide(); // Hide after fade completes
    });
}

async function loadPokemonData(dexNumber){
    let pokemon = await fetch("https://pokeapi.co/api/v2/pokemon/"+(dexNumber)+"/").then(res => res.json());
    console.log(pokemon)
    document.getElementById("close-up").src = pokemon.sprites.front_default
    document.getElementById("info-name").innerHTML = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById("number").innerHTML = dexNumber
    document.getElementById("p-type").innerHTML = pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1);
    try{
        document.getElementById("s-type").innerHTML = pokemon.types[1].type.name.charAt(0).toUpperCase() + pokemon.types[1].type.name.slice(1);
    } catch {
        document.getElementById("s-type").innerHTML = "N/A"
    }
    document.getElementById("height").innerHTML = pokemon.height/10+" m"
    document.getElementById("weight").innerHTML = pokemon.weight/10+" kg"
    document.getElementById("exp").innerHTML = pokemon.base_experience
}

load()