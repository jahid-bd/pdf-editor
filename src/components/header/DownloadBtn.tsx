import DownloadIcon from '../../assets/svg-icons/download-icon';

type Props = {
  onClick: () => void;
};

const DownloadBtn = ({ onClick }: Props) => {
  return (
    <button
      className="flex  justify-center items-center gap-2 bg-white/20  px-[18px] py-2 rounded-3xl hover:bg-white/30"
      onClick={onClick}
    >
      <span className="text-sm font-semibold">Download</span>
      <DownloadIcon />
    </button>
  );
};

export default DownloadBtn;
