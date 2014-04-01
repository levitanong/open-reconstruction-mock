
////////////////////////////////////////////////////
// routes

m.route(document.body, "/projects", {
    "/projects": projectListing,
    "/projects/:id": projectDetail,
    "/new": projectCreation,
    "/dashboard": dashboard
});

