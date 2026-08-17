document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
});

let pokemonList
let selectedPokemon
let filter = "none"
let pokemonAmount = 151

async function makePokemon(){
    let data = await fetch('https://pokeapi.co/api/v2/pokemon?limit='+pokemonAmount+'&offset=0').then(res => res.json());
    pokemonList = data.results
    await printPokemon(document.getElementById("search-input").value)
}

async function printPokemon(searchData = null){
    const template = document.getElementById("pokemonHolder").firstElementChild
    let searchemon = []
    let allFiltered

    if (filter != "none"){
        allFiltered = await fetch("https://pokeapi.co/api/v2/type/"+filter).then(res => res.json());
        allFiltered = allFiltered.pokemon
        const filteredNames = new Set(allFiltered.map(y => y.pokemon.name));
        allFiltered = pokemonList.filter(x => filteredNames.has(x.name));
    } else {
        allFiltered = pokemonList
    }

    if (Number.isInteger(Number(searchData)) && 0 < Number(searchData) && Number(searchData)<= pokemonAmount){
        searchemon.push(searchData)
    } else if (typeof searchData === "string"){
        searchemon = allFiltered.filter(x => x.name.includes(searchData.toLowerCase())).map(x => pokemonList.indexOf(x)+1)
    } else {
        searchemon = allFiltered.map(x => pokemonList.indexOf(x)+1)
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
    let audio = new Audio(pokemon.cries.latest);
        audio.play();
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

document.getElementById('typing').addEventListener('change', async function(e) {
    $('#loader').show().fadeTo(0, 100);
    $("body").css("overflow", "hidden");
    filter = e.target.value
    await printPokemon(document.getElementById("search-input").value)
    $("body").css("overflow", "visible");
    $('#loader').fadeTo(1000, 0, function() {
        $(this).hide(); // Hide after fade completes
    });
});

document.getElementById('pokeNum').addEventListener('submit', async function(e) {
    $('#loader').show().fadeTo(0, 100);
    $("body").css("overflow", "hidden");
    e.preventDefault();
    pokemonAmount = Number(document.getElementById('numberOf').value);
    if (pokemonAmount > 1025){
        pokemonAmount = 1025
    }
    await makePokemon();
    $("body").css("overflow", "visible");
    $('#loader').fadeTo(1000, 0, function() {
        $(this).hide(); // Hide after fade completes
    });
});

document.getElementById("happyGoL").addEventListener("click", async function() {
    await loadPokemonData(Math.floor(Math.random() * pokemonAmount))
});