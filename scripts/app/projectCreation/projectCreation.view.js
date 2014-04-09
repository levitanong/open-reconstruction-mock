projectCreation.view = function(ctrl){

  var sections = [
    {
      icon: "fa-cloud",
      content: [
        m("h2", "Disaster"),
        m("label", [
          "Disaster Type",
          m("select", ["Typhoon", "Earthquake", "Flood", "Fire", "Other"].map(function(e){return m("option", e)})),
        ]),
        m("label", [
          "Disaster Name", 
          m("input", {type: 'text', placeholder: 'Yolanda, Pepeng, Piping, Popong, etc...'})
        ])
      ],
      help: "Specify the disaster to give everyone context about your request. Insert all these other details etc..."
    },
    {
      icon: "fa-briefcase",
      content: [
        m("h2", "Basic Information"),
        m("label", [
          "Description",
          m("input", {type: "text", placeholder: "Sea Wall for this town"})
        ]),
        m("label", [
          "Type",
          m("select", {onchange: m.withAttr("value", ctrl.projectType), value: ctrl.projectType()}, ["Road", "Bridge", "Public Building", "School Building"].map(function(e){return m("option", e)}))
        ]),
        m.if(ctrl.projectType() == "Bridge",
          m("label", [
            "Parent Road",
            m("input", {type: "text", placeholder: "Tagbilaran North Road"})
          ])
        ),
        m("label", [
          "Amount",
          m("input", {type: "number"})
        ]),
        m("label", [
          "Scope of Work",
          m("select", {onchange: m.withAttr("value", ctrl.scopeOfWork), value: ctrl.scopeOfWork()}, ["Reconstruction", "Repair and Rehabilitation", "Other"].map(function(e){return m("option", e)}))
        ]),
        m("label", [
          "Location",
          m("div", {id: "map", config: ctrl.initMap})
        ])
      ],
      help: "Now tell us about this project. Please be as brief as you can when describing your project. Making it simple and easy to understand will make your project more likely to be approved."
    },
    {
      icon: "fa-paperclip",
      content: [
        m("h2", "Attachment"),
        m("h3", "Endorsements"),
        m("button", {type: "button"}, "Upload"),
        m("h3", "Costing Estimates"),
        m("button", {type: "button"}, "Upload"),
        m("h3", "Inspection Reports"),
        m("button", {type: "button"}, "Upload"),
        m("h3", "Photos/Diagrams"),
        m("button", {type: "button"}, "Upload"),
        m("h3", "Other"),
        m("button", {type: "button"}, "Upload"),
      ],
      help: "We need your attachments to help your case. Certificates from engineers, endorsements from politicians, and photographs of the area are extremely helpful."
    },
    {
      content: [
        m("button", {type: "button"}, "Submit"),
        m("button", {type: "button", class: "alert"}, "Cancel"),
      ]
    }
  ]

  return app.template(ctrl, [
    common.banner("New Project Request"),
    m("form", 
      sections.map(function(s, i){
        return common.formSection(s.icon, s.content, s.help, i);
      })
    )
  ])
}