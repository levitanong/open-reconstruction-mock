projectCreation.view = function(ctrl){

  var sections = [
    {
      icon: "fa-cloud",
      content: [
        m("h2", "Disaster"),
        m("label", [
          "Disaster Name",
          m("select", ["Typhoon", "Earthquake", "Flood", "Fire", "Other"].map(function(e){return m("option", e)})),
          m("input", {type: 'text', placeholder: 'Yolanda, Pepeng, Piping, Popong, etc...'})
        ])
      ],
      help: "Specify the disaster to give everyone context about your request. Insert all these other details etc..."
    },
    {
      icon: "fa-map-marker",
      content: [
        m("h2", "Location"),
        m("div", {id: "map", config: ctrl.initMap})
      ],
      help: "Now tell us where the request should be sent. We've filled these up for you if we have your address on file. Don't worry, you can change this if you're making this request for someone else."
    },
    {
      icon: "fa-briefcase",
      content: [
        m("h2", "Project"),
        m("label", [
          "Description",
          m("input", {type: "text", placeholder: "Sea Wall for this town"})
        ]),
        m("label", [
          "Amount",
          m("input", {type: "number"})
        ])
      ],
      help: "Now tell us about this project. Please be as brief as you can when describing your project. Making it simple and easy to understand will make your project more likely to be approved."
    },
    {
      icon: "fa-paperclip",
      content: [
        m("h2", "Attachment"),
        m("button", {type: "button"}, "Upload"),
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