import { defaultSettings } from "@/app/constants/constants";
import { useEffect, useState } from "react";

export const useChatSettings = ({ storage }: { storage: string }) => {
  const [selectedSettings, setSelectedSettings] = useState<{
    selectedGender: string;
    selectedAge: string;
    selectedCompanionGender: string;
    selectedCompanionAges: string[];
  }>(defaultSettings);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedSettings = localStorage.getItem(storage);
      if (savedSettings) {
        setSelectedSettings(JSON.parse(savedSettings));
      }
      setIsSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isSettingsLoaded) {
      localStorage.setItem(storage, JSON.stringify(selectedSettings));
    }
  }, [selectedSettings, isSettingsLoaded, storage]);

  return { selectedSettings, setSelectedSettings };
};
