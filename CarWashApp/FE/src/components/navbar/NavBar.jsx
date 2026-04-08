/**
 * NavBar Component
 * Provides navigation links for the application
 * Includes links to Contacts and About pages
 *
 * Features:
 * - Dynamic navigation links
 * - Active state highlighting
 * - Responsive design
 * - Consistent styling
 *
 * Styling:
 * - CSS module-based styling
 * - Active link highlighting
 * - Clean, modern design
 */
import { NavLink } from "react-router-dom";
// Import component styles
import classes from "./navbar.module.css";
// Import navigation pages data
import { pages } from "../../data/pages/pages";

import { BiSolidCarWash } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoMdHome } from "react-icons/io";
import { FaExclamationCircle } from "react-icons/fa";

/**
 * Navigation bar component - Provides main site navigation
 * Renders navigation links with active state styling
 *
 * Implementation:
 * - Uses NavLink for active state management
 * - Dynamically generates links from pages data
 * - Maintains consistent styling
 *
 * @returns {JSX.Element} The rendered navigation bar with styled links
 */
export default function NavBar() {
  return (
    // Main navigation container
    <div className={classes.navbarContainer}>
      {/* Unordered list of navigation items */}
      <ul className={classes.navbar}>
        {/* Map through pages to create navigation links */}
        {pages.map((page) => (
          // Individual navigation item
          <li className={classes.navbarItem} key={page}>
            {/* NavLink with active state styling */}
            <NavLink
              key={page}
              to={"/" + page.toLowerCase()}
              className={({ isActive }) => (isActive ? classes.active : "")}
            >
              {page}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
