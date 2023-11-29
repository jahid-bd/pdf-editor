/* eslint-disable @typescript-eslint/no-unused-vars */
import { fabric } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import FileUploadModal from './components/FileUploadModal';
import Header from './components/header';
import { convertDataURIToBinary, renderDeleteIcon } from './utils';
import {
  getItems,
  getItemsByPage,
  injectItem,
  updateItem,
} from './utils/localstorage';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// const PDF_URL = 'https://arxiv.org/pdf/1708.08021.pdf';

renderDeleteIcon();

function App() {
  const [loadedPdf, setLoadedPdf] = useState<PDFDocumentProxy | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [hasFileUploaded, setHasFileUploaded] = useState(false);
  const [zoom, setZoom] = useState(90);

  // file upload triger
  const [showModal, setShowModal] = useState<boolean>(false);

  const trigerModal = (value: 'open' | 'close') => {
    value === 'open' ? setShowModal(true) : setShowModal(false);
  };

  // uploaded file
  const [files, setFiles] = useState<(File | string)[]>(() => {
    return getItems('pdfs') || [];
  });
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  let fabricPageIndex = 1;

  const handleUploadFile = () => {
    // trigerModal('close');
    getRender();
    setHasFileUploaded(true);
    window.location.reload();
  };

  function renderPages(pdf: any) {
    if (!pdf) return;

    // Loop through all pages of the PDF and render each one
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      renderPage(pdf, pageNum);
    }
  }

  function renderPage(pdf: any, pageNum: number) {
    pdf.getPage(pageNum).then((page: any) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.setAttribute('page-num', String(pageNum));

      let viewport = page.getViewport({ scale: 1, rotate: 0 }); // Set rotate to 0

      let scale =
        (viewerRef.current?.clientWidth ||
          document.documentElement.clientWidth) / viewport.width;

      scale = (scale / 100) * zoom;
      viewport = page.getViewport({ scale });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      page.render({ canvasContext: context, viewport }).promise?.then(() => {
        const wrapper = document.createElement('div');
        wrapper.className = 'canvas-page';
        wrapper.setAttribute('data-page', String(pageNum));
        const canvasDocument = document.createElement('canvas');
        canvasDocument.setAttribute('data-page', String(pageNum));
        wrapper.appendChild(canvasDocument);
        viewerRef.current?.appendChild(wrapper);

        const fabricCanvas = new fabric.Canvas(canvasDocument, {
          height: viewport.height,
          width: viewport.width,
          backgroundColor: '#e5e5e5',
        });

        // only jpeg is supported by jsPDF
        wrapper.ondrop = (e: any) => {
          if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
          }
          const type = e.dataTransfer.getData('type');
          if (type === 'text') {
            const sampleText = 'Sample Text';
            const text = new fabric.IText(sampleText, {
              left: e.layerX,
              top: e.layerY,
              editable: true,
              originX: 'center',
              originY: 'center',
              fontFamily: 'sans-serif',
            });
            const _id = uuidv4();
            (text as any).set('id', _id);
            injectItem({
              page: String(pageNum),
              id: _id,
              type: 'text',
              x: e.layerX,
              y: e.layerY,
              height: text.height,
              width: text.width,
              scaleX: text.scaleX,
              scaleY: text.scaleY,
              text: sampleText,
            });

            fabricCanvas.add(text);
            fabricCanvas.requestRenderAll();
          }

          if (type === 'image') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = true;
            input.click();
            input.addEventListener('change', (ie: any) => {
              const files = ie.target.files;
              for (let i = 0; i < files.length; i++) {
                const file: File = files.item(i);

                const image = new Image();
                image.src = URL.createObjectURL(file);
                image.onload = function () {
                  const img = new fabric.Image(image, {
                    height: image.height,
                    width: image.width,
                    left: e.layerX,
                    top: e.layerY,
                    originX: 'center',
                    originY: 'center',
                  });
                  const _id = uuidv4();
                  (img as any).set('id', _id);

                  injectItem({
                    page: String(pageNum),
                    id: _id,
                    type: 'image',
                    x: e.layerX,
                    y: e.layerY,
                    height: img.height,
                    width: img.width,
                    scaleX: img.scaleX,
                    scaleY: img.scaleY,
                    src: img.toDataURL({ format: 'image/png' }),
                  });
                  console.log(img);
                  fabricCanvas.add(img);
                };
              }
              fabricCanvas.requestRenderAll();
            });
          }
        };

        wrapper.ondragover = (e: any) => {
          if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
          }
          if (e.dataTransfer?.dropEffect) {
            e.dataTransfer.dropEffect = 'copy';
          }
          return false;
        };

        // Add a unique identifier for each fabricCanvas instance
        (window as any)[`fabric_page_${fabricPageIndex}`] = fabricCanvas;
        fabricPageIndex += 1;

        const image = new fabric.Image(canvas, {
          selectable: false,
        });

        fabricCanvas.on('object:modified', (e: any) => {
          const id = e.target?.get('id' as any);
          const type = e.target?.get('type');
          if (type == 'i-text') {
            updateItem(id, {
              x: e.target?.left,
              y: e.target?.top,
              scaleX: e.target?.scaleX,
              scaleY: e.target?.scaleY,
              height: e.target?.height,
              width: e.target?.width,
              text: e.target?.get('text'),
            });
          }
          if (type == 'image') {
            updateItem(id, {
              x: e.target?.left,
              y: e.target?.top,
              scaleX: e.target?.scaleX,
              scaleY: e.target?.scaleY,
              height: e.target?.height,
              width: e.target?.width,
            });
          }
          console.log(e.target);
        });

        fabricCanvas.add(image);
        const getItems = getItemsByPage(String(pageNum));
        const items = generateItem(getItems || []);

        items.forEach((v: any) => {
          fabricCanvas.add(v);
        });
      });
    });
  }

  const generateItem = (items: any[]) => {
    return items
      .map((v) => {
        if (v.type === 'image') {
          const image = new Image();
          image.src = v.src;
          const img = new fabric.Image(image, {
            height: v.height,
            width: v.width,
            left: v.x,
            top: v.y,
            originX: 'center',
            originY: 'center',
            scaleX: v.scaleX,
            scaleY: v.scaleY,
          });
          (img as any).set('id', v.id);
          return img;
        }
        if (v.type == 'text') {
          const text = new fabric.IText(v.text, {
            left: v.x,
            top: v.y,
            editable: true,
            originX: 'center',
            originY: 'center',
            fontFamily: 'sans-serif',
            scaleX: v.scaleX,
            scaleY: v.scaleY,
          });
          (text as any).set('id', v.id);
          return text;
        }

        return null;
      })
      .filter((v: any) => v != null);
  };

  const getRender = async () => {
    try {
      const loadedPdfs = await Promise.all(
        files.map(
          (file) =>
            pdfjsLib.getDocument(
              file instanceof File
                ? URL.createObjectURL(file)
                : convertDataURIToBinary(file)
            ).promise
        )
      );
      // Set the main loadedPdf state to the first PDF
      setLoadedPdf(loadedPdfs[0]);

      // Render pages for each PDF file
      loadedPdfs.forEach((pdf) => {
        renderPages(pdf);
        setTotalPageCount((prevTotal) => prevTotal + pdf.numPages);
      });
    } catch (error) {
      console.error('Error loading PDFs:', error);
    }
  };

  useEffect(() => {
    const pdfs = getItems('pdfs');

    if (pdfs && pdfs.length > 0) {
      setHasFileUploaded(true);
      return;
    }
    trigerModal('open');
  }, []);

  useEffect(() => {
    if (files.length) {
      getRender();
    }

    return () => {
      loadedPdf && loadedPdf?.destroy();
      if (viewerRef.current?.innerHTML) {
        viewerRef.current.innerHTML = '';
      }
    };
  }, [zoom]);

  console.log(totalPageCount);

  const dataTransfer = (t: string) => (e: any) =>
    e.dataTransfer.setData('type', t);

  return (
    <>
      <Header
        dataTransfer={dataTransfer}
        trigerModal={trigerModal}
        zoom={zoom}
        setZoom={setZoom}
        hasFiles={hasFileUploaded}
        totalPages={totalPageCount}
      />
      {showModal ? (
        <FileUploadModal
          trigerModal={trigerModal}
          setFiles={(v: any) => setFiles(v)}
          handleUploadFile={handleUploadFile}
        />
      ) : null}

      {/* Canvas container */}
      <div
        className="mt-[80px] bg-secondary min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-5"
        ref={viewerRef}
        style={{ width: '100%' }}
      ></div>
    </>
  );
}

export default App;
