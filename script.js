// Here is a list of cities and their latitudes and longitudes:

let listOfCities = `[
    {
        "name": "Nashville, TN",
        "latitude": 36.17,
        "longitude": -86.78
    },
    {
        "name": "New York, NY",
        "latitude": 40.71,
        "longitude": -74.00
    },
    {
        "name": "Atlanta, GA",
        "latitude": 33.75,
        "longitude": -84.39
    },
    {
        "name": "Denver, CO",
        "latitude": 39.74,
        "longitude": -104.98
    },
    {
        "name": "Seattle, WA",
        "latitude": 47.61,
        "longitude": -122.33
    },
    {
        "name": "Los Angeles, CA",
        "latitude": 34.05,
        "longitude": -118.24
    },
    {
        "name": "Memphis, TN",
        "latitude": 35.15,
        "longitude": -90.05
    }
]`;

// Create a constructor function

function ConstructorMap(str) {
    this.str = str;
}

// Create an object named CityMap

let CityMap = localStorage.getItem('newCity') ? new ConstructorMap(localStorage.getItem('newCity')) : new ConstructorMap(listOfCities);

// Create a function drawList(array) which draw a list of cities on the page

let ul  = document.querySelector('ul');

function drawList(array){
    ul.innerHTML = '';
    array.map((item) => {
        let li = document.createElement('li');
        li.textContent = `name: ${item.name}, latitude: ${item.latitude}, longitude: ${item.longitude}`;
        ul.appendChild(li);
    });
}

// Draw list of cities on the page
drawList(JSON.parse(CityMap.str));

/*
The first task
Create a method which returns the name of the northernmost, easternmost,
southernmost or westernmost city from the list, as requested by the caller
*/

CityMap.most = function(request) {
    let arrayOfLatitudesSort = JSON.parse(this.str).sort((a, b) => a.latitude - b.latitude);
    let arrayOfLongitudesSort = JSON.parse(this.str).sort((a, b) => a.longitude - b.longitude);

    if(request === 'northernmost') return arrayOfLatitudesSort[arrayOfLatitudesSort.length - 1].name;
    if(request === 'southernmost') return arrayOfLatitudesSort[0].name;

    if(request === 'easternmost') return arrayOfLongitudesSort[arrayOfLongitudesSort.length - 1].name;
    if(request === 'westernmost') return arrayOfLongitudesSort[0].name;
};

let northernmost = document.getElementById('northernmost');
let southernmost = document.getElementById('southernmost');
let easternmost = document.getElementById('easternmost');
let westernmost = document.getElementById('westernmost');

northernmost.textContent = CityMap.most('northernmost');
southernmost.textContent = CityMap.most('southernmost');
easternmost.textContent = CityMap.most('easternmost');
westernmost.textContent = CityMap.most('westernmost');

/*
The second task
Pass longitude and latitude as parameters, and return the name of the city that
is closest to that location
*/

CityMap.closest = function(longitude, latitude) {
    let result = JSON.parse(this.str).map(item => {
        return `${item.name}: ${6371 * Math.acos(Math.sin(item.latitude)*Math.sin(latitude) +
        Math.cos(item.latitude)*Math.cos(latitude)*Math.cos(item.longitude - longitude))}`;
    }).sort((a, b) => a.split(': ')[1] - b.split(': ')[1]);
    return result[0].split(': ')[0].split(', ')[0];
};

let formLatitudeLongitude = document.forms.latitude_longitude;
let inputAnyLatitude = document.getElementById('any_latitude');
let inputAnyLongitude = document.getElementById('any_longitude');
let closest = document.getElementById('closest');

formLatitudeLongitude.addEventListener('submit', (e) => {
    e.preventDefault();
    let latitude = parseFloat(inputAnyLatitude.value);
    let longitude = parseFloat(inputAnyLongitude.value);
    closest.textContent = CityMap.closest(latitude, longitude);
    formLatitudeLongitude.reset();
});

/*
The third task
Return a single string containing just the state abbreviations from the list of cities, each
separated by a space. The method should eliminate duplicate states. The result string
should not have leading or trailing spaces
*/

CityMap.stateAbbreviations = function() {
    return [...new Set(JSON.parse(this.str).map(item => item.name.split(', ')[1]))].join(' ').trim();
};

let abbreviation = document.getElementById('abbreviation');
abbreviation.textContent = CityMap.stateAbbreviations();


/*
The forth task
Add an ability to search by states (show list of cities of the state)
*/

CityMap.searchByState = function(state) {
    state = state.toLowerCase();
    let result = JSON.parse(this.str)
                    .map(item => item.name)
                    .filter(item => item.split(', ')[1].toLowerCase().includes(state))
                    .map(item => item.split(', ')[0]);
    return result.length ? result.join(', ') : `There are no cities of state ${state.toUpperCase()} in current list`;
};

let searchState = document.getElementById('search_state');
let cityByState = document.getElementById('city_by_state');

searchState.addEventListener('change', () => {
    cityByState.textContent = CityMap.searchByState(searchState.value);
    searchState.value = '';
});

/*
The fifth task
Create a tool to add cities with coordinates and states manually on the UI

The sixth task
Add a possibility to save the list of cities in a localStorage and pull
it in common list automatically after page reload
*/

CityMap.add = function(data) {
    let listOfCitiesArray = JSON.parse(this.str);
    listOfCitiesArray.push(data);
    this.str = JSON.stringify(listOfCitiesArray);
    localStorage.setItem('newCity', this.str);
};

let formNewCity = document.forms.new_city;
let inputCityName = document.getElementById('city_name');
let inputStateName = document.getElementById('state_name');
let inputLatitude = document.getElementById('latitude');
let inputLongitude = document.getElementById('longitude');

formNewCity.addEventListener('submit', (e) => {
    e.preventDefault();
    let newCity = {};
    newCity.name = `${inputCityName.value}, ${inputStateName.value.toUpperCase()}`;
    newCity.latitude = parseFloat(inputLatitude.value);
    newCity.longitude = parseFloat(inputLongitude.value);
    CityMap.add(newCity);
    formNewCity.reset();
    drawList(JSON.parse(CityMap.str)); // redraw the list of cities on the page after forn submitting
});


/*
The seventh task
you can do a visualization with d3 chart
(​ https://www.d3-graph-gallery.com/graph/pie_basic.html​ )
You can copy a solution from that link and apply it to your project.
*/

// Create a function basicPieChart(data)

// set the dimensions and margins of the graph
let width = 450,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
let radius = Math.min(width, height) / 2 - margin;

// append the svg object to the div called 'my_dataviz'
let svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

function basicPieChart(data) {

    // set the color scale
    let color = d3.scaleOrdinal()
        .domain(data)
        .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    let pie = d3.pie()
        .value(function(d) {return d.value; });
    let data_ready = pie(d3.entries(data));
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    let arcGenerator = d3.arc()
        .innerRadius(40)
        .outerRadius(radius);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d){ return d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 12);
}

// Create a function createData(array)

function createData(array) {
    let data = {};
    array.map(item => {
        data[`${item.name}`] = item.latitude;
    });
    return data;
}

// Create data

let data = createData(JSON.parse(CityMap.str));

// Draw basic pie chart

basicPieChart(data);












