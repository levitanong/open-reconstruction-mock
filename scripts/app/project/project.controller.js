project.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.id = m.route.param("id");
  this.project = m.prop({});
  database.pull().then(function(data){
    self.project(database.projectList()[self.id - 1]);
  })

  this.isCurrentUserAuthorized = function(){
    var userPermission = process.permissions()[this.app.currentUser().department];
    return _.contains(userPermission, this.project().progress());
  }


  this.initMap = function(elem){
    if(!elem.classList.contains("leaflet-container")){
      var map = L.map(elem, {scrollWheelZoom: false}).setView([51.505, -0.09], 13);
      var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});   

      // start the map in South-East England
      map.setView(new L.LatLng(51.3, 0.7),9);
      map.addLayer(osm);

      L.tileLayer(osmUrl, {attribution: osmAttrib, maxZoom: 18}).addTo(map);
      // create the tile layer with correct attribution
    } 
  }
}