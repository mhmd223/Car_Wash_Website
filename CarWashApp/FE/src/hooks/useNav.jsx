import { useState } from "react";

export default function useNav({ tabs, initialActivePage = 0 }) {
  const [activePage, setActivePage] = useState(initialActivePage);

  const handleTabClick = (index) => {
    setActivePage(index);
  };

  return tabs.map((tab, index) => {
    return {
      ...tab,
      isActive: index === activePage,
      onClick: () => handleTabClick(index),
    };
  });
}
