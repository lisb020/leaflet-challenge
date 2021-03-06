// JSON file for earthquakes
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

  
// Perform an API call to the earthquake API to get info. Call createMarkers when complete
d3.json(url, createMarkers);

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
      "Earth Quakes": earthQuakes
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
      let earthQuakeMarker = L.marker([coord.geometry.coordinates[1], coord.geometry.coordinates[0]])
        .bindPopup("<h3>" + coord.properties.place + "</h3><hr><p>" + new Date(coord.properties.time) + "</p>");
  
      // Add the marker to the earthQuakeMarkers array
      earthQuakeMarkers.push(earthQuakeMarker);
    }
    console.log(earthQuakeMarkers);
    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(earthQuakeMarkers));
  }
  
