project.view = function(ctrl){
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

  var whichAction = function(ctrl, arr){

  }

  var userActions = function(ctrl){

    var actions = m.prop({
      "Comment": [
        m("h3", "Leave a comment"),
        m("textarea"),
        m("button", "Submit")
      ],
      "Approve": [
        m("h3", "Approve"),
        m("div", "insert amount revision"),
        m("div", "insert remarks"),
        m("button", "Approve")
      ],
      "Reject": [
        m("h3", "Reject"),
        m("div", "insert remakrs"),
        m("button", "Reject")
      ]
    })

    if(ctrl.isCurrentUserAuthorized()){
      return m("div", [
        common.tabs.view(ctrl.tabs, [
          {label: "Comment"},
          {label: "Approve"},
          {label: "Reject"}
        ]),
        m("form", actions()[ctrl.tabs.currentTab() ? ctrl.tabs.currentTab() : "Comment"])
      ])
    } else {
      return m("div", actions()["Comment"])
    }
  }

  return app.template(ctrl, {class: "detail"}, [
    // m("div#detailMap", {config: ctrl.initMap}),

    m("section.summary", [
      // m("div.row", [
      //   m("div.columns.medium-12", [
      //     m("div.prog", [
      //       _.chain(process.steps())
      //         .map(function(step, code, list){
      //           var progress = ctrl.project().progress();
      //           var code = parseInt(code);
      //           var width = 100 / _.keys(list).length + "%";

      //           if(progress > code){
      //             return m("div.step.completed", {style: {width: width}}, step);
      //           } else if (progress === code){
      //             return m("div.step.pending", {style: {width: width}}, step);
      //           } else {
      //             return m("div.step", {style: {width: width}}, step);
      //           }
      //         })
      //         .value()
      //     ]),
      //   ]),
      // ]),
      // m("div.row", [
      //   m("div.columns.medium-12", [
      //     "Project type"
      //   ])
      // ]),

      m("div.row", [
        m("div.columns.medium-4", [
          m("div.project-stub", [
            m("div.section.type", [
              ctrl.project().type()
            ]),
            m("div.section", [
              m("h4", ctrl.project().description()),
              // m("span.label", ctrl.project().type()),
              m("p.meta", [
                "Posted by ",
                m("a",{href: "/user/"+ctrl.project().author().slug, config: m.route}, ctrl.project().author().name),
                m("br"),
                " on "+ctrl.project().date().toDateString() + " ", // change this as people modify this. "Last edited by _____"
              ]),
                // renderErrorList(ctrl.project().errors())
            ]),
            m("hr"),
            m("div.section", [
              m("h5", [m("small", "Amount")]),
              m("h5.value", [
                common.renderString(
                  helper.commaize(ctrl.project().amount())
                )
              ]),
              m("h5", [m("small", "Disaster")]),
              m("h5.value", [
                common.renderString(ctrl.project().disaster().type() + " " + ctrl.project().disaster().name() + ", in " + ctrl.project().disaster().date().toDateString())  
              ]),
              m("h5", [m("small", "Location")]),
              m("h5.value", [
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
              ])
            ]),
            m("div#detailMap", {config: ctrl.initMap})
          ])
        ]),
        m("div.columns.medium-8", [
          m(".card", [
            m(".section", [
              common.tabs.view(ctrl.projectTabs, [
                {label: "Images"}, {label: "Documents"}, {label: "History"}, {label: "Comments"}
              ])
            ]),
            common.tabs.panes(ctrl.projectTabs, {
              "Images": m(".section", [
                // m("h4", "Images"),
                m("ul.small-block-grid-3", [
                  m("li", [
                    m("img[src='http://placehold.it/400x300']")
                  ]),
                  m("li", [
                    m("img[src='http://placehold.it/400x300']")
                  ]),
                  m("li", [
                    m("img[src='http://placehold.it/400x300']")
                  ])
                ]),
              ]),
              "Documents": m(".section", [
                // m("h4", "Documents"),
                m("table.doc-list", [
                  m("thead", [
                    m("tr", [
                      m("td", "document"),
                      m("td", "type")
                    ])
                  ]),
                  m("tbody", [
                    m("tr", [
                      m("td", "hi"),
                      m("td", "BP202")
                    ])
                  ])
                ]),
              ]),
              "History": m(".section", [
                // m("h4", "History"),
                historyEvent.calamity(ctrl.project().disaster()),
                ctrl.project().history().map(function(entry){
                  return historyEvent.project(entry);
                }),
              ]),
              "Comments": m(".section", [
                m(".action", [
                  userActions(ctrl)
                ])
              ])
            }),
          ])
        ])
      ])
    ]),
  ])
}

project.listView = function(ctrl){
  return m("table", [
    m("thead", [
      m("tr", [
        m("th", "id"),
        m("th", "name"),
        m("th", "data integrity"),
        m("th.text-right", "amount")
      ])
    ]),
    m("tbody", [
      _.chain(ctrl.projectList())
      .filter(function(p){
        if(!ctrl.currentFilter.projects()){
          return true;
        } else {
          return p.type() == ctrl.currentFilter.projects();
        }
      })
      .sortBy(function(p){
        return p.date();
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
      .value()
    ])
  ])
}
