projectCreation.controller = function(){
  this.initMap = function(elem){
    var map = L.map(elem, {drawControl: true, scrollWheelZoom: false}).setView([51.505, -0.09], 13);

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});   

    // start the map in South-East England
    map.setView(new L.LatLng(51.3, 0.7),9);
    map.addLayer(osm);

    L.tileLayer(osmUrl, {attribution: osmAttrib, maxZoom: 18}).addTo(map);
  }
}
