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
    var map = L.map(elem, config).setView([11.3333, 123.0167], 5);

    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 5, maxZoom: 19, attribution: osmAttrib});   
    map.addLayer(osm);
  };
  this.db = {};
  this.db.clear = function(){
    localStorage.clear();
  };
}