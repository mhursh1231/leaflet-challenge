// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // Console lo the data retrieved
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

// Function to determine the marker size
function markerSize(magnitude) {
    return magnitude * 2000;
};

// Function to determine marker color by depth
function chooseColor(depth){
    switch (depth) {
        case (depth < 10): return "#00FF00";
        case (depth < 30): return "greenyellow";
        case (depth < 50): return "yellow";
        case (depth < 70): return "orange";
        case (depth < 90): return "orangered";
        default: return "#FF0000";
    }
}
function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature functin once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        // Point to the layer used to alter the markers
        pointToLayer: function(feature, latlng){

            // Determine the style of markers used on properties
            let markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.5
            }
            return L.circle(latlng, markers);
        }
    });

    // Send our earthquakes layer to the createMap function
    createImageBitmap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.

}
