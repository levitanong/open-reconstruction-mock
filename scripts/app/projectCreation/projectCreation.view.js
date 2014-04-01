projectCreation.view = function(ctrl){

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
    }
  ]

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