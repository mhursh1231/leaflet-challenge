// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicplatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Perform a GET request to the query URL
d3.json(queryURL).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

// Function to determine the marker color by depth
function chooseColor(depth) {
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "#FF0000";
}

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        // Point to the layer used to alter the markers
        pointToLayer: function (feature, latlng) {

            // Determine the style of markers used on properties
            let markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.5
            };
            return L.circleMarker(latlng, markers);
        }
    });

    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create tile layers
    let satellite = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        style: 'mapbox/satellite-v9',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
    });

    let grayScale = L.tileLayer(// What code goes here?, {
        attribution: // What code goes here? ,
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1, 
    });

let outdoors = L.tileLayer
// What code goes here?


// Create layer for tectonic plates
tectonicPlates = new L.layerGroup();

// Perform a GET request to the query URL
d3.json(tectonicplatesURL).then(function (plates) {

    // Console log retrieved data
    console.log(plates);
    L.geoJSON(plates {
        color: "orange",
        weight: 2
    }).addTo(tectonicPlates);
});

// Create a baseMaps object
let baseMaps = {
    "Satellite": satellite,
    "Grayscale": grayscale,
    "Outdoors": outdoors
};

// Create an overlay object
let overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
};

// Create myMap with layers
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [satellite, earthquakes, tectonicplates]
});

// Add legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depthRanges = ["0-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

    for (let i = 0; i < depthRanges.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(getDepth(depthRanges[i])) + '"></i> ' + depthRanges[i] + '<br>';
    }
    return div;
};
legend.addTo(myMap);

// Add the layer control to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);
}