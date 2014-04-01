projectListing.view = function(ctrl){
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
          m("div", {class: "columns medium-9"}, [
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
          m("div", {class: "columns medium-3"}, [
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
        ])
      ])
    ])
  )
}