app.controller = function(){
  this.currentUser = app.currentUser;
  this.isLoggedIn = function(){
    if(this.currentUser()){
      return true;
    } else {
      return false;
    }
  };
  this.authorizedUsers = function(){
    console.log(database.userList().filter(function(user){
      return user.department;
    }));
    return database.userList().filter(function(user){
      return user.department === "NDRRMC";
    });
  };
}