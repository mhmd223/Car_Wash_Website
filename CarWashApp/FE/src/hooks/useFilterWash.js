import { useState, useMemo } from "react";

export function useFilterWash(washes, { filterToday = false } = {}) {
  const [plateFilter, setPlateFilter] = useState("");
  const [filter, setFilter] = useState(null);

  const filteredWashes = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    return washes.filter((wash) => {
      const washDate = wash.Wash_Date?.split(" ")[0]; // "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DD"
      const matchesToday = !filterToday || washDate === today;
      const matchesPlate = wash.Car_Plate.toLowerCase().includes(
        plateFilter.toLowerCase(),
      );
      const matchesStatus = filter === null || wash.Wash_Status === filter;
      return matchesToday && matchesPlate && matchesStatus;
    });
  }, [washes, plateFilter, filter, filterToday]);

  return { filteredWashes, plateFilter, setPlateFilter, filter, setFilter };
}
