app.controller = function(){
  this.currentUser = app.currentUser;
  this.isLoggedIn = function(){
    if(this.currentUser().constructor === user.GUEST){
      return false;
    } else {
      return true;
    }
  };
  this.logout = function(){
    this.currentUser(new user.GUEST());
  }
  this.authorizedUsers = function(){
    return database.userList().filter(function(user){
      return user.department === "NDRRMC";
    });
  };
}