const searchForm= document.querySelector('form');
const searchInput= document.querySelector('#search');
const resultsList= document.querySelector('#results');
const searchHistoryList= document.querySelector('datalist#search-history');

document.addEventListener('DOMContentLoaded', displaySearchHistory);
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue){
        saveSearchHistory(searchValue);
        displaySearchHistory();
        searchRecipes(searchValue);
    }
});

async function searchRecipes(searchValue){
    const response= await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=73372ea2&app_key=c9d78960e4acb122f62edb4cfb533769&from=0&to=12`);
    const data= await response.json();
    displayRecipes(data.hits);
}

function displayRecipes(recipes){
    let html= '';
    recipes.forEach((recipe)=> {
        html += `
        <div>
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `;
    });
    resultsList.innerHTML= html;
}

function saveSearchHistory(searchValue){
    let history= JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(searchValue)){
        history.push(searchValue);
        if (history.length > 10){ 
            history.shift(); 
        }
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

function displaySearchHistory(){
    let history= JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryList.innerHTML= '';
    history.forEach(term=>{
        const option= document.createElement('option');
        option.value= term;
        searchHistoryList.appendChild(option);
    });

}
