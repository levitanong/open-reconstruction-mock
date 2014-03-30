// ////////////////////////////////////////////////////
// // Helpers

// var genArray = function($from, $to){
//   var list = [];
//   if($from < $to){
//     for(var i = $from; i < $to; i++){
//       list.push(i);
//     }
//   } else {
//     // $from >= $to
//     for (var i = $from; i > $to; i--){
//       list.push(i);
//     }
//   }
//   return list;
// }

// var rand = {
//   int: function(lower, upper){
//     if(typeof(upper) == 'undefined'){
//       // catches for when only one argument is added, meant for upper.
//       upper = lower;
//       lower = 0
//     }
//     return Math.round(Math.random() * (upper - lower)) + lower;
//   },
//   date: function(backThen){
//     if(typeof(backThen) == "undefined"){
//       var backThen = new Date('January 1, 2013');
//     }
//     var now = new Date(Date.now());
//     return new Date(now - Math.round((now - backThen) * Math.random()));
//   },
//   amount: function(){
//     return Math.round(Math.random() * 100) * 100000;
//   },
//   fromArray: function(arr){
//     return _.sample(arr, 1)[0]
//     // var n = Math.random() * (arr.length - 1);
//     // var index = Math.round(n);
//     // return arr[index];
//   }
// }

var helper = {
  truncate: function(input, place){
    var out = "";
    var buffer;
    var suffix = "";

    if(typeof(place) == "undefined"){
      var place = 2;
    }

    var placeCheck = function(val, place){
      if(typeof(place) == "undefined") place = 1;
      if(val / 1000 < 1){
        // this means val cannot be divided by 1000 anymore
        return [val, place];
      } else {
        // val can still be divided by 1000. placeCheck again.
        return placeCheck(val / 1000, place * 1000);
      }
    }

    buffer = placeCheck(input);

    switch(buffer[1]){
      case Math.pow(10, 3):
        suffix = "K";
        break;
      case Math.pow(10, 6):
        suffix = "M";
        break;
      case Math.pow(10, 9):
        suffix = "B";
        break;
      case Math.pow(10, 12):
        suffix = "T";
        break;
      default:
        suffix = "";
        break;
    }

    var roundTo = function(num, place){
      var p = Math.pow(10, place);
      return Math.round(num * p) / p;
    }
    out = roundTo(buffer[0], place) + " " + suffix;
    return out;
  },
  commaize: function(number){
    if(!number){return "";}

    var process = function(acc, arr){
      if (acc.length < 1){
        return arr;
      } else {
        arr.push(acc.substr(-3));
        return process(acc.substr(0, acc.length-3), arr);
      }
    }
    return process(number + "", []).reduceRight(function(acc, head){
      if(acc == ""){
        return head + "";
      } else {
        return acc + "," + head;
      }
    }, "");
  }
}

////////////////////////////////////////////////////
// fake database

var dictio = {};
dictio.disasters = m.prop({
  "T": "Typhoon"
});

var database = {
  projectList: m.prop([]),
  userList: m.prop([]),
  projectFilters: m.prop([]),
}

var dataPull = function(){
  return m.request({
    method: "GET",
    url: "data/CF14-RQST-Sanitized.csv",
    deserialize: function(data){
      return csv2json.csv.parse(data, function(d, i){
        // console.log(d);

        var author = {};
        var location = {};
        var disaster = {};
        var errors = [];

        // parse location
        location = {
          sitio: d.SITIO,
          town: d.TOWN,
          province: d.PROVINCE,
          barangay: d.BARANGAY,
          city: d.CITY,
          region: "REGION "+d.REG,
          "class": d.CLASS
        };

        // parse author
        switch(d.CODE){
          case "LGU":
            author = new user.LGU(d["REQUESTING PARTY"], location)
            break;
          case "NGA":
            author = new user.NGA(d["REQUESTING PARTY"], d.DEPT)
            break;
        }
        // add user to database while checking for uniqueness
        if(!database.userList().filter(function(u){return u.name === author.name}).length){
          database.userList(database.userList().concat(author));
        }

        // parse disaster
        var disasterStringArray = d["TYPE OF DISASTER"].split(" ");
        disaster = {
          name: disasterStringArray[1],
          type: dictio.disasters()[disasterStringArray[0]],
          date: new Date(_.rest(disasterStringArray, 3).reduce(function(a, b){
            if (!a){
              return b
            } else {
              return a + " " + b
            }
          }, "")),
          cause: null
        }


        // error tracking
        if(_.isEmpty(location)){
          errors.push("Unspecified Location")
        }
        if(!d["AMT_REQD"]){
          errors.push("No Amount");
        }
        if(d["NO OF PROJECTS"] > 1){
          errors.push("Multiple Projects");
        }
        if(!d["TYPE OF DISASTER"]){
          errors.push("Unspecified Disaster");
        } else if(!dictio.disasters()[disasterStringArray[0]]){
          errors.push("Unrecognized Disaster Type");
        }
        
        var p = {
          errors: errors,
          date: new Date(d.DATE_REQD),
          id: i+1,
          progress: 10,
          isRejected: false,
          disaster: disaster,
          author: author,
          location: location,
          implementingAgency: d["RECEIPIENT"],
          type: d["PURPOSE1"],
          description: d["PURPOSE"],
          amount: parseInt(d["AMT_REQD"]),
          remarks: d["REMARKS"],
          history: [],
          attachments: []
        }
        return new project.Project(p);
      });
    }
  }).then(function(data){
    database.projectList(data);
    var pFilters = _.chain(database.projectList())
      .map(function(p){
        return p.type();
      })
      .unique()
      .compact()
      .value();
    database.projectFilters(pFilters);
  });
}

