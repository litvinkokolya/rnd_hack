import { AnimatePresence, motion } from "framer-motion";
import styles from "./ShowChallenge.module.scss";
import { Button } from "common/shared/ui/button";
import { useMutation } from "react-query";
import { setMember } from "common/shared/api/members";
import { useAtomValue } from "jotai";
import { userAtom } from "store";
import { toast } from "react-toast";
import { useRouter } from "next/router";

export const ShowChallenge = ({
  isOpen,
  onClose,
  champ,
}: {
  isOpen: boolean;
  onClose: () => void;
  champ: any;
}) => {
  const router = useRouter();
  const user = useAtomValue(userAtom);

  isOpen && console.log(champ);

  const setMemberChallenge = async (params: any) => {
    try {
      const { data } = await setMember(params);
      toast.success("Вы успешно приняли участие!");
      onClose();
      return data;
    } catch (error) {
      // Обработка ошибки
      toast.error("Непредвиденная ошибка!");
      console.error(error);
      throw error;
    }
  };

  const loginUserMutation = useMutation(["setMember"], async () => {
    return await setMemberChallenge({
      user: user?.id,
      event: champ.id,
    });
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className={styles.blur} onClick={onClose}></div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className={styles.modal_exit}
          >
            <img src={champ.image} alt={champ.name} />
            <div>
              <div className={styles.champ}>
                <label>
                  Название: <h1>{champ.name}</h1>
                </label>
                <label>
                  Описание: <h1>{champ.description}</h1>
                </label>
                <label>
                  Тэги:{" "}
                  {champ.tags.map((item: any) => {
                    return <span>{item}</span>;
                  })}
                </label>
                <label>
                  Кол-во фото: <span>{champ.count_photo}</span>
                </label>
                <label>
                  Дата создания: <span>{champ.created_date}</span>
                </label>
              </div>
              <div className={styles.champ}>
                <label>
                  Дата окончания: <span>{champ.end_date}</span>
                </label>
                <label>
                  Макс. кол-во участников: <span>{champ.max_members}</span>
                </label>
                <label>
                  Возможность добавить видео:{" "}
                  <span>{champ.is_video ? "Да" : "Нет"}</span>
                </label>
                <label>
                  Приз: <span>{champ.prize}</span>
                </label>
                <label>
                  Достижение участника: <span>{champ.achievement_member}</span>
                </label>
                <label>
                  Достижение победителя: <span>{champ.achievement_winner}</span>
                </label>
                <label>
                  Закончен: <span>{champ.is_finished ? "Да" : "Нет"}</span>
                </label>
              </div>
            </div>
            {champ.is_participation ? (
              <>
                <p>Вы являетесь участником!</p>
                <Button
                  onClick={() => {
                    setSelectedChamp(champ);
                    router.push("./profile");
                  }}
                >
                  Перейти в челлендж
                </Button>
              </>
            ) : (
              <Button onClick={() => loginUserMutation.mutate()}>
                Принять участие
              </Button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
