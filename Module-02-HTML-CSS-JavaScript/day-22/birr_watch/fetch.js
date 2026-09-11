// fetch:

// fetch ("https://pokeapi.co/api/v2/pokemon/pikachu")

//     .then(response => {

//         if(!response.ok) {
//             throw new Error("This is a huge mistake")
//         }

//         return response.json();
//     })
//     .then(data => {console.log(data.name)})
//     .catch(error => { console.log(error)})







fetchData();

async function fetchData(){

    const pokemoneName = document.getElementById("pokemonName").value.toLowerCase();

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemoneName}`)
    try{

        if(!response.ok){
            throw new Error("Couldn't fetch the source.")
        }

        
        const data= await response.json();

        const pokemonSprite = data.sprites.front_default;

        const imgElement = document.getElementById("pokemonSprite");


        imgElement.src= pokemonSprite;

        imgElement.style.display="block";

    }

    catch(error){
        console.error(error)
    }
}