////////////////////////////////////////////////////
// namespace

var recon = {};
var navMenu = {};
var common = {};

var process = {};

process.steps = m.prop({
  5: { // user makes request.
    pending: "requesting",
    completed: "requested",
    label: "request"
  }, 
  10: { // assign to appropriate validating agency.
    pending: "sorting",
    completed: "sorted",
    label: "sort"
  }, 
  20: { // validating agency checks to see if request is valid. i.e. did shit really happen?
    pending: "confirming",
    completed: "confirmed",
    label: "confirmation"
  }, 
  30: { // go see what should be done (maybe should be merged with validating/confirmation)
    pending: "assessing",
    completed: "assessed",
    label: "assessment"
  },
  40: { // this is what should be done
    pending: "recommending",
    completed: "recommended",
    label: "recommendation"
  },
  50: {  // okay, do it.
    pending: "approving",
    completed: "approved",
    label: "approval"
  },
  60: { // here's the money you're allowed to spend to do it.
    pending: "allocating",
    completed: "allocated",
    label: "allocation"
  }
});

process.permissions = m.prop({
  "LGU": [5],
  "GOCC": [5],
  "NGA": [5], // clarify with stella
  "NDRRMC": [10, 40],
  "DPWH": [20, 30],
  "DBM": [10, 40, 60],
  "OP": [50]
});

var user = {
  // model
  LGU: function(name, address){
    this.name = name;
    this.address = address;
  },
  NGA: function(name, department){
    this.name = name;
    this.department = department;
  }
}

var project = {
  list: [],
  Project: function(data){
    for(prop in data){
      this[prop] = m.prop(data[prop]);
    }
  },
  controller: function(){
    // this.getProjects = function(){
    //   // console.log(project.Project.list);
    //   return project.Project.list;
    // }
  }
}

////////////////////////////////////////////////////
// Controller

navMenu.controller = function(){
  var self = this;
  self.Users = new user.controller();
  // self.Projects = new project.controller();

  // self.Users.genUsers()
  // .then(function(){
  //   self.Projects.genProjects(50);
  // });
}

////////////////////////////////////////////////////
// View


common.banner = function(text){
  return m("section.banner", [
    m("div", {class:"row"}, [
      // 
      m("div", {class: "columns medium-12"}, [
        m("h1", text)
      ])
    ])
  ]);
}

common.formSection = function(icon, content, help, i){
  var alternate = function(i){
    if(i % 2 == 1){
      return "alt";
    } else {
      return "";
    }
  }
  return m("section", {"class": alternate(i)}, [
    m("div.row", [
      m("div.columns.medium-2", [
        m("i.fa.fa-5x.fa-fw", {"class": icon})
      ]),
      m("div.columns.medium-7", content),
      m("div.columns.medium-3", [m("p", help)])
    ])
  ])
}

common.navBar = function(ctrl){
  var nav = function(){

    var menuItems = [
      {label: "Overview", url: "/dashboard"},
      {label: "Projects", url: "/projects"}
    ]

    var menuItem = function(data){
      if(!data.url) data.url = "#";
      return m("li", [m("a", {href: data.url, config: m.route}, data.label)]);
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
        // m("ul.right", [
        //   menuItem({label: "Generate Sample Data"}),
        //   m("li.has-dropdown.not-click", [
        //     m("a[href='#']", [
        //       (function(){
        //         if(ctrl.Users.current.picture){
        //           return m("img.portrait.sml", {src: ctrl.Users.current.picture()});
        //         } else {
        //           return "";
        //         }
        //       })(),
        //       ctrl.Users.getName(ctrl.Users.current)
        //     ]),
        //     m("ul.dropdown", [
        //       ctrl.Users.list.map(function(user){
        //         return m("li", [
        //           m("a",{onclick: ctrl.Users.logIn.bind(ctrl.Users, user)}, "Login as " + ctrl.Users.getName(user))
        //         ])
        //       }),
        //       m("li", [
        //         m("a", {onclick:ctrl.Users.logOut.bind(ctrl)}, "Logout")
        //       ])
        //     ])
        //   ])
        // ])
      ])
    ]);
  }
  return nav();
}

