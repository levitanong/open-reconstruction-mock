
////////////////////////////////////////////////////
// routes

m.route(document.body, "/projects", {
  "/projects": projectListing,
  "/new": projectCreation,
  "/projects/:id": project,
  "/dashboard": dashboard,
  "/user/:id": user
});