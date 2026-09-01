import { useState } from "react";
import classes from "./useNav.module.css";

export default function useNav({ tabs, initialActivePage }) {
  // wrap in arrow fn to prevent React from calling the component as a lazy initializer
  const [ActiveComponent, setActivePage] = useState(
    () => initialActivePage ?? tabs[0]?.component,
  );

  const Nav = (
    <nav className={classes.nav}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`${classes.navButton} ${tab.component === ActiveComponent ? classes.active : ""}`}
          onClick={() => setActivePage(() => tab.component)}
        >
          {tab.tab}
        </button>
      ))}
    </nav>
  );

  return { Nav, ActiveComponent };
}
