import { jsPDF } from 'jspdf';
import { useState } from 'react';
import CloseIcon from '../../assets/svg-icons/close-icon';
import ImgIcon from '../../assets/svg-icons/img-icon';
import MenuIcon from '../../assets/svg-icons/menu-icon';
import TextIcon from '../../assets/svg-icons/text-icon';
import DownloadBtn from './DownloadBtn';
import EditBtn from './EditBtn';
import UploadBtn from './UploadBtn';
import Zoom from './Zoom';

type Props = {
  dataTransfer: (t: string) => (e: any) => any;
  trigerModal: (value: 'open' | 'close') => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  hasFiles: boolean;
  totalPages: number;
};

const Header = ({
  dataTransfer,
  trigerModal,
  zoom,
  setZoom,
  hasFiles,
}: Props) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (value: 'open' | 'close') => {
    value === 'open' ? setShowMenu(true) : setShowMenu(false);
  };

  const handleDownload = () => {
    const pdf = new jsPDF('p', 'px', 'a4');

    // Find the maximum pageIndex dynamically
    let maxPageIndex = 0;
    while ((window as any)[`fabric_page_${maxPageIndex + 1}`]) {
      maxPageIndex++;
    }

    for (let pageIndex = 1; pageIndex <= maxPageIndex; pageIndex++) {
      const fabricPage = (window as any)[`fabric_page_${pageIndex}`];

      const width = fabricPage.width;
      const height = fabricPage.height;
      const imgData = fabricPage.toDataURL('image/jpeg', 1.0);

      pdf.addPage([width, height], 'portrait');

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    }

    pdf.save('download.pdf');
    toggleMenu('close');
  };

  return (
    <header className="h-[80px] bg-primary text-white w-full fixed top-0 left-0 z-20 md:px-5 px-4 flex items-center justify-between">
      <div className="flex items-center">
        {/* logo */}
        <div className="mr-5">
          <h2 className="md:text-xl text-lg font-semibold">PDF Editor</h2>
        </div>
        {/* Upload */}
        <div className="max-lg:hidden">
          <UploadBtn trigerModal={trigerModal} />
        </div>
      </div>

      {/* Edit */}
      {hasFiles ? (
        <>
          <div className="flex items-center justify-center md:gap-5 gap-3 max-lg:hidden  ">
            <EditBtn
              icon={TextIcon}
              onDragStart={dataTransfer('text')}
              text="Add Text"
            />
            <EditBtn
              icon={ImgIcon}
              onDragStart={dataTransfer('image')}
              text="Add Image"
            />
          </div>
          <div className="flex items-center gap-4 max-lg:hidden">
            {/* Zoom */}
            <Zoom zoom={zoom} setZoom={setZoom} />
            {/* download */}
            <DownloadBtn onClick={handleDownload} />
          </div>{' '}
        </>
      ) : null}

      {/* Menu Icon */}
      <div className="lg:hidden">
        <button onClick={() => toggleMenu('open')}>
          <MenuIcon />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu ? (
        <div className="h-screen px-3 py-5 fixed top-0 right-0  w-1/2 b bg-primary text-white shadow-lg lg:hidden">
          <div className="flex w-full h-full flex-col gap-4">
            {/* close */}
            <div className="text-left">
              <button onClick={() => toggleMenu('close')}>
                <CloseIcon />
              </button>
            </div>
            {/* Upload */}
            <div className="" onClick={() => toggleMenu('close')}>
              <UploadBtn trigerModal={trigerModal} />
            </div>
            {/* Edit */}

            <EditBtn
              icon={TextIcon}
              onDragStart={() => dataTransfer('text')}
              text="Add Text"
            />

            <EditBtn
              icon={ImgIcon}
              onDragStart={() => dataTransfer('image')}
              text="Add Image"
            />
          </div>

          {/* Zoom */}
          <div className="absolute w-full pr-4  mb-5 bottom-0 flex flex-col justify-center gap-4">
            {/* download */}
            <Zoom zoom={zoom} setZoom={setZoom} />

            <DownloadBtn onClick={handleDownload} />
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