common.main = function(ctrl, template, attrObj){
  var attrs = {class: ""};
  if(attrObj){
    attrs = attrObj;
  }
  return m("html", [
    m("head", [
      m("link[href='styles/css/style.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='//fonts.googleapis.com/css?family=Roboto+Condensed:400,300,700'][rel='stylesheet'][type='text/css']"),
      m("link[href='bower_components/font-awesome/css/font-awesome.min.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='bower_components/leaflet/leaflet.css'][rel='stylesheet'][type='text/css']"),
      m("link[href='bower_components/leaflet-draw/leaflet.draw.css'][rel='stylesheet'][type='text/css']")
    ]),
    m("body", attrs, [
      common.navBar(ctrl),
      template,
    ])
  ])
}

common.tabs = function(arr){
  return m("dl.tabs[data-tab]", [
    arr.map(function(item, i){
      var setActive = function(i){
        if(i == 0){
          return "active";
        } else {
          return "";
        }
      };
      return m("dd", {class: setActive(i)}, [
        m("a", item.label)
      ]);
    })
  ])
}

common.renderString = function(str){
  if(str){
    return m("span", str);
  } else {
    return m("span.label.alert", "Missing Data");
  }
}

common.renderObj = function(obj){
  if(_.isEmpty(obj)){
    return m("span.label.alert", "Missing Date");
  } else {
    return _.chain(obj)
      .pairs()
      .filter(function(entry){
        return entry[1];
      })
      .map(function(entry){
        return m("div", [m("h5", entry[0]), m("p", entry[1])]);
      })
      .value();
  }
}

common.historyEvent = function(data){
  return m(".event", [
    m(".date", [
      data.date
    ]),
    m(".details", [
      m("p", data.type),
      m("p", data.name)
    ])
  ])
}

projectListView = {};

projectListView.controller = function(){
  var self = this;
  // this.Users = new user.controller();
  this.Projects = new project.controller();
  this.projectList = m.prop([]);
  this.projectFilters = m.prop([]);
  this.currentFilter = {
    projects: m.prop("")
  };

  dataPull().then(function(data){
    // don't use data because you don't want to override new projects. this has already been used in dataPull
    self.projectList = database.projectList;
    self.projectFilters = database.projectFilters;
  });
  

  // console.log(projectList);
}

projectListView.view = function(ctrl){
  // var tabs = [
  //   {label: "All"},
  //   {label: "NDRRMC"},
  //   {label: "DPWH"},
  //   {label: "OP"},
  //   {label: "DBM"}
  // ];
  var tabs = [
    {label: "All"},
    {label: "Assigned to Me"}
  ];
  return common.main(ctrl, 
    m("div#view", [
      common.banner("List of Requested Projects"),
      m("section", [
        // console.log("you've got to be"),
        m("div",{class: "row"}, [
          m("div", {class: "columns.medium-9"}, [
            common.tabs(tabs),
            m("table", [
              m("thead", [
                m("tr", [
                  m("th", "id"),
                  m("th", "name"),
                  m("th", "data integrity"),
                  m("th.text-right", "amount")
                ])
              ]),
              m("tbody", [
                ctrl.projectList()
                .filter(function(p){
                  if(!ctrl.currentFilter.projects()){
                    return true;
                  } else {
                    return p.type() == ctrl.currentFilter.projects();
                  }
                })
                .map(function(project){
                  var url = "/projects/"+project.id();
                  return m("tr", [
                    m("td", project.id()),
                    m("td", [
                      m("a.name", {href: url, config: m.route}, project.description())
                    ]),
                    m("td", [
                      project.errors().length ? m("span.label.alert", project.errors().length+" errors") : m("span.label.success", [m("i.fa.fa-check")])
                    ]),
                    m("td.text-right", helper.commaize(project.amount()))
                  ])
                })
              ])
            ])
          ]),
          m("div.columns.medium-3", [
            m("a.button", {href: "/new", config: m.route}, "New Request"),
            m("ul", [
              m("li", [
                m("a", {onclick: ctrl.currentFilter.projects.bind(ctrl.currentFilter, "")}, "All")
              ]),
              ctrl.projectFilters().map(function(filter){
                return m("li", [
                  m("a", {onclick: ctrl.currentFilter.projects.bind(ctrl.currentFilter, filter)}, filter)
                ])
              })
            ])
          ])
        ]),
        // console.log("kidding me")
      ])
    ])
  )
}

projectDetailView = {};

projectDetailView.controller = function(){
  var self = this;
  this.id = m.route.param("id");
  this.project = m.prop({});
  dataPull().then(function(data){
    self.project(database.projectList()[self.id - 1]);
  })
}

