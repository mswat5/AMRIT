import React from "react";

const ActorContext = React.createContext({
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

export default ActorContext;
