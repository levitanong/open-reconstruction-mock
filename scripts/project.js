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