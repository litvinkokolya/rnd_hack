import { IPhoto } from "../lib";
import { Dispatch, SetStateAction, ChangeEvent } from "react";

interface IUseFileChange {
  setSelectedFiles: Dispatch<SetStateAction<IPhoto[]>>;
}

export const useFileChange = ({ setSelectedFiles }: IUseFileChange) => {
  const handleFileChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      setSelectedFiles((prevSelectedFiles) =>
        prevSelectedFiles.map((selectedFile, i) =>
          i === index ? { ...selectedFile, photo: file! } : selectedFile
        )
      );
    };

  return { handleFileChange };
};
