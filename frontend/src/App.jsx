import NavBar from "./pages/NavBar";
import Routing from "./Routing";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="w-full min-h-screen bg-zinc-900 text-white">
        {/* <NavBar /> */}
        <Routing />
      </div>
    </>
  );
};

export default App;
