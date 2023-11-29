import { fabric } from 'fabric';
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { deleteItem } from './utils/localstorage';
export async function getPageCanvas(
  pdfDoc: PDFDocumentProxy,
  currentPage: number,
  viewer?: HTMLDivElement
) {
  try {
    const page = await pdfDoc.getPage(currentPage);
    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d')!;

    let viewport = page.getViewport({ scale: 1 });

    const scale =
      (viewer?.clientWidth || document.documentElement.clientWidth) /
      viewport.width;

    viewport = page.getViewport({ scale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    return canvas;
  } catch (error) {
    throw new Error();
  }
}

const BASE64_MARKER = ';base64,';

export function convertDataURIToBinary(dataURI: string) {
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

export function renderDeleteIcon() {
  const img = document.createElement('img');
  img.src = deleteIcon;

  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'blue';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: function (eventData, transform) {
      const target: any = transform.target;
      const canvas = target.canvas;
      const id = target.get('id');
      canvas?.remove(target);
      deleteItem(id);
      canvas?.requestRenderAll();
      return false;
    },
    render: function (ctx, left, top, styleOverride, fabricObject) {
      const size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    },
  });
}
