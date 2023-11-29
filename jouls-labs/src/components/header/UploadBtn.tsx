import PDFIcon from '../../assets/svg-icons/pdf-icon';

type Props = {
  trigerModal: (value: 'open' | 'close') => void;
};

const UploadBtn = ({ trigerModal }: Props) => {
  return (
    <button
      className="uppercase text-sm font-semibold py-[4px] px-3 rounded-2xl transition-all duration-200  hover:bg-white/20 flex items-center gap-2 "
      onClick={() => trigerModal('open')}
    >
      <span>Upload</span>
      <PDFIcon />
    </button>
  );
};

export default UploadBtn;
