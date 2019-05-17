'use strict'

 const app_id = '05f2d1ca';
 const app_key = 'a4dec545d5546bb4e6f95812a8af50a4';
 const searchUrl = 'https://api.edamam.com/search';

function formatQueryParams(params) {
    console.log(params);
    const queryItems = Object.keys(params)
      .map(key => {
        if (!!params[key] && params[key].length)
          return key + '=' + params[key]
      })
      .filter(Boolean)
      .reduce((acc, item) => {
        const split = item.split('=')
        const key = split[0]
        const values = split[1].split(',')
        values.forEach(v => acc.push(`${key}=${v.trim()}`))
        return acc
      }, [])
    return queryItems.join('&');
};

function getRecipes(recipe, health, diet, exclude) {
    const params = {
        q: recipe,
        app_id: app_id,
        app_key: app_key,
        health: health,
        diet: diet,
        excluded: exclude,
        to: 15
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;

    console.log(url);
    
    fetch(url)
        .then(response => {
            if (response.ok) {
                $('#js-error-message').text('');
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#recipe-results').addClass('hidden');
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function displayResults(responseJson) {
    console.log(responseJson);
    $('#recipe-list').empty();
    for(let i = 0; i < responseJson.hits.length; i++) {
        $('#recipe-list').append(
        `<li><h3><a href="${responseJson.hits[i].recipe.url}">${responseJson.hits[i].recipe.label}</a>
        <img class="recipe-photo" src="${responseJson.hits[i].recipe.image}"
      </li>`
    )};
    $('#recipe-results').removeClass('hidden');
};

function getMeetups(zipCode) {
    
};

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const recipe = $('#js-recipe-search').val();
        const health = $('#health-choices').val();
        const diet = $('#diet-choices').val();
        const exclude = $('#exclude').val();
        const zipCode = $('#zipcode').val();
        getRecipes(recipe, health, diet, exclude);
        getMeetups(zipCode);
    });
};

watchForm();