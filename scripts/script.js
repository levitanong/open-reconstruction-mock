

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
  date: function(backThen){
    if(typeof(backThen) == "undefined"){
      var backThen = new Date('January 1, 2013');
    }
    var now = new Date(Date.now());
    return new Date(now - Math.round((now - backThen) * Math.random()));
  },
  amount: function(){
    return Math.round(Math.random() * 100) * 100000;
  },
  fromArray: function(arr){
    var n = Math.random() * (arr.length - 1);
    var index = Math.round(n);
    return arr[index];
  }
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
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}

recon.Projects = function(){
  this.genProject = function(){
   return new recon.Project({
    date: rand.date(),
    level: 1,
    isRejected: false,
    // disaster: {
    //   type: self.genFromArray(types.disaster),
    //   name: self.genFromArray(types['disaster names']),
    //   date: new Date(Date.now()),
    //   cause: null
    // },
    // author: users.list.filter(function(user){return user.level == 0})[0],
    // implementingAgency: null,
    // project: {
    //   type: self.genFromArray(types.project),
    //   description: self.genFromArray(types.description),
    //   amount: self.genAmount()
    // },
    // location: users.current.address,
    // remarks: null,
    // history: [],
    // attachments: genArray(self.genInt(1, 6))
   })
  }
  this.genProjects = function(qty){
    var list = [];
    for(var i = 0; i < qty; i++){
      list.push(this.genProject());
    }
    return list;
  }
}

////////////////////////////////////////////////////
// Controller

recon.controller = function(){
  var Users = new recon.Users();
  var Projects = new recon.Projects();
  var self = this;
  this.list = Users.genUsers();
  this.projectList = this.list.then(function(){
    return Projects.genProjects(50);
  });
  // this.projectList.then(function(){console.log(self.projectList())})
}

////////////////////////////////////////////////////
// View

recon.view = function(ctrl){
  return m("html", [
    m("body", [
      m("div", [
        m("ul"),[
          ctrl.list().map(function(user){
            console.log(ctrl.projectList());
            return m("li", [
              user.getName(),
              user.level(),
              ctrl.projectList().map(function(p){
                return m("span", [p.date()]);
              })
            ])
          })
        ]])
      ])
    ])
}

////////////////////////////////////////////////////
// Execution
m.module(document, recon);


