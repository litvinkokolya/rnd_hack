import { smsCall } from "common/shared/api/auth";
import { toast } from "react-toast";

export const loginUser = async (phone: string) => {
  try {
    const { data } = await smsCall(phone);
    return data;
  } catch (error) {
    toast.error("Непредвиденная ошибка!");
    // Обработка ошибки
    console.error(error);
    throw error;
  }
};
