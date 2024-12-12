const FilterButton = ({
  text,
  isActive,
  onClick,
  pickedGender,
}: {
  text: string;
  isActive: boolean;
  onClick: () => void;
  pickedGender?: boolean;
}) => {
  if (!pickedGender && text !== "Не важно") {
    return (
      <button
        type="button"
        className="text-filterButtonTextDisabled bg-filterButtonDisabled text-sm md:text-lg w-[180px] md:w-[250px] py-1 my-2 rounded-lg"
        onClick={onClick}
        disabled={true}
      >
        {text}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`${
        isActive
          ? "text-white bg-filterButtonActive"
          : "text-black bg-filterButton border-2 border-filterButtonBorder"
      } text-sm md:text-lg w-[180px] md:w-[250px] py-1 my-2 rounded-lg`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default FilterButton;
