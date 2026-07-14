"use client";

import DarkModeToggle from "@components/DarkModeToggle";
import Navbar from "@components/Navbar/Navbar";
import MobileMenu from "@components/MobileMenu";
import { useDarkMode } from "@contexts/dark-mode-context";
import MobileBottomNav from "@components/MobileBottomNav";
import LeftSidebar from "@components/LeftSidebar/LeftSidebar";
import RightSidebar from "@components/RightSidebar/RightSidebar";
import { useContext } from "react";

export default function FeedPage() {
  return <FeedPageContent />;
}

function FeedPageContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={
        "_layout _layout_main_wrapper" + (darkMode ? " _dark_wrapper" : "")
      }
    >
      <DarkModeToggle />
      <div className="_main_layout">
        <Navbar />
        <MobileMenu />
        <MobileBottomNav />
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <LeftSidebar />
              </div>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner"></div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <RightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
