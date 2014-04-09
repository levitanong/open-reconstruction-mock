projectCreation.controller = function(){
  this.app = new app.controller();
  this.projectType = m.prop("Road");
  this.scopeOfWork = m.prop("Reconstruction");
  this.initMap = function(elem){
    if(!elem.children.length){
      this.app.initMap(elem, {drawControl: true, scrollWheelZoom: false});
    }
  }.bind(this);
  database.pull();
}
