import AvatarCropper from "common/features/avatar-cropper/ui/AvatarCropper/AvatarCropper";
import { Button } from "common/shared/ui/button";
import { Input } from "common/shared/ui/input";
import { Controller, useForm, useWatch } from "react-hook-form";
import styles from "./ProfileEditForm.module.scss";
import Avatar from "common/shared/ui/avatar/Avatar";
import { literalValidation } from "common/shared/helpers";
import { getMe, setUser } from "common/shared/api/users";
import { userAtom } from "store";
import { useAtomValue, useSetAtom } from "jotai";
import { useQuery } from "react-query";
import { ChampsList } from "common/widgets/champs-list";
import { Loader } from "common/shared/ui/loader";
import { FC, useEffect, useState } from "react";
import { IUser } from "common/shared/types";
import { useDebounce } from "../../model";
import { LogoutModal } from "common/features/logout/ui";
import { Textarea } from "common/shared/ui/textarea";
import { CreateChallengeModal } from "common/features/create-challenge/ui/CreateChallengeModal";
import { getChamps } from "common/shared/api/champs";

export const ProfileEditForm: FC = () => {
  const {
    data: champsData,
    isLoading,
    refetch,
  } = useQuery("champs", getChamps);
  const { control, setValue } = useForm();
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);
  const setStoreUser = useSetAtom(userAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useQuery(["user"], getMe, {
    onSuccess: (response) => {
      if (response?.data) {
        setStoreUser(response.data);
      }
    },

    enabled: !!user,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const name = useWatch({
    control,
    defaultValue: user?.first_name,
    name: "first_name",
  });

  const lastname = useWatch({
    control,
    defaultValue: user?.last_name,
    name: "last_name",
  });

  const uploadUser = async (userData: Partial<IUser>) => {
    try {
      try {
        const { data } = await setUser(userData);
        setStoreUser(data);
      } catch (e) {
        console.error(e);
      }
    } catch (error: any) {
      // Обработка ошибок
      console.error(error);
    }
  };

  const debouncedOnSubmitName = useDebounce(
    (type: "first_name" | "last_name" | "about_me", value: string) => {
      if (type === "about_me" && !!value) uploadUser({ [type]: value });
      if (!literalValidation(value) && !!value) {
        uploadUser({ [type]: value });
      }
    }
  );

  const handleNameChange =
    (type: "first_name" | "last_name" | "about_me") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "about_me") {
        setValue("about_me", e.target.value);
      } else {
        setValue(type, e.target.value.trim());
      }
      debouncedOnSubmitName(type, e.target.value);
    };

  return (
    <>
      {user && isClient ? (
        <div className={styles.profile__form}>
          <AvatarCropper>
            <Avatar edit user={user!} />
          </AvatarCropper>
          <div className={styles.profile__inputs}>
            <Controller
              control={control}
              defaultValue={user?.first_name}
              name="first_name"
              render={({ field }) => (
                <>
                  <label
                    className={`${styles.profile__validation} ${
                      literalValidation(name) &&
                      styles.profile__validation_error
                    }`}
                  >
                    Недопустимые символы
                  </label>
                  <Input
                    maxLength={255}
                    minLength={2}
                    autofocus={!field.value}
                    icon="profile"
                    type="text"
                    placeholder="Имя"
                    error={literalValidation(name)}
                    autoComplete="given-name"
                    {...field}
                    onChange={handleNameChange("first_name")}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue={user?.last_name}
              name="last_name"
              render={({ field }) => (
                <>
                  <Input
                    maxLength={255}
                    minLength={2}
                    icon="profile"
                    placeholder="Фамилия"
                    error={literalValidation(lastname)}
                    autoComplete="family-name"
                    {...field}
                    onChange={handleNameChange("last_name")}
                  />
                  <label
                    className={`${styles.profile__validation} ${
                      literalValidation(lastname) &&
                      styles.profile__validation_error
                    }`}
                  >
                    Недопустимые символы
                  </label>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue={user?.about_me}
              name="about_me"
              render={({ field }) => (
                <>
                  <label className={`${styles.profile__label}`}>Обо мне:</label>
                  <Textarea
                    maxLength={1024}
                    minLength={3}
                    placeholder="Расскажите о себе"
                    autoComplete="about_me"
                    {...field}
                    onChange={handleNameChange("about_me")}
                  />
                </>
              )}
            />
          </div>
          <p className={styles.create}>
            Создать челлендж -
            <Button onClick={() => setIsCreateModalOpen(true)}>➕</Button>
          </p>
          <CreateChallengeModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            refetch={refetch}
          />
          <ChampsList
            isLoading={isLoading}
            champsData={champsData}
            disableChamps={
              literalValidation(name) ||
              literalValidation(lastname) ||
              !name ||
              !lastname
            }
          />
          <Button
            className={styles.profile__button_exit}
            onClick={() => setIsModalOpen(true)}
          >
            Выйти из аккаунта
          </Button>
          <LogoutModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      ) : (
        <Loader fullPage />
      )}
    </>
  );
};
