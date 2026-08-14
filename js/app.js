document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
});

let pokemonList
let selectedPokemon

async function makePokemon(){
    let data = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then(res => res.json());
    pokemonList = data.results
    await printPokemon()
}

async function printPokemon(searchData = null){
    const template = document.getElementById("pokemonHolder").firstElementChild
    console.log(searchData)
    let searchemon = []
    if (Number.isInteger(Number(searchData)) && Number(searchData) > 0){
        searchemon.push(searchData)
    } else if (typeof searchData === "string"){
        searchemon = pokemonList.filter(x => x.name.includes(searchData.toLowerCase())).map(x => pokemonList.indexOf(x)+1)
    } else {
        searchemon = pokemonList.map(x => pokemonList.indexOf(x)+1)
    }
    template.style.display = 'none'
    
    const container = document.getElementById('pokemonHolder');
    const first = container.firstElementChild;
    container.innerHTML = '';
    container.appendChild(first);

    for(let i = 0; i < searchemon.length; i++){
        let pokemon = await fetch("https://pokeapi.co/api/v2/pokemon/"+(searchemon[i])+"/").then(res => res.json());

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
            loadPokemonData(searchemon[i]);
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

document.getElementById("search-button").addEventListener("click", async function() {
    $('#loader').show().fadeTo(0, 100);
    $("body").css("overflow", "hidden");
    try{
        await printPokemon(document.getElementById("search-input").value)
    } catch {
        await printPokemon()
    }
    $("body").css("overflow", "visible");
    $('#loader').fadeTo(1000, 0, function() {
        $(this).hide(); // Hide after fade completes
    });
});

const scrollToTopButton = 
              document.getElementById('scroll-to-top');
              const moveThis = document.getElementById('pokemonHolder');

        // Smooth scroll to top
        function scrollToTop() {
            moveThis.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }