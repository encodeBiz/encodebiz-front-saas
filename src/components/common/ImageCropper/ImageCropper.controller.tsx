import { useRef, useState } from "react";
import { centerCrop, convertToPixelCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";
import { useDebounceEffect } from "./useDebounceEffect";
import { canvasPreview } from "./canvasPreview";
import { useToast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";


function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: 'px',
        width: mediaWidth,
        height: mediaHeight
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}


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


export const useImageCropper = (onComplete: (file: File) => void, size: { w: number, h: number }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1)
  const { showToast } = useToast()
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const t = useTranslations()



  const [file, setFile] = useState<File>();
  const [aspect, setAspect] = useState<number | undefined>(size.w / size.h)

  function toggleAspect() {
    if (aspect) {
      setAspect(undefined)
    } else {
      setAspect(size.w / size.h)
      if (imgRef.current) {
        const { width, height } = imgRef.current
        const newCrop = centerAspectCrop(width, height, size.w / size.h)
        setCrop(newCrop)
        setCompletedCrop(convertToPixelCrop(newCrop, width, height))
      }
    }
  }

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const image = new Image();
      image.onload = function () {

        const minWidth = size.w
        const minHeigth = size.h
        const maxWidth = Math.floor(minWidth + (minWidth * 0.25))
        const maxHeigth = Math.floor(minHeigth + (minHeigth * 0.25))

        if (image.width >= minWidth && image.width <= maxWidth && image.height >= minHeigth && image.height <= maxHeigth) {
          setFile(file)
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            setImage(reader.result as any);
            setOpen(true);
          });
          reader.readAsDataURL(file);
        } else {
          handleClose()
          showToast(`${t('core.title.cropValidate1')} ${minWidth}x${minHeigth} ${t('core.title.cropValidate2')} ${maxWidth}x${maxHeigth}.`, 'error')
        }
      }
      image.src = URL.createObjectURL(file);

    }
  };

  const handleClose = () => {
    setOpen(false)
  }


  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return;
    setIsLoading(true);

    const croppedImage: any = await getCroppedImg(
      imgRef.current,
      completedCrop,
      file?.name
    );

    onComplete(croppedImage.file)
    setOpen(false);

    setIsLoading(false);

  };

  function onImageLoad() {
    if (aspect) {
      setCrop(centerAspectCrop(size.w, size.h, aspect))
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale
        )
      }
    },
    100,
    [completedCrop, scale],
  )

  return {
    open, image, aspect, crop, setCrop, toggleAspect, setCompletedCrop, completedCrop, isLoading, handleFileChange, imgRef, handleClose, handleCrop,
    scale, setScale, file, onImageLoad
  }
}

