import { ChampCard, ChampCardSkeleton, IChamp } from "common/entities/champ";
import styles from "./Champs-list.module.scss";
import { AnimatePresence, motion } from "framer-motion";

export const ChampsList = ({
  disableChamps,
  isLoading,
  champsData,
  refetch,
}: {
  disableChamps: boolean;
  isLoading: boolean;
  champsData?: any;
  refetch: () => void;
}) => {
  if (isLoading) {
    return (
      <AnimatePresence>
        <div className={styles.champs__list}>
          <ChampCardSkeleton />
        </div>
      </AnimatePresence>
    );
  }

  if (!champsData) {
    return null;
  }

  return (
    <>
      <h3>Доступные Челленджи:</h3>
      <ul className={styles.champs__list}>
        {champsData?.data?.map((champ: IChamp, index: number) => {
          return (
            <>
              <motion.li
                key={champ.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ChampCard
                  refetch={refetch}
                  disableChamp={disableChamps}
                  champ={champ}
                />
              </motion.li>
            </>
          );
        })}
      </ul>
    </>
  );
};

export default ChampsList;
