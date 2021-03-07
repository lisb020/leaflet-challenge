// JSON file for earthquakes
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

  
// Perform an API call to the earthquake API to get info. Call createMarkers when complete
d3.json(url, createMarkers);

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude*70000;
}

// Function to determine marker color based on depth
function markerColor(depth) {
  if (depth >= 90){
    color = "Red"
  }
  else if (depth >= 70 && depth < 90){
    color = "DarkOrange"
  }
  else if (depth >= 50 && depth < 70){
    color = "Orange"
  }
  else if (depth >= 30 && depth < 50){
    color = "Yellow"
  }
  else if (depth >= 10 && depth < 30){
    color = "YellowGreen"
  }
  else{
    color = "Green"
  }
  return color;
}

function createMap(earthQuakes) {

    // Create the tile layer that will be the background of our map
    let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });
  
    // Create a baseMaps object to hold the lightmap layer
    const baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the earthQuakes layer
    const overlayMaps = {
      "Earthquakes": earthQuakes
     };
  
    // Create the map object with options
    var map = L.map("map", {
        center: [0, 0],
        zoom: 2,
        layers: [streetmap, earthQuakes]
      });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

      // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ["-10-10", "10-30","30-50","50-70","70-90","90+"];
      var colors = ["Green", "YellowGreen", "Yellow", "Orange", "DarkOrange", "Red"];
      var labels = [];

    // Add min & max
    var legendInfo = "<h3>Earthquake Depth</h3>" //+

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<tr><td class=boxcolor style=\"background-color: " + colors[index] + "\"></td><td>" +limits[index]+ "</td></tr>");
    });

    div.innerHTML += "<table>" + labels.join("") + "</table>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(map);
  }
  
  function createMarkers(response) {
    // Pull the "geometry" property off of response.features
    let coords = response.features;
   
    // Initialize an array to hold coordinates
    let earthQuakeMarkers = [];
  
    // Loop through the earthquake array
    for (let index = 0; index < coords.length; index++) {
      let coord = coords[index];
    
      // For each earthquake, create a marker and bind a popup with the earthquake's place and time
      let earthQuakeMarker = L.circle([coord.geometry.coordinates[1], coord.geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        fillColor: markerColor(coord.geometry.coordinates[2]),
        radius: markerSize(coord.properties.mag)
      })
        .bindPopup("<h3>" + coord.properties.place + "</h3><hr><div>" 
          + new Date(coord.properties.time) + "</div><br><div> Magnitude: " 
          + coord.properties.mag + "</div><br><div> Depth: "
          + coord.geometry.coordinates[2] + "</div>");
  
      // Add the marker to the earthQuakeMarkers array
      earthQuakeMarkers.push(earthQuakeMarker);
    }

    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(earthQuakeMarkers));
  }
  
