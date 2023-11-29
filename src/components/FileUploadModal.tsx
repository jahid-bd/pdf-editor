import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '../assets/svg-icons/close-icon';
import PDFIcon2 from '../assets/svg-icons/pdf-icon-2';
import { clearPdfStore, clearStore, storePdf } from '../utils/localstorage';

type Props = {
  trigerModal: (value: 'open' | 'close') => void;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleUploadFile: () => void;
};

const FileUploadModal = ({
  trigerModal,
  setFiles,
  handleUploadFile,
}: Props) => {
  // local state to preview selected files
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  // react dropzone hook to upload pdf from devices
  const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
    maxSize: 1048576,
    accept: {
      pdf: ['.pdf'],
    },
    onDrop: (acceptedFiles) => {
      setFiles([...acceptedFiles]);
      setPreviewFiles([...acceptedFiles]);
    },
  });

  // remove preview files
  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setPreviewFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  // handle upload button
  const handleUploadButton = () => {
    clearPdfStore();
    clearStore('item');
    handleUploadFile();

    previewFiles.forEach((v) => {
      const fileReader = new FileReader();

      // Onload of file read the file content
      fileReader.onload = function (fileLoadedEvent) {
        const base64 = fileLoadedEvent?.target?.result;
        // Print data in console
        storePdf(base64);
      };
      // Convert data to base64
      fileReader.readAsDataURL(v);
    });
    // storePdf(pdfArr);

    // empty preview state after upload
    setPreviewFiles([]);
    // setFiles([]);
  };

  // handle cancel button
  const handleCanelButton = () => {
    trigerModal('close');

    // empty preview state after upload
    setPreviewFiles([]);
    // setFiles([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity z-50 overflow-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white py-10 rounded-xl px-5 shadow-xl transform transition-all sm:max-w-lg sm:w-full ">
          {/* header */}
          <div className="text-center ">
            <h1 className="font-bold text-4xl mb-2">Upload File</h1>
            <p className="text-base font-medium text-gray-700">
              Choose a PDF file to upload and open in PDF Editor
            </p>
          </div>
          {/* body -> drop zone */}
          <div className="text-center">
            <div
              {...getRootProps({
                className:
                  'w-full p-3 flex items-center justify-center my-8 mx-auto min-h-[161px] max-w-[332px] border-dashed border-[4px] transition-all duration-300 border-[rgba(0,0,0,0.3)] hover:bg-black/20 hover:border-black dropzone',
              })}
            >
              {/* <span className="text-2xl ">Drop PDF Here</span> */}
              <p>
                {fileRejections.length ? (
                  <span className="text-red-500">
                    Sorry, only PDF files are allowed, and the file size should
                    be less than 1MB'
                  </span>
                ) : (
                  ` Drag 'n' drop a PDF file here, or click to select one (max
                  size: 1MB)`
                )}
              </p>
              <div>
                <input className="w-0" {...getInputProps} />
              </div>
            </div>
            <button
              className="rounded-md min-w-[150px] border-[2px] border-black/80 inline-flex items-center justify-center py-[6px] px-[10px] font-medium transition-all duration-300 text-sm text-black/80 hover:text-black/50 hover:border-black/50"
              onClick={open}
            >
              Choose file
            </button>
          </div>
          <div className="h-[2px]  w-[calc(100%+40px)] block bg-black/10 mt-7 -ml-5 "></div>
          {/* preview */}
          <aside className="mt-4">
            {previewFiles.map((file) => (
              <div className="flex  items-center gap-2 mt-1" key={file.name}>
                <div>
                  <PDFIcon2 />
                </div>
                <div>
                  <span>{file.name}</span>
                </div>
                <button onClick={() => removeFile(file.name)}>
                  <CloseIcon />
                </button>
              </div>
            ))}
          </aside>
          {/* footer */}
          <div className="flex items-center justify-center gap-8 mt-7">
            <button
              className={`text-sm font-bold uppercase rounded-[20px] transition-all duration-200 py-[5px] px-[10px] bg-primary text-white min-w-[136px] max-w-[200px] min-h-[40px] ${
                !previewFiles.length
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-primary_hover'
              }`}
              onClick={handleUploadButton}
              disabled={!previewFiles.length}
            >
              Upload
            </button>
            <button
              className="text-sm font-bold uppercase rounded-[20px] transition-all duration-200 py-[5px] px-[10px] border-black border-[2px] min-w-[136px] max-w-[200px] min-h-[40px] hover:border-black/60 hover:text-black/60"
              onClick={handleCanelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
