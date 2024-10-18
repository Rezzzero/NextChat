import { useState } from "react";
import { Age, yourGender, companionsGender } from "../../constants/constants";
import FilterButton from "../buttons/FilterButton";

const ChatSettings = () => {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCompanionGender, setSelectedCompanionGender] =
    useState<string>("");
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedCompanionAges, setSelectedCompanionAges] = useState<string[]>(
    []
  );

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleCompanionGenderChange = (gender: string) => {
    setSelectedCompanionGender(gender);
  };

  const handleAgeChange = (age: string) => {
    setSelectedAge(age);
  };

  const handleCompanionAgeChange = (age: string) => {
    if (selectedCompanionAges.includes(age)) {
      setSelectedCompanionAges(
        selectedCompanionAges.filter((selectedAge) => selectedAge !== age)
      );
    } else {
      setSelectedCompanionAges([...selectedCompanionAges, age]);
    }
  };

  return (
    <div>
      <div className="flex gap-12">
        <div className="flex flex-col">
          <p className="text-lg font-bold">Ваш пол:</p>
          {yourGender.map((gender) => (
            <FilterButton
              key={gender.value}
              text={gender.label}
              isActive={gender.value === selectedGender}
              onClick={() => handleGenderChange(gender.value)}
            />
          ))}
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-bold">Пол собеседника:</p>
          {companionsGender.map((gender) => (
            <FilterButton
              key={gender.value}
              text={gender.label}
              isActive={gender.value === selectedCompanionGender}
              onClick={() => handleCompanionGenderChange(gender.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col">
          <p className="text-lg font-bold">Ваш возраст:</p>
          {Age.map((age) => (
            <FilterButton
              key={age.value}
              text={age.label}
              isActive={age.value === selectedAge}
              onClick={() => handleAgeChange(age.value)}
            />
          ))}
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-bold">Возраст собеседника:</p>
          {Age.map((age) => (
            <FilterButton
              key={age.value}
              text={age.label}
              isActive={selectedCompanionAges.includes(age.value)}
              onClick={() => handleCompanionAgeChange(age.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
