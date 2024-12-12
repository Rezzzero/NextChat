import { Age, yourGender, companionsGender } from "../../constants/constants";
import FilterButton from "../buttons/FilterButton";

interface ChatSettingsProps {
  selectedSettings: {
    selectedGender: string;
    selectedAge: string;
    selectedCompanionGender: string;
    selectedCompanionAges: string[];
  };
  setSelectedSettings: React.Dispatch<
    React.SetStateAction<{
      selectedGender: string;
      selectedAge: string;
      selectedCompanionGender: string;
      selectedCompanionAges: string[];
    }>
  >;
}

const ChatSettings = ({
  selectedSettings,
  setSelectedSettings,
}: ChatSettingsProps) => {
  const handleGenderChange = (gender: string) => {
    setSelectedSettings((prev) => ({ ...prev, selectedGender: gender }));
    if (gender === "someone") {
      setSelectedSettings((prev) => ({
        ...prev,
        selectedCompanionGender: "someone",
        selectedCompanionAges: [],
        selectedAge: "",
      }));
    }
  };

  const handleCompanionGenderChange = (gender: string) => {
    setSelectedSettings((prev) => ({
      ...prev,
      selectedCompanionGender: gender,
    }));
  };

  const handleAgeChange = (age: string) => {
    setSelectedSettings((prev) => ({ ...prev, selectedAge: age }));
  };

  const handleCompanionAgeChange = (age: string) => {
    setSelectedSettings((prev) => {
      const isSelected = prev.selectedCompanionAges.includes(age);
      const newCompanionAges = isSelected
        ? prev.selectedCompanionAges.filter(
            (selectedAge) => selectedAge !== age
          )
        : [...prev.selectedCompanionAges, age];

      return { ...prev, selectedCompanionAges: newCompanionAges };
    });
  };

  return (
    <div>
      <div className="flex justify-center gap-4 md:gap-12">
        <div className="flex flex-col">
          <p className="text-sm md:text-lg font-bold">Ваш пол:</p>
          {yourGender.map((gender) => (
            <FilterButton
              key={gender.value}
              text={gender.label}
              isActive={gender.value === selectedSettings.selectedGender}
              onClick={() => handleGenderChange(gender.value)}
              pickedGender={true}
            />
          ))}
        </div>

        <div className="flex flex-col">
          <p className="text-sm md:text-lg font-bold">Пол собеседника:</p>
          {companionsGender.map((gender) => (
            <FilterButton
              key={gender.value}
              text={gender.label}
              isActive={
                gender.value === selectedSettings.selectedCompanionGender
              }
              onClick={() => handleCompanionGenderChange(gender.value)}
              pickedGender={selectedSettings.selectedGender !== "someone"}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 md:gap-12">
        <div className="flex flex-col">
          <p className="text-sm md:text-lg font-bold">Ваш возраст:</p>
          {Age.map((age) => (
            <FilterButton
              key={age.value}
              text={age.label}
              isActive={age.value === selectedSettings.selectedAge}
              onClick={() => handleAgeChange(age.value)}
              pickedGender={selectedSettings.selectedGender !== "someone"}
            />
          ))}
        </div>

        <div className="flex flex-col">
          <p className="text-sm md:text-lg font-bold">Возраст собеседника:</p>
          {Age.map((age) => (
            <FilterButton
              key={age.value}
              text={age.label}
              isActive={selectedSettings.selectedCompanionAges.includes(
                age.value
              )}
              onClick={() => handleCompanionAgeChange(age.value)}
              pickedGender={selectedSettings.selectedGender !== "someone"}
            />
          ))}
        </div>
      </div>
      <div>
        {selectedSettings.selectedGender !== "someone" &&
          !selectedSettings.selectedAge && (
            <p className="text-sm md:text-lg font-bold text-red-500">
              Выберите ваш возраст
            </p>
          )}
      </div>
    </div>
  );
};

export default ChatSettings;
