import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { storage } from "../initializeApp";

export const uploadFile = async (
  file: File,
  path: string,
  onProgress: Function
): Promise<string> => {
  // Crea una referencia al archivo en Firebase Storage
  const uniquePath = path.split("/");
  uniquePath[uniquePath.length - 1] = `${Date.now()}_${
    uniquePath[uniquePath.length - 1]
  }`;

 
  const storageRef = ref(storage, uniquePath.join("/"));
  try {
    // Sube el archivo
    //const snapshot = await uploadBytes(storageRef, file);
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);
    await UploadImage(uploadTask, onProgress);

    // Devuelve la URL de descarga
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw new Error("Error al subir el archivo");
  }
};

// Método para obtener la URL de un archivo existente
export const getFileURL = async (path: string): Promise<string> => {
  const fileRef = ref(storage, path);

  try {
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error al obtener la URL del archivo:", error);
    throw new Error("Error al obtener la URL del archivo");
  }
};

async function UploadImage(uploadTask: UploadTask, onProgress: Function) {
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      function (snapshot: any) {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (typeof onProgress === "function") {
          onProgress(progress);
        }
      },
      function (error: any) {
        console.error("Error al subir el archivo:", error);
        reject(error);
      },
      function () {
        getDownloadURL(uploadTask.snapshot.ref).then(function (downloadURL) {
          resolve(downloadURL);
        });
      }
    );
  });
}

export function dataURLtoFile(
  dataurl: string,
  filename: string = "generateFile"
) {
  let arr: any = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
