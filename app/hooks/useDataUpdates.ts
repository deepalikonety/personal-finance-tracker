"use client";

import { useState, useCallback } from "react";

// Custom hook to trigger data updates (when transactions or budgets change)
export const useDataUpdate = () => {
  const [trigger, setTrigger] = useState(false);

  const requestDataUpdate = useCallback(() => {
    setTrigger((prev) => !prev); // Toggle the trigger state
  }, []);

  return { trigger, requestDataUpdate };
};
