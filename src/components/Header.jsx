import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./button";
import { Img } from "./image";
import { List } from "./list";
import { Text } from "./text";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  return (
    <>
      <header className="bg-white-A700 flex gap-2 h-20 md:h-auto items-center justify-between md:px-5 px-[120px] py-[19px] w-full">
        <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between w-full">
          <div
            className="common-pointer cursor-pointer flex flex-row gap-[11px] items-center justify-start"
            onClick={() => navigate("/")}
          >
            <Img
              className="common-pointer cursor-pointer h-10 w-10"
              src="images/img_home.svg"
              alt="home"
              onClick={() => navigate("/")}
            />
            <Text
              className="common-pointer cursor-pointer text-orange-A700 text-xl w-auto"
              size="txtMarkoOneRegular20"
              onClick={() => navigate("/")}
            >
              UrbanNest
            </Text>
          </div>

          <form className="vg-slate-100 p-3 rounded-lg flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
            />
            <button type="submit" className="ml-2">
              <FaSearch className="text-gray-500" />
            </button>
          </form>

          <ul className="flex  gap-3">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Home fuck it!
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                About
              </li>
            </Link>
            <Link to="/search">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Search
              </li>
            </Link>
            <Link to="/test">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Test Page
              </li>
            </Link>
            <Link to="/profile">
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <li className="hidden sm:inline text-slate-700 hover:underline">
                  Sign In
                </li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </>
  );
}
