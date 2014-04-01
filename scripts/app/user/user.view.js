user.view = function(ctrl){
  return common.main(ctrl, m("div#view", [
    common.banner(ctrl.user().name),
    // console.log(ctrl.projectList()),
    m("div", {class: "row"}, [
      m("div", {class: "columns medium-9"}, [
        project.listView(ctrl)
      ])
    ])
  ]))
}