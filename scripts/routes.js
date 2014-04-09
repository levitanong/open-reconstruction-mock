
////////////////////////////////////////////////////
// routes

m.route(document.body, "/projects", {
  "/projects": projectListing,
  "/projects/new": projectCreation,
  "/projects/:id": project,
  "/dashboard": dashboard,
  "/user/:id": user
});