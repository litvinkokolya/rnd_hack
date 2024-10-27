import { useEffect, useState } from "react";
import styles from "./EvaluationModal.module.scss";
import Image from "next/image";
import CloseIcon from "@/public/images/close-icon.svg";
import { useRouter } from "next/router";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Fancybox } from "@fancyapps/ui";
import Confetti from "react-confetti";
import { useMember } from "../../model/useEvaluationMember";
import { motion } from "framer-motion";

export const EvaluationModal = () => {
  const router = useRouter();
  const { evaluation, score } = router.query;
  const { memberPhotos } = useMember(Number(evaluation!));

  console.log(memberPhotos?.filter((item: any) => item.work.id == evaluation));

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(!!evaluation);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      Toolbar: false,
      Images: { zoom: false },
    });
  }, []);

  const handleCloseModal = () => {
    router.replace(router.pathname, undefined, { shallow: true });
    setEvaluationModalOpen(false);
  };

  const modalVariants = {
    hidden: { y: "-100%", opacity: 0, transition: { duration: 0.8 } },
    visible: { y: "0%", opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <div>
      {evaluationModalOpen && (
        <>
          <div onClick={handleCloseModal} className={styles.blur}></div>
          <motion.div
            className={styles.evaluation__modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            <button
              onClick={handleCloseModal}
              className={styles.evaluation__close}
            >
              <Image src={CloseIcon} alt="Close" />
            </button>
            <p className={styles.evaluation__modal_separation}>Успешно!</p>
            <ul className={styles.evaluation__list}>
              {memberPhotos
                ?.filter((item: any) => item.work.id == evaluation)
                ?.map((memberData) => (
                  <li
                    key={memberData.work.id}
                    className={styles.evaluation__item}
                  >
                    <a
                      data-fancybox
                      data-src={memberData.image}
                      href={memberData.image as string}
                      className={styles.member_photos__link}
                    >
                      <img
                        className={styles.evaluation__img}
                        src={memberData.image as string}
                        width={75}
                        height={75}
                      />
                    </a>
                  </li>
                ))}
            </ul>
            <p className={styles.evaluation__total}>
              Сумма баллов: <span>{score}</span>
            </p>
          </motion.div>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            tweenDuration={1000}
            wind={0.04}
            colors={[
              "#ffb6c1",
              "#ff80ab",
              "#ff4081",
              "#f50057",
              "#c51162",
              "#FF3E9B",
            ]}
          />
        </>
      )}
    </div>
  );
};
