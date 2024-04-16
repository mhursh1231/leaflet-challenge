// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

// Function to determine the marker size
function markerSize(magnitude) {
    return magnitude * 5; // Adjusted the multiplier for better visualization
}

// Function to determine marker color by depth
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
    let grayScale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
    });

    // Create myMap, giving it the grayScale map and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [grayScale, earthquakes]
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

    // Adding the legend styles
    let legendStyle = document.createElement('style');
    legendStyle.innerHTML = `
        .info.legend {
            background-color: white;
            padding: 10px;
            border: 1px solid black;
            font: 12px/14px Arial, sans-serif;
        }
        .info.legend i {
            width: 18px;
            height: 18px;
            float: left;
            margin-right: 8px;
            opacity: 0.7;
        }
        .info.legend br {
            clear: both;
        }
    `;
    document.getElementsByTagName('head')[0].appendChild(legendStyle);
};

// Function to get the average depth from depth ranges
function getDepth(depthRange) {
    let depths = depthRange.split("-");
    let minDepth = parseInt(depths[0]);
    let maxDepth = parseInt(depths[1]);
    return (minDepth + maxDepth) / 2;
}
