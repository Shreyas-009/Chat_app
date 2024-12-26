import React from "react";

const SearchModal = ({
  OpenSearch,
  setOpenSearch,
  search,
  setSearch,
  loading,
  searchResult,
  handleSearch,
  accessChat,
}) => {
  return (
    <div
      className=" inset-0 bg-black bg-opacity-50 z-50"
      onClick={() => setOpenSearch(false)}
    >
      <div
        className="bg-zinc-800 text-white h-[100vh] absolute left-0 top-0 p-4 w-full sm:w-1/5 min-w-fit z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full justify-between pb-7">
          <h1 className="text-2xl">Search Users</h1>
          <button
            onClick={() => setOpenSearch(false)}
            className="text-gray-200 hover:bg-zinc-200 rounded-md px-1 hover:text-black"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="flex gap-2">
          <input
            className="bg-zinc-900 p-3 outline-none md:flex rounded-lg flex-1"
            type="text"
            placeholder="Search User"
            value={search}
            onInput={(e) => setSearch(e.target.value)}
          />
          <button
            className="p-3 rounded-lg text-zinc-100 bg-purple-500 hover:bg-purple-700 font-semibold"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="py-5 flex flex-col gap-2">
          {loading
            ? Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-2 bg-zinc-600 p-2 rounded-lg items-center animate-pulse"
                  >
                    <div className="rounded-full h-9 w-9 bg-gray-500"></div>
                    <div className="flex flex-col gap-1">
                      <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-500 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
            : searchResult.map((user) => (
                <div
                  key={user._id}
                  className="flex gap-2 bg-zinc-600 hover:bg-purple-400 p-2 rounded-lg items-center"
                  onClick={() => accessChat(user._id)}
                >
                  <img
                    src={user.picture}
                    alt=""
                    className="rounded-full h-9 w-9 bg-zinc-900"
                  />
                  <div className="flex flex-col text-xs">
                    <h2 className="text-sm font-semibold">{user.name}</h2>
                    <span className="text-zinc-300">Email: {user.email}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
