import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <>
      <nav className="w-full flex justify-center gap-5 text-white bg-zinc-800 rounded-xl p-4 ">
        <NavLink
          className={(e) => [e.isActive ? "text-purple-600" : "", ""].join(" ")}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={(e) => [e.isActive ? "text-purple-600" : "", ""].join(" ")}
          to="chat"
        >
          Chat
        </NavLink>
      </nav>
    </>
  );
}

export default NavBar