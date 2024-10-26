import { AnimatePresence, motion } from "framer-motion";
import styles from "./CreateChallengeModal.module.scss";
import { CreateChallengeForm } from "../CreateChallengeForm";

export const CreateChallengeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
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
            <CreateChallengeForm onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
