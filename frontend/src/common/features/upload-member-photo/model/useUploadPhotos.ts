import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { IPhoto } from "../lib/types";
import { setMemberPhotos } from "common/shared/api/members";
import { toast } from "react-toast";
import { userAtom } from "store";
import { useAtomValue } from "jotai";

interface IUseUploadPhotos {
  selectedFiles: IPhoto[];
}

export const useUploadPhotos = ({ selectedFiles }: IUseUploadPhotos) => {
  const router = useRouter();
  const user = useAtomValue(userAtom);

  const uploadPhotos = async () => {
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("image", file.photo as File);
        formData.append("work", user?.workId?.toString() ?? "");
        await setMemberPhotos(formData);
      }
      router.replace("/profile");
    } catch (error) {
      toast.error("Непредвиденная ошибка!");
      console.error(error);
    }
  };

  const mutation = useMutation(["memberPhotos"], uploadPhotos);

  return { mutation, isLoading: mutation.isLoading };
};
