import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-blue-100 flex justify-between items-center">
      <h1 className="text-3xl font-bold">SyncTask</h1>
      <div className="space-x-4">
        <Link to="/"><button className="hover:text-blue-800">Home</button></Link>
        <Link to="/signup"><button className="hover:text-blue-800">Signup</button></Link>
        <Link to="/login"><button className="hover:text-blue-800">Login</button></Link>
      </div>
    </nav>
  );
}

export default Navbar;
