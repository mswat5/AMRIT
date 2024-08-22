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
  isAuthenticated: false,
  login: () => {},
});

export default ActorContext;
