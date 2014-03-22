// below to be deprecated when mithril comes out with new release. Also remove config:publicAPI from genUsers request.
var publicAPI = function(xhr){
  xhr.withCredentials = false;
}
var genArray = function($from, $to){
  var list = [];
  if($from < $to){
    for(var i = $from; i < $to; i++){
      list.push(i);
    }
  } else {
    // $from >= $to
    for (var i = $from; i > $to; i--){
      list.push(i);
    }
  }
  return list;
}

var recon = {};
var rand = {};
var user = {
  // model
  User: function(data){
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
  },

  // controller
  controller: function(){
    var self = this;
    this.current = new user.User();
    this.list = [];
    this.getName = function(user){
      if(typeof(user.name) == "undefined"){
        return "Guest";
      } else {
        return user.name().first + " " + user.name().last;
      }
    };
    this.genUsers = function(){
      return m.request({
        method: "GET", 
        url: "http://api.randomuser.me/?results=5",
        config: publicAPI
      }).then(function(data){
        return data.results.map(function(r, index){
          r.user.level = index;
          self.list.push(new user.User(r.user));
        });
      });
    };
    this.logIn = function(user){
      this.current = user;
    };
    this.logOut = function(){
      this.current = new user.User();
    };
  }
};

var project = {
  Project: function(data, user){
    for(prop in data){
      this[prop] = m.prop(data[prop]);
    }
    this.author = user;
  },
  controller: function(){
    this.list = [];
    this.genProjects = function(qty, users){
      var tempList = [];
      var creator = _.chain(users)
      .filter(function(u){
        // or basically anyone who can request for projects
        return u.level == 0;
      })
      .sample(1)
      .value()

      this.list = genArray(0, qty).map(function(i){
        return new project.Project({
          date: rand.date(),
          level: 1,
          isRejected: false,
          amount: 0,
          description: rand.fromArray(sample.description),
          type: rand.fromArray(sample.projectType),
          disaster: {
            type: rand.fromArray(sample.disaster),
            name: rand.fromArray(sample['disaster names'])
          },
          implementingAgency: null,
          location: creator.address,
          remarks: '',
          history: [],
          attachments: genArray(rand.int(1, 6))
        }, creator);
      });
    };
  }
}

////////////////////////////////////////////////////
// Helpers

var sample = {
  'disaster names': ['Brunhilda', 'Bantay', 'Muning', 'Dodong', 'Puring'],
  'disaster': ['Earthquake', 'Flood', 'Typhoon', 'Landslide', 'Anthropogenic'],
  'projectType': ['Infrastructure', 'Agriculture', 'School Building', 'Health Facilities', 'Shelter Units', 'Environment', 'Other'],
  'description': [
    'Adamantium reinforcement for nipa huts.',
    'These equipments, you know. I need them.',
    'Very very urgent, we ran out of soft drinks! Help!',
    'We want to hire Michael Jackson to dance for residents of disaster-afflicted areas',
    'Request for funding to dispatch search and rescue team for missing local domesticated feline',
    'Our bridge is missing, can you help us buy another one?'
  ],
  'comment': [
    'Please attach two photocopies of Form R311-78a.9v8 (1983)',
    'This is a wonderful idea, we should double their budget and give them cake.',
    'Can I promise to do this if they vote for me?'
  ],
  'revision': [null, 0.85, 0.70, 0.65, 0.50, 0.35, 0.2],
  'region': ["Region 1", "Region 2", "Region 3", "Region 4", "Region 5", "Region 6", "Region 7", "Region 8", "Region 9", "Region 10", "Region 11", "Region 12", "Region 13", 'ARMM', 'NCR', 'CAR']
};

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

recon.Calamity = function(data){
  for(prop in data){
    this[prop] = m.prop(data[prop]);
  }
}

// recon.Action = function(data){
//   for(prop in data){
//     this[prop] = m.prop(data[prop]);
//   }
// }

// recon.Project = function(data){
//   for(prop in data){
//     this[prop] = m.prop(data[prop]);
//   }
// }

// recon.Projects = function(){
//   this.genProject = function(){
//     return new recon.Project({
//       date: rand.date(),
//       level: 1,
//       isRejected: false,
//       amount: 0,
//       description: rand.fromArray(sample.description),
//       type: rand.fromArray(sample.projectType),
//       // disaster: {
//       //   type: self.genFromArray(types.disaster),
//       //   name: self.genFromArray(types['disaster names']),
//       //   date: new Date(Date.now()),
//       //   cause: null
//       // },
//       // author: users.list.filter(function(user){return user.level == 0})[0],
//       // implementingAgency: null,
//       // location: users.current.address,
//       // remarks: null,
//       // history: [],
//       // attachments: genArray(self.genInt(1, 6))
//     })
//   }
//   this.genProjects = function(qty){
//     var list = [];
//     for(var i = 0; i < qty; i++){
//       list.push(this.genProject());
//     }
//     return list;
//   }
// }

////////////////////////////////////////////////////
// Controller

recon.controller = function(){
  var self = this;
  self.Users = new user.controller();
  self.Projects = new project.controller();

  self.Users.genUsers()
  .then(function(){
    self.Projects.genProjects(50);
  });
}

////////////////////////////////////////////////////
// View

recon.view = function(ctrl){
  // nav bar
  var nav = function(){

    var menuItems = [
      {label: "Overview", url: "#"},
      {label: "Projects", url: "#"}
    ]

    var menuItem = function(data){
      if(!data.url) data.url = "#";
      return m("li", [m("a", {href: data.url}, data.label)]);
    }

    return m("nav.top-bar[data-topbar]", [
      m("ul.title-area", [
        m("li.name", [
          m("h1", [
            m("a[href='#']", "Open Reconstruction")
          ])
        ])
      ]),
      m("section.top-bar-section", [
        m("ul.left", [
          menuItems.map(menuItem)
        ]),
        m("ul.right", [
          menuItem({label: "Generate Sample Data"}),
          m("li.has-dropdown.not-click", [
            m("a[href='#']", [
              (function(){
                console.log(ctrl.Users.current);
                if(ctrl.Users.current.picture){
                  return m("img.portrait.sml", {src: ctrl.Users.current.picture()});
                } else {
                  return "";
                }
              })(),
              ctrl.Users.getName(ctrl.Users.current)
            ]),
            m("ul.dropdown", [
              ctrl.Users.list.map(function(user){
                return m("li", [
                  m("a",{onclick: ctrl.Users.logIn.bind(ctrl.Users, user)}, "Login as " + ctrl.Users.getName(user))
                ])
              }),
              m("li", [
                m("a", {onclick:ctrl.Users.logOut.bind(ctrl)}, "Logout")
              ])
            ])
          ])
        ])
      ])
    ]);
  }

  // main
  return m("html", [
    m("head", [
      m("link[href='styles/css/style.css'][rel='stylesheet']")
    ]),
    m("body", [
      nav(),
      m("div", [
        m("ul"),[
          ctrl.Projects.list.map(function(project){
            return m("li", [
              project.description()
              // m("button", {onclick: function(){ctrl.Users.create()}},"hi")
            ])
          }),
        ]])
      ])
    ])
}

////////////////////////////////////////////////////
// Execution
m.module(document, recon);


