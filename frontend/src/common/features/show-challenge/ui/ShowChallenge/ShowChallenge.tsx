import { AnimatePresence, motion } from "framer-motion";
import styles from "./ShowChallenge.module.scss";
import { Button } from "common/shared/ui/button";
import { useMutation } from "react-query";
import { setMember } from "common/shared/api/members";
import { useAtom } from "jotai";
import { champAtom, userAtom } from "store";
import { toast } from "react-toast";
import { useRouter } from "next/router";
import { setWork } from "common/shared/api/works";
import { patchChallenege } from "common/shared/api/champs";

export const ShowChallenge = ({
  isOpen,
  onClose,
  champ,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  champ: any;
  refetch: () => void;
}) => {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [_selectedChamp, setSelectedChamp] = useAtom(champAtom);

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
    const data = await setMemberChallenge({
      user: user?.id,
      event: champ.id,
    });
    const work = await setWork({ event: champ.id, member: data?.id });
    //@ts-ignore
    setUser({ ...user!, memberId: data.id, workId: work.data.id });
    router.push("./profile");
    setSelectedChamp(champ);
  });

  const stopChallengeMutation = useMutation(["setMember"], async () => {
    await patchChallenege(champ.id, { is_finished: true });
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
                  {champ.tags.map((item: any, index: number) => {
                    return (
                      <span>
                        {" "}
                        {item}
                        {index === champ.tags.length - 1 ? "." : ", "}
                      </span>
                    );
                  })}
                </label>
                <label>
                  Критерии:{" "}
                  {champ.criteries.map((item: any, index: number) => {
                    return (
                      <span>
                        {" "}
                        {item}
                        {index === champ.criteries.length - 1 ? "." : ", "}
                      </span>
                    );
                  })}
                </label>
                <label>
                  Кол-во фото: <span>{champ.count_photo}</span>
                </label>
                <label>
                  Дата создания: <span>{champ.created_date}</span>
                </label>

                <label>
                  Дата окончания: <span>{champ.end_date}</span>
                </label>
                <label>
                  Макс. кол-во участников: <span>{champ.max_members}</span>
                </label>
              </div>
              <div className={styles.champ}>
                <label>
                  Возможность добавить видео:{" "}
                  <span>{champ.is_video ? "Да" : "Нет"}</span>
                </label>
                <label>
                  Приз: <span>{champ.prize}</span>
                </label>
                <label>
                  Достижение участника:{" "}
                  <span className={styles.achievement}>
                    {champ?.achievement_member?.name}
                    <img
                      className={styles.img}
                      src={champ?.achievement_member?.image}
                    />
                  </span>
                </label>
                <label>
                  Достижение победителя:{" "}
                  <span className={styles.achievement}>
                    {champ?.achievement_winner?.name}
                    <img
                      className={styles.img}
                      src={champ?.achievement_winner?.image}
                    />
                  </span>
                </label>
                <label>
                  Закончен: <span>{champ.is_finished ? "Да" : "Нет"}</span>
                </label>
              </div>
            </div>
            {!champ.is_finished ? (
              <>
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
                  <Button
                    onClick={() => {
                      loginUserMutation.mutate();
                    }}
                  >
                    Принять участие
                  </Button>
                )}
                {champ.created_mine && (
                  <Button
                    onClick={async () => {
                      if (confirm("Вы точно хотите завершить челлендж?")) {
                        await stopChallengeMutation.mutateAsync();
                        toast.success("Челлендж успешно завершен!");
                        onClose();
                        refetch();
                      }
                    }}
                  >
                    Завершить челлендж
                  </Button>
                )}
              </>
            ) : (
              <p>Челлендж закончен!</p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
