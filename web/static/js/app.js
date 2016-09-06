// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

let channel = socket.channel("places:lobby", {})
channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp); initMap(); })
    .receive("error", resp => { console.log("Unable to join", resp) })


var poly;
var map;
var paths;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 29.3483287977, lng: 110.5488580513 }
  });

  paths = []
  poly = new google.maps.Polyline({
    path: paths,
    geodesic: true,
    strokeColor: '#0074D9',
    strokeOpacity: 0.7,
    strokeWeight: 5
  });

  poly.setMap(map);
}

var locationSymbol = {
  path: google.maps.SymbolPath.CIRCLE,
  scale: 5,
  strokeColor: '#393'
};

function updatePlace(place) {
  poly.setMap(null);
  console.log(place);
  paths.push({lat: place.lat, lng: place.lon});
  if(paths.length > 5) {
    paths = paths.slice(Math.max(paths.length - 5, 1))
  }

  poly = new google.maps.Polyline({
    path: paths,
    geodesic: true,
    strokeColor: '#0074D9',
    strokeOpacity: 0.7,
    strokeWeight: 5,
    icons: [{icon: locationSymbol}]
  });

  poly.setMap(map);
}

channel.on("update_place", place => updatePlace(place))
