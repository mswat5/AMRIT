import React from "react";
import Nav from "./Nav";

interface Props {
  children: React.ReactNode;
}
const SharedLayout = ({ children }: Props) => {
  return (
    <div >
    <Nav />
      <div className="min-h-screen">
        <div className=" dark:bg-slate-500  ">
          {children} 
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;