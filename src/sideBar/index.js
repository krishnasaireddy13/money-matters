import React, { useState, useEffect } from "react";
import { AiFillHome } from "react-icons/ai";
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import "./index.css";
import { Link, useLocation } from "react-router-dom";

const Tabs = [
  { tabId: 1, tabName: "Dashboard", path: "/" },
  { tabId: 2, tabName: "All Transactions", path: "/transactions" },
  { tabId: 3, tabName: "Profile", path: "/profile" },
];

const SideTabCon = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const activeTabItem = Tabs.find((tab) => tab.path === currentPath);
    if (activeTabItem) {
      setActiveTab(activeTabItem.tabName);
    } else {
      setActiveTab("Dashboard");
    }
  }, [location]);

  const handleLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="main-con">
      <div className="logo-con">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dlyyekdqr/image/upload/v1690716611/Logo_uxmsaj.png"
            alt="main-logo"
            className="main-logo"
          />
        </Link>
      </div>
      <div className="con2">
        <ul>
          {Tabs.map((tab) => (
            <li key={tab.tabId}>
              <Link to={tab.path} className="link">
                <button
                  type="button"
                  className={`list-item ${
                    activeTab === tab.tabName || location.pathname === tab.path
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setActiveTab(tab.tabName)}
                >
                  {tab.tabId === 1 && <AiFillHome className="logos" />}
                  {tab.tabId === 2 && (
                    <MdOutlineCurrencyExchange className="logos" />
                  )}
                  {tab.tabId === 3 && <FaUserAlt className="logos" />}
                  <p className="side-bar-p">{tab.tabName}</p>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="profile-container">
        <img
          src="https://res.cloudinary.com/dlyyekdqr/image/upload/v1678104807/cld-sample.jpg"
          alt="profile"
          className="profile-logo"
        />
        <div className="profile-details">
          <p className="profile-name">Rhye</p>
          <p className="profile-email">olcdsc@gmail.com</p>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={() => setShowLogoutPopup(true)}
        >
          <FiLogOut className="logout-logo" />
        </button>

        {showLogoutPopup && (
          <div className="logout-popup-container">
            <div className="logout-popup">
              <p className="delete-head">Are you sure you want to logout?</p>
              <button onClick={handleLogout} className="btn-confirm">
                Yes Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideTabCon;
