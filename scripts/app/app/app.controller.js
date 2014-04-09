app.controller = function(){
  this.currentUser = app.currentUser;
  this.isLoggedIn = function(){
    if(this.currentUser().constructor === user.GUEST){
      return false;
    } else {
      return true;
    }
  };
  this.logout = function(){
    this.currentUser(new user.GUEST());
  }
  this.authorizedUsers = function(){
    return database.userList().filter(function(user){
      return user.department === "NDRRMC";
    });
  };
  this.initMap = function(elem, config){
    var map = L.map(elem, config).setView([11.3333, 123.0167], 9);

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});   

    // start the map in South-East England
    // map.setView(new L.LatLng(51.3, 0.7),9);
    map.addLayer(osm);

    L.tileLayer(osmUrl, {attribution: osmAttrib, maxZoom: 18}).addTo(map);
  };
  this.db = {};
  this.db.clear = function(){
    localStorage.clear();
  };
}