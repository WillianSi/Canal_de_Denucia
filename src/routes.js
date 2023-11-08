import Index from "views/Index.js";

var routes = [
  {
    path: "/index/:incidentId",
    name: "Home",
    icon: "ni ni-tv-2 text-default",
    component: <Index />,
    layout: "/admin",
  },
];
export default routes;
