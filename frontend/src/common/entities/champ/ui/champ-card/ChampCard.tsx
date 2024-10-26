import styles from "./ChampCard.module.scss";
import { ChampCardProps } from "../../lib";
import { useRouter } from "next/router";
import { USER_IS_UNKNOWN } from "common/shared/constants";
import { ShowChallenge } from "common/features/show-challenge/ui";
import { useState } from "react";

export const ChampCard = ({ champ, disableChamp }: ChampCardProps) => {
  const [openChallengeModal, setOpenChallengeModal] = useState(false);
  const router = useRouter();

  const isButtonDisabled = champ.role === USER_IS_UNKNOWN || disableChamp;

  return (
    <>
      {" "}
      <div className={styles.champs__item}>
        <button
          disabled={isButtonDisabled}
          type="button"
          className={`${styles.champs__btn}`}
          onClick={() => {
            setOpenChallengeModal(true);
            // setSelectedChamp(champ);
            // router.push("./profile");
          }}
        >
          <img width={280} height={90} src={champ?.image} alt={champ.name} />
        </button>
      </div>
      <ShowChallenge
        isOpen={openChallengeModal}
        onClose={() => setOpenChallengeModal(false)}
        champ={champ}
      />
    </>
  );
};

export default ChampCard;
