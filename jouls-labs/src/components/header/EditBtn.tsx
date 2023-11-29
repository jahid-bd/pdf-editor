type Props = {
  icon: () => JSX.Element;
  onDragStart: any;
  text: string;
};

const EditBtn = ({ icon, onDragStart, text }: Props) => {
  return (
    <button
      className="flex  justify-center items-center gap-[2px] px-4  py-[5px] bg-white/20 rounded-3xl transition-all duration-300 hover:bg-white/30"
      onDragStart={onDragStart}
      draggable
      title="Drag to work"
    >
      {icon()}
      <span className="">{text}</span>
    </button>
  );
};

export default EditBtn;
