import { useRef, useState } from "react";


const getCroppedImg = (image: any, crop: any, fileName: any) => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx: any = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    Math.floor(crop.width),
    Math.floor(crop.height)
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob: any) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      blob.name = fileName;
      const fileUrl = URL.createObjectURL(blob);
      resolve({ file: blob, url: fileUrl });
    }, 'image/png', 0.9);
  });
};


export const useImageCropper = (onComplete: (file: File) => void) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState<any>({ width: 80, height: 80 });
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef: any = useRef(null);
  const [zoom, setZoom] = useState(1);
 const [file, setFile] = useState<File>();
  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as any);
        setOpen(true);
        setZoom(1);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setOpen(false)
  }


  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsLoading(true);

    try {
      const croppedImage: any = await getCroppedImg(
        imgRef.current,
        completedCrop,
        'cropped.jpg'
      );
      console.log(croppedImage);      
      onComplete(croppedImage.file)
      
      setOpen(false);
    } catch (err) {
      console.error('Error cropping image:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 1));
  };

  const handleZoomChange = (event: any, newValue: any) => {
    setZoom(newValue);
  };

  return {
    open, image, crop, setCrop, setCompletedCrop, completedCrop, isLoading, handleFileChange, imgRef, handleClose, handleCrop,
    zoom, handleZoomIn, handleZoomOut, handleZoomChange,file
  }
}

