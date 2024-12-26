import React from 'react'
import Routing from "./Routing";
import toast, { Toaster } from "react-hot-toast";

const App = () => {

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="w-full h-screen bg-zinc-900 text-white">
        <Routing />
      </div>
    </>
  );
};

export default App;