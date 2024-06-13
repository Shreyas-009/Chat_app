import NavBar from "./pages/NavBar";
import Routing from "./Routing";

const App = () => {
  return (
    <>
      <div className="w-full min-h-screen bg-zinc-900 text-white">
        {/* <NavBar /> */}
        <Routing />
      </div>
    </>
  );
};

export default App;