projectDetailView.view = function(ctrl){
  var renderErrorList = function(errList){
    if(errList.length){
      return m("span", [
        m("small", "With errors: "),
        errList.map(function(e){
          return m("span.label.alert", e);
        })
      ])
    }
  }
  return common.main(ctrl,
    m("div#view", [
      m("section.summary", [
        m("div.row", [
          m("div.columns.medium-12", [
            m("div.prog", [
              _.chain(process.steps())
                .map(function(step, code, list){
                  var progress = ctrl.project().progress();
                  var code = parseInt(code);
                  var width = 100 / _.keys(list).length + "%";

                  if(progress > code){
                    return m("div.step.completed", {style: {width: width}}, step.completed);
                  } else if (progress === code){
                    return m("div.step.pending", {style: {width: width}}, step.pending);
                  } else {
                    return m("div.step", {style: {width: width}}, step.label);
                  }
                })
                .value()
            ])
          ]),
        ]),
        m("div.row", [
          m("div.columns.medium-12", [
            m("h4", [
              "Posted by "+ctrl.project().author().name+" on "+ctrl.project().date().toDateString() + " ", // change this as people modify this. "Last edited by _____"
              renderErrorList(ctrl.project().errors())
            ]),
            m("h1", ctrl.project().description()),
            
          ])
        ]),
        m("div.row", [
          m("div.columns.medium-3", [
            m("h4", [m("small", "Amount")]),
            common.renderString(
              helper.commaize(ctrl.project().amount())
            )
          ]),
          m("div.columns.medium-3", [
            m("h4", [m("small", "Type")]),
            ctrl.project().type()
          ]),
          m("div.columns.medium-3", [
            m("h4", [m("small", "Disaster")]),
            common.renderString(ctrl.project().disaster().type + " " + ctrl.project().disaster().name + ", in " + ctrl.project().disaster().date.toDateString())
          ]),
          m("div.columns.medium-3", [
            m("h4", [m("small", "Location")]),
            common.renderString(
              _.chain(ctrl.project().location())
              .filter(function(entry){
                return entry
              })
              .reduce(function(memo, next){
                if(!memo){
                  return next;
                } else {
                  return memo + ", " + next;
                }
              }, "")
              .value()
            )
          ]),
        ])
      ]),
      m("section.history", [
        m("div.row", [
          m("div.columns.medium-9", [
            "conversations",
            common.historyEvent(ctrl.project().disaster())
          ]),
          m("div.columns.medium-3", [
            "attachment list"
          ])
        ])
      ])
    ]),
    {class: "detail"}
  )
}

projectCreateView = {};

projectCreateView.controller = function(){

}

projectCreateView.view = function(ctrl){

  var sections = [
    {
      icon: "fa-cloud",
      content: [
        m("h2", "Disaster"),
        m("label", [
          "Disaster Name",
          m("input", {type: 'text', placeholder: 'Yolanda, Pepeng, Piping, Popong, etc...'})
        ])
      ],
      help: "Specify the disaster to give everyone context about your request. Insert all these other details etc..."
    },
    {
      icon: "fa-map-marker",
      content: [
        m("h2", "Location"),
        m("#map")
      ],
      help: "Now tell us where the request should be sent. We've filled these up for you if we have your address on file. Don't worry, you can change this if you're making this request for someone else."
    },
    {
      icon: "fa-briefcase",
      content: [
        m("h2", "Project"),
        m("label", [
          "hi"
        ])
      ],
      help: "Now tell us about this project. Please be as brief as you can when describing your project. Making it simple and easy to understand will make your project more likely to be approved."
    }
  ]

  if(document.getElementById("map")){
    var map = L.map('map', {drawControl: true}).setView([51.505, -0.09], 13);


    // create the tile layer with correct attribution
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});   

    // start the map in South-East England
    map.setView(new L.LatLng(51.3, 0.7),9);
    map.addLayer(osm);

    L.tileLayer(osmUrl, {attribution: osmAttrib, maxZoom: 18}).addTo(map);
  }

  return common.main(ctrl,
    m("div#view", [
      common.banner("New Project Request"),
      m("form", 
        sections.map(function(s, i){
          return common.formSection(s.icon, s.content, s.help, i);
        })
      )
    ])
  )
}

dashboardView = {};

dashboardView.controller = function(){
  console.log('hi');
}

dashboardView.view = function(ctrl){
  return common.main(ctrl,
    common.banner("Dashboard"),
    m("div#view", [
      
    ])
  )
}

////////////////////////////////////////////////////
// routes

m.route(document.body, "/projects", {
    "/projects": projectListView,
    "/projects/:id": projectDetailView,
    "/new": projectCreateView,
    "/dashboard": dashboardView
});

////////////////////////////////////////////////////
// Execution
// m.module(document, recon);


