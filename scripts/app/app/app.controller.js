app.controller = function(){
  this.currentUser = app.currentUser;
  this.isLoggedIn = function(){
    if(this.currentUser()){
      return true;
    } else {
      return false;
    }
  };
  this.logout = function(){
    this.currentUser(null);
  }
  this.authorizedUsers = function(){
    return database.userList().filter(function(user){
      return user.department === "NDRRMC";
    });
  };
}