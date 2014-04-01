projectListing.controller = function(){
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