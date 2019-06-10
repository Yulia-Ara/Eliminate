'use strict'

//These are for the recipe search api
 const app_id = '05f2d1ca';
 const app_key = 'a4dec545d5546bb4e6f95812a8af50a4';
 const searchUrl = 'https://api.edamam.com/search';

//This function formats the parameters for the Edamam API
function formatQueryParams(params) {
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
        values.forEach(v => {
            if (v.trim().length)
                acc.push(`${key}=${v.trim()}`)
        });
        return acc
      }, [])
    return queryItems.join('&');
};

function getRecipes(recipe, health, diet, exclude) {
    const params = {
        q: recipe,
        app_id: app_id,
        app_key: app_key,
        from: '0',
        to: '20',
        health: health,
        diet: diet,
        excluded: exclude
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;
    fetch(url)
        .then(response => {
            if (response.ok) {
                $('#recipe-error-message').text('');
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayRecipes(responseJson))
        .catch(err => {
            $('#recipe-results').addClass('hidden');
            $('#recipe-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function toggleResultsTab () {
    $('#viewTabs').click(function(event) {
        event.preventDefault();
        alert('working');

    })
};

function displayRecipes(responseJson) {
    $('#recipe-list').empty();
    if(responseJson.hits.length === 0) {
        $('#h2-tag').text('No recipes found');
    };
    for(let i = 0; i < responseJson.hits.length; i++) {
        $('#recipe-list').append(
        `<li>
        <img class="recipe-photo" src="${responseJson.hits[i].recipe.image}"><h3 class="recipe-name"><a href="${responseJson.hits[i].recipe.url}" target="_blank">${responseJson.hits[i].recipe.label}</a></h3>
      </li>`
    )};
    $('#recipe-results').removeClass('hidden');
};

function displayEvents(oData) {
    $('#events-list').empty();
    if(oData.events.event.length === 0) {
        $('#h2-tag-events').text('No events found');
    };
    for(let i = 0; i < oData.events.event.length; i++) {
        $('#events-list').append(
            `<li class="order-list"><h3 class="event-name"><a href="${oData.events.event[i].url}" target="_blank">${oData.events.event[i].title}</a></h3>
            <ul><li><strong>Date: </strong>${oData.events.event[i].start_time}</li><li><strong>Description: </strong>${oData.events.event[i].description}</li><li><strong>Location: </strong>${oData.events.event[i].venue_name} ${oData.events.event[i].venue_address}</li></ul></li>`
        )};
        // $('#events-results').removeClass('hidden');
};

function getEvents(zipCode) {
    const parameters = {
        app_key: 'gxDTZZMW4Jb5NqB6',
        keywords: 'nutrition',
        keywords: 'diet',
        l: zipCode,
        within: '50',
        units: 'mi',
        scheme: 'https',
        page_size: '20'
    };
    EVDB.API.call("/events/search", parameters, function(oData) {
        console.log(oData);
        displayEvents(oData);
      });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const recipe = $('#js-recipe-search').val();
        const health = $('#health-choices').val();
        const diet = $('#diet-choices').val();
        const exclude = $('#exclude').val();
        const zipCode = $('#zipcode').val();
        getRecipes(recipe, health, diet, exclude);
        getEvents(zipCode);
        $('#js-recipe-search').val('');
        $('#health-choices').val('');
        $('#diet-choices').val('');
        $('#exclude').val('');
        $('#zipcode').val('');
        $('#hideTabs').removeClass('hideTabs');
        toggleResultsTab();
    });
};

watchForm();