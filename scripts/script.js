

var recon = {};
var rand = {};

// below to be deprecated when mithril comes out with new release. Also remove config:publicAPI from genUsers request.
var publicAPI = function(xhr){
  xhr.withCredentials = false;
}

////////////////////////////////////////////////////
// Helpers

var rand = {
  int: function(lower, upper){
    if(typeof(upper) == 'undefined'){
      // catches for when only one argument is added, meant for upper.
      upper = lower;
      lower = 0
    }
    return Math.round(Math.random() * (upper - lower)) + lower;
  },
}

////////////////////////////////////////////////////
// Model

recon.User = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
  this.address = m.prop({
    district: null,
    department: null,
    region: 8,
    province: 'Western Samar',
    city: null,
    town: 'Daram',
    barangay: null,
    sitio: null
  });
  this.getName = function(){
    return this.name().first + " " + this.name().last
  }
}

recon.Users = function(){
  this.genUsers = function(){
    return m.request({
      method: "GET", 
      url: "http://api.randomuser.me/?results=5",
      config: publicAPI
    }).then(function(data){
      return data.results.map(function(r, index){
        r.user.level = index;
        return new recon.User(r.user);
      });
    });
  }
};

recon.Project = function(data){

}

////////////////////////////////////////////////////
// Controller

recon.controller = function(){
  var Users = new recon.Users();
  this.list = Users.genUsers();
}

////////////////////////////////////////////////////
// View

recon.view = function(ctrl){
  return m("html", [
    m("body", [
      m("div", [
        m("ul"),[
          ctrl.list().map(function(user){
            return m("li", [
              user.getName(),
              user.level()
            ])
          })
        ]])
      ])
    ])
}

////////////////////////////////////////////////////
// Execution
m.module(document, recon);


