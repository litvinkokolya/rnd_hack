import styles from "./Avatar.module.scss";
import { IUser } from "common/shared/types";
import cn from "classnames";
import { BASE_API_URL } from "common/shared/api/endpoints";

interface IAvatarProps {
  edit?: boolean;
  user: IUser;
}

const Avatar = ({ edit = false, user }: IAvatarProps) => {
  const avatarSrc = user?.image;

  return (
    <>
      <div
        className={cn(
          { [styles.user_avatar_edit]: edit },
          styles.user_avatar_box
        )}
      >
        {avatarSrc && (
          <img
            src={`${BASE_API_URL}${avatarSrc}`}
            className={styles.user_avatar}
            alt={`${user?.first_name} ${user?.last_name}`}
            width={150}
            height={150}
          />
        )}
      </div>
    </>
  );
};

export default Avatar;
