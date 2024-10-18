const FilterButton = ({
  text,
  isActive,
  onClick,
}: {
  text: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={`${
        isActive ? "text-white bg-[#304d78]" : "text-black bg-[#cccccc]"
      } text-lg w-[250px] py-1 my-2 rounded-lg`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default FilterButton;
