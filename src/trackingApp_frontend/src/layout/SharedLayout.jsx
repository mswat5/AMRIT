import React from "react";
import Nav from "./Nav";

const SharedLayout = ({ children }) => {
  return (
    <div className="">
      <Nav />
      <div className="min-h-screen">
        <div className=" dark:bg-slate-500  ">{children}</div>
      </div>
    </div>
  );
};

export default SharedLayout;
