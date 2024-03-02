import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//import LogInModal from "modals/LogIn";

//import { Button, Img, List, Text } from "./components";

import { Button } from "./button";
import { Img } from "./image";
import { List } from "./list";
import { Text } from "./text";

const LandingPageHeader = (props) => {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <header className="bg-white-A700 flex gap-2 h-20 md:h-auto items-center justify-between md:px-5 px-[120px] py-[19px] w-full">
        <div className="flex md:flex-col flex-row md:gap-10 items-center justify-between w-full">
          <div className="header-row my-px">
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
            <div className="mobile-menu">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="flex sm:flex-1 sm:flex-col flex-row sm:hidden items-center justify-between w-[492px] sm:w-full">
            <List
              className="sm:flex-col flex-row gap-10 grid grid-cols-3"
              orientation="horizontal"
            >
              <div className="flex flex-row gap-1.5 items-start justify-start w-[77px]">
                <Text
                  className="common-pointer cursor-pointer text-base text-gray-900 w-auto"
                  size="txtManropeSemiBold16"
                  onClick={() => navigate("/")}
                >
                  Home
                </Text>
                <Img
                  className="h-4 w-4"
                  src="images/img_arrowdown_gray_600.svg"
                  alt="arrowdown"
                />
              </div>
              <div className="flex flex-row gap-1.5 items-start justify-start w-[77px]">
                <Text
                  className="common-pointer cursor-pointer text-base text-gray-900 w-auto"
                  size="txtManropeSemiBold16"
                  onClick={() => navigate("/listing")}
                >
                  Listing
                </Text>
                <Img
                  className="h-4 w-4"
                  src="images/img_arrowdown_gray_600.svg"
                  alt="arrowdown"
                />
              </div>
              <div className="flex flex-row gap-1.5 items-start justify-start w-[77px]">
                <Text
                  className="common-pointer cursor-pointer text-base text-gray-900 w-auto"
                  size="txtManropeSemiBold16"
                  onClick={() => navigate("/agentlist")}
                >
                  Agents
                </Text>
                <Img
                  className="h-4 w-4"
                  src="images/img_arrowdown_gray_600.svg"
                  alt="arrowdown"
                />
              </div>
            </List>
            <Text
              className="common-pointer cursor-pointer text-base text-center text-gray-900 w-auto"
              size="txtManropeSemiBold16"
              onClick={() => navigate("/search")}
            >
              Property{" "}
            </Text>
            <Text
              className="common-pointer cursor-pointer text-base text-gray-900 w-auto"
              size="txtManropeSemiBold16"
              onClick={() => navigate("/blogHome")}
            >
              Blog
            </Text>

            <Text
              className="common-pointer cursor-pointer text-base text-gray-900 w-auto"
              size="txtManropeSemiBold16"
              onClick={() => navigate("/test")}
            >
              Test
            </Text>

          </div>
          <div className="flex flex-row gap-10 h-[42px] md:h-auto sm:hidden items-center justify-start w-[228px]">
            <Button
              className="common-pointer bg-transparent cursor-pointer flex items-center justify-center min-w-[94px]"
              onClick={() => navigate("/search")}
              leftIcon={
                <Img
                  className="h-6 mb-px mr-2"
                  src="images/img_search.svg"
                  alt="search"
                />
              }
            >
              <div className="font-bold font-manrope text-gray-900 text-left text-lg">
                Search 
              </div>
            </Button>
            <Button
              className="common-pointer cursor-pointer font-manrope font-semibold py-2.5 rounded-[10px] text-base text-center text-white-A700 w-full"
              onClick={() => navigate("/profile")}
            >
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="common-pointer bg-gray-900 cursor-pointer font-manrope font-semibold py-2.5 rounded-[10px] text-base text-center text-white-A700 w-full">
                  Log In
                </div>
              )}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

LandingPageHeader.defaultProps = {};

export default LandingPageHeader;
