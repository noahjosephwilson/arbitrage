"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Home,
  DollarSign,
  Award,
  FileText,
  Briefcase,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  // Local state to track the "active" route and open menus
  const [activeRoute, setActiveRoute] = useState("/company/dashboard");
  const [openMenus, setOpenMenus] = useState({});
  const [activeCategory, setActiveCategory] = useState("");

  // A self-contained NavLink component that simulates navigation by updating activeRoute
  const NavLink = ({ to, end, onClick, children, className }) => {
    const isActive = end ? activeRoute === to : activeRoute.startsWith(to);
    const computedClassName =
      typeof className === "function" ? className({ isActive }) : className;
    const handleClick = (e) => {
      e.preventDefault();
      setActiveRoute(to);
      if (onClick) onClick();
    };
    return (
      <a href={to} onClick={handleClick}>
        {React.cloneElement(React.Children.only(children), {
          className: computedClassName,
        })}
      </a>
    );
  };

  // A self-contained SidebarMenuItem component to render each menu item (with optional subitems)
  const SidebarMenuItem = ({ item, isOpen, onToggle }) => {
    if (item.items) {
      return (
        <li className={styles["sidebar-menu-item"]}>
          <button
            className={styles["sidebar-menu-button"]}
            onClick={() => onToggle(item.label)}
          >
            <item.icon
              className={`${styles["sidebar-icon"]} ${
                activeCategory === item.label ? styles.active : ""
              }`}
            />
            <span className={styles["menu-label"]}>{item.label}</span>
            <ChevronDown
              className={`${styles["dropdown-arrow"]} ${
                isOpen ? styles.open : ""
              }`}
            />
          </button>
          {isOpen && (
            <ul className={styles["sidebar-menu-sub"]}>
              {item.items.map((subItem) => (
                <li key={subItem.label} className={styles["sidebar-menu-sub-item"]}>
                  <NavLink
                    to={subItem.link}
                    end={subItem.label !== "Share Classes"}
                    onClick={() => setActiveCategory(item.label)}
                    className={({ isActive }) =>
                      `${styles["sidebar-menu-sub-button"]} ${
                        isActive ? styles.activeSub : ""
                      }`
                    }
                  >
                    <span>{subItem.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    } else {
      return (
        <li className={styles["sidebar-menu-item"]}>
          <NavLink
            to={item.link}
            end={item.label === "Dashboard"}
            onClick={() => setActiveCategory(item.label)}
            className={({ isActive }) =>
              `${styles["sidebar-menu-button"]} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles["dashboard-content"]}>
              <item.icon
                className={`${styles["sidebar-icon"]} ${
                  activeCategory === item.label ? styles.active : ""
                }`}
              />
              <span className={styles["menu-label"]}>{item.label}</span>
            </span>
          </NavLink>
        </li>
      );
    }
  };

  // Dummy menu items array
  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      link: "/company/dashboard",
    },
    {
      label: "Equity",
      icon: DollarSign,
      items: [
        { label: "Cap Table", link: "/company/equity/captable" },
        { label: "Shareholders", link: "/company/equity/shareholders" },
        { label: "Share Transactions", link: "/company/equity/sharetransactions" },
        { label: "Exercise Requests", link: "/company/equity/exerciserequests" },
        { label: "Share Classes", link: "/company/equity/shareclasses" },
        { label: "Transaction Log", link: "/company/equity/transactionlog" },
      ],
    },
    {
      label: "Instruments",
      icon: Award,
      items: [
        { label: "Stock Options", link: "/company/instruments/stockoptions" },
        { label: "Restricted Stock", link: "/company/instruments/restrictedstock" },
        { label: "Performance Stock", link: "/company/instruments/performancestock" },
        { label: "SAFE", link: "/company/instruments/SAFE" },
        { label: "Convertible Notes", link: "/company/instruments/convertiblenotes" },
        { label: "Warrants", link: "/company/instruments/warrants" },
      ],
    },
    {
      label: "Company",
      icon: Briefcase,
      items: [
        { label: "Manage Officers", link: "/company/company/manageofficers" },
        { label: "Company Profile", link: "/company/company/companyprofile" },
        { label: "Executive Board", link: "/company/company/executiveboard" },
        { label: "Communication", link: "/company/company/communication" },
        { label: "Voting", link: "/company/company/voting" },
      ],
    },
    {
      label: "Documents",
      icon: FileText,
      items: [
        { label: "View Documents", link: "/company/documents/viewdocuments" },
        { label: "Create Documents", link: "/company/documents/createdocuments" },
        { label: "Pending Agreements", link: "/company/documents/pendingagreements" },
      ],
    },
  ];

  // Toggle open/closed state for menus that have subitems
  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className={styles["main-sidebar"]}>
      <nav className={styles["sidebar-nav"]}>
        <ul className={styles["sidebar-menu"]}>
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.label}
              item={item}
              isOpen={item.items ? openMenus[item.label] : false}
              onToggle={toggleMenu}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
