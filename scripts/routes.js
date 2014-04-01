
////////////////////////////////////////////////////
// routes

m.route(document.body, "/projects", {
    "/projects": projectListing,
    "/projects/:id": project,
    "/new": projectCreation,
    "/dashboard": dashboard,
    "/user/:id": user
});

