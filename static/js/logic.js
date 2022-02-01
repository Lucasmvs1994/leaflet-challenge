//dataset used: Past 7 Days -> All Earthquaes (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson)


var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


d3.json(earthquakeUrl).then(function (data) {

    createMap(data.features);

  });


function markerSize(magnitude) {

    return magnitude * 5;

};

function markerColor(depth) {

    if (depth <= 10) {
        return "rgb(255, 234, 209)"
    } else if (depth <= 30) {
        return "rgb(250, 213, 170)"
    } else if (depth <= 50) {
        return "rgb(250, 171, 77)"
    } else if (depth <= 70) {
        return "rgb(237, 131, 5)"
    } else if (depth <= 90) {
        return "rgb(181, 100, 4)"
    } else {
        return "rgb(115, 63, 2)"
    }
};


function createMap (earthquakeData)

{

    var myMap = L.map("map", {

        center: [
            40.00, -100.00
        ],
        zoom: 4,

    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
     {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

    }).addTo(myMap);



    L.geoJSON(earthquakeData, {

        pointToLayer: function circleLayer(features, latlng) {

            return L.circleMarker(latlng, {
                radius: markerSize(features.properties.mag),
                fillColor: markerColor(features.geometry.coordinates[2]),
                color: "grey",
                weight: 0.9,
                opacity: 0.6,
                fillOpacity: 0.9
        
            });
        
        },

        onEachFeature: onEachFeature



    }).addTo(myMap);


    function onEachFeature(feature, layer) {
        
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3>

        <hr><p><strong>Place: </strong>${feature.properties.place}<br>

        <strong>Time: </strong>${new Date(feature.properties.time)}<br>

        <strong>Depth: </strong>${feature.geometry.coordinates[2]}</p>`);
        
        };



    var legends_context = L.control({position: "bottomright"});

    legends_context.onAdd = function() {

        var legend_div = L.DomUtil.create("div", "info legend");

        var depths = [-10, 10, 30, 50, 70, 90];

        var labels = [];
        
        var legend_Data = "<h4> Depth of the earthquake by color </h4>";

        legend_div.innerHTML = legend_Data;

      
        for (var i = 0; i < depths.length; i++) {
            
            labels.push('<li style="background-color:' + markerColor(depths[i] + 1) + '"> <span>' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '' : '+') + '</span></li>');
        }

        legend_div.innerHTML += "<ul>" + labels.join("") + "</ul>";

        return legend_div;
    };


    legends_context.addTo(myMap);


};
