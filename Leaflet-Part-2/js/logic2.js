// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicplatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,  <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

// Establishing variables
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
});
basemap.addTo(myMap)

let tectonicplates = new L.layerGroup();
let earthquakes = new L.LayerGroup();

let baseMaps = {
    "Global Earthquakes": basemap
};

let overlays = {
    "Tectonic Plates": tectonicplates,
    Earthquakes : earthquakes
};

L.control.layers(baseMaps, overlays).addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    function styleInfo(feature) {
        return {
            opacity : 1,
            fillOpacity:1,
            fillColor:chooseColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight:0.5
        };
    }
// Selecting colors for markers
function chooseColor(depth){
    switch(true){
        case depth > 90:
            return "#ea2c2c";
        case depth > 70:
            return "#ea822c";
        case depth > 50:
            return "#ee9200";
        case depth > 30:
            return "#eecc00";
        case depth > 10:
            return "#d4ee00";
        default:
            return "#98ee00";
    }
}
// How to get marker size and styles
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude *4
}
L.geoJson(data, {
    pointToLayer: function (feature,latlng){
        return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer){
        layer.bindPopup(
            "Magnitude:"
            +feature.properties.mag
            +"<br> Depth: "
            +feature.geometry.coordinates[2]
            +"<br>Location: "
            +feature.properties.place
        ); 
    }
}).addTo(earthquakes);

// Add earthquakes to myMap
earthquakes.addTo(myMap);
let legend = L.control({
    position:"bottomright"
});

// Adding the legend and legend styles
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70 , 90];
    let colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i>" +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
};
legend.addTo(myMap)
});

// Loading tectonic plates on myMap
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(platedata){
    L.geoJson(platedata, {
        color: "orange",
        weight: 2
    })
    .addTo(tectonicplates);
    tectonicplates.addTo(myMap);
});
