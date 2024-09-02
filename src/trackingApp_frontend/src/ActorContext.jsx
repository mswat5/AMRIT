import React from "react";

export const ActorContext = React.createContext({
  actors: {
    admin: null,
    report: null,
    facility: null,
    ambulance: null,
    accident: null,
    patient: null,
  },
  setActors: () => {},
  isAuthenticated: false,
  login: async () => {},
});
export const ViewContext = React.createContext({
  view: "cards",
  setView: () => {},
});
