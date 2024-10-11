import React from "react";

const Searchbar = () => {
  return (
    <>
      <div className="w-full max-w-2xl p-2">
        <form>
          <div className="">
            <input
              className="shadow appearance-none text-sm border  rounded-full w-full py-1 px-2 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Cherchez un film ou mot-clé"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Searchbar;
