import { useState } from "react";
import { Age, yourGender, companionsGender } from "../../constants/constants";
import FilterButton from "../buttons/FilterButton";

const ChatSettings = () => {
  const [selectedGender, setSelectedGender] = useState<string>("");

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
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
              isActive={false}
              onClick={() => {}}
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
              isActive={false}
              onClick={() => {}}
            />
          ))}
        </div>

        <div className="flex flex-col">
          <p className="text-lg font-bold">Возраст собеседника:</p>
          {Age.map((age) => (
            <FilterButton
              key={age.value}
              text={age.label}
              isActive={false}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
