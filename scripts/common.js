var common = {};

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