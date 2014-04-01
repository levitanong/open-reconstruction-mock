projectListing.view = function(ctrl){
  var tabs = [
    {label: "All"},
    {label: "Assigned to Me"}
  ];
  return common.main(ctrl, 
    m("div#view", [
      common.banner("List of Requested Projects"),
      m("section", [
        m("div",{class: "row"}, [
          m("div", {class: "columns medium-9"}, [
            common.tabs(tabs),
            project.listView(ctrl)
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