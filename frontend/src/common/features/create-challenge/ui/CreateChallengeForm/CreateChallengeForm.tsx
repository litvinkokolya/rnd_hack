import { Controller, useForm } from "react-hook-form";
import styles from "./CreateChallengeForm.module.scss";
import { Input } from "common/shared/ui/input";
import { Textarea } from "common/shared/ui/textarea";
import { WithContext as ReactTags } from "react-tag-input";
import { Tag } from "react-tag-input/types/components/SingleTag";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "common/shared/ui/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createChallenge as createChallengeRequest } from "common/shared/api/champs";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toast";
import { getAchievements } from "common/shared/api/assessments";
import Select from "react-select";

const validationSchema = yup.object().shape({
  name: yup.string().required("Заголовок челленджа обязателен"),
  description: yup.string().required("Описание челленджа обязательно"),
  forWho: yup.string().required("Выберите для себя или для группы"),
  photoCount: yup.string().required("Количество фото обязательно"),
  video: yup.string().required("Выберите да или нет"),
  image: yup.mixed().required("Изображение челленджа обязательно"),
  maxParticipants: yup.string().required("Изображение челленджа обязательно"),
  participantAchievement: yup.mixed(),
  participantPrize: yup.mixed(),
  winnerAchievement: yup.mixed(),
  endDate: yup.mixed().required("Дата окончания челленджа обязательна"),
  winnerPrize: yup.mixed(),
});

export const CreateChallengeForm = ({
  onClose,
  refetch,
}: {
  onClose: () => void;
  refetch: () => void;
}) => {
  const { data } = useQuery("master", () => getAchievements());

  const createChallenge = async (params: any) => {
    try {
      const { data } = await createChallengeRequest(params);
      return data;
    } catch (error) {
      // Обработка ошибки
      toast.error("Непредвиденная ошибка!");
      console.error(error);
      throw error;
    }
  };

  const createChallengeMutation = useMutation(
    ["challenge"],
    async (data: any) => {
      return await createChallenge(data);
    }
  );

  const onSubmit = async (data: any) => {
    console.log(data);
    const params = {
      ...data,
      tags: challengeTags.map((tag) => tag.id),
      criteries: evaluationCriteriaTags.map((tag) => tag.id),
      end_date: data.endDate ? data.endDate.toISOString().split("T")[0] : null,
      is_video: data.video === "dontVideo" ? false : true,
      count_photo: data.photoCount,
      for_whom: data.forWho,
      max_members: data.maxParticipants,
      achievement_winner: data.winnerAchievement.value,
      achievement_member: data.participantAchievement.value,
    };
    const formData = new FormData();
    formData.append("image", params.image);

    Object.keys(params).forEach((key) => {
      if (key !== "image") {
        if (Array.isArray(params[key])) {
          params[key].forEach((value) => {
            formData.append(key, value);
          });
        } else {
          formData.append(key, params[key]);
        }
      }
    });

    await createChallengeMutation.mutateAsync(formData);
    onClose();
    refetch();
    toast.success("Челлендж успешно создан!");
  };

  const [challengeTags, setChallengeTags] = useState<Array<Tag>>([]);
  const [evaluationCriteriaTags, setEvaluationCriteriaTags] = useState<
    Array<Tag>
  >([]);

  // Функции для управления тегами
  const handleDeleteChallengeTag = (index: number) => {
    setChallengeTags(challengeTags.filter((_, i) => i !== index));
  };

  const onUpdateChallengeTag = (index: number, newTag: Tag) => {
    const updatedTags = [...challengeTags];
    updatedTags.splice(index, 1, newTag);
    setChallengeTags(updatedTags);
  };

  const handleAddChallengeTag = (tag: Tag) => {
    setChallengeTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const onClearAllChallengeTags = () => {
    setChallengeTags([]);
  };

  // Функции для управления критериями оценки
  const handleDeleteEvaluationCriteriaTag = (index: number) => {
    setEvaluationCriteriaTags(
      evaluationCriteriaTags.filter((_, i) => i !== index)
    );
  };

  const onUpdateEvaluationCriteriaTag = (index: number, newTag: Tag) => {
    const updatedTags = [...evaluationCriteriaTags];
    updatedTags.splice(index, 1, newTag);
    setEvaluationCriteriaTags(updatedTags);
  };

  const handleAddEvaluationCriteriaTag = (tag: Tag) => {
    setEvaluationCriteriaTags((prevTags) => {
      return [...prevTags, tag];
    });
  };

  const onClearAllEvaluationCriteriaTags = () => {
    setEvaluationCriteriaTags([]);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className={styles.modal}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Заголовок челленджа: <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  maxLength={255}
                  minLength={2}
                  autofocus={!field.value}
                  type="text"
                  placeholder="Название"
                  {...field}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Описание челленджа: <span style={{ color: "red" }}>*</span>
                </label>
                <Textarea
                  maxLength={1024}
                  minLength={3}
                  placeholder="Опишите челлендж"
                  {...field}
                />
              </>
            )}
          />
          <label className={styles.label}>Теги челленджа:</label>
          <ReactTags
            tags={challengeTags}
            inputFieldPosition="top"
            handleDelete={handleDeleteChallengeTag}
            handleAddition={handleAddChallengeTag}
            onTagUpdate={onUpdateChallengeTag}
            editable
            clearAll
            onClearAll={onClearAllChallengeTags}
            maxTags={15}
            allowAdditionFromPaste
            placeholder="Введите тег и нажмите - Enter"
          />
          <Controller
            control={control}
            name="forWho"
            defaultValue={"1"}
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Для себя/для группы: <span style={{ color: "red" }}>*</span>
                </label>
                <div>
                  <input
                    type="radio"
                    value="1"
                    onChange={field.onChange}
                    checked={field.value === "1"}
                  />
                  <label>Для себя</label>
                  <br />
                  <input
                    type="radio"
                    value="2"
                    onChange={field.onChange}
                    checked={field.value === "2"}
                  />
                  <label>Для группы людей</label>
                </div>
              </>
            )}
          />
          <Controller
            control={control}
            name="maxParticipants"
            defaultValue={"1"}
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Максимальное количество участников:{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  autofocus
                  minLength={1}
                  type="number"
                  maxLength={2}
                  {...field}
                />
              </>
            )}
          />
          <Controller
            control={control}
            defaultValue={"1"}
            name="photoCount"
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Количество фото: <span style={{ color: "red" }}>*</span>
                </label>
                <div>
                  <input
                    type="radio"
                    value="1"
                    checked={field.value === "1"}
                    onChange={field.onChange}
                  />
                  <label>1</label>
                  <br />
                  <input
                    type="radio"
                    value="2"
                    checked={field.value === "2"}
                    onChange={field.onChange}
                  />
                  <label>2</label>
                  <br />
                  <input
                    type="radio"
                    value="3"
                    checked={field.value === "3"}
                    onChange={field.onChange}
                  />
                  <label>3</label>
                  <br />
                  <input
                    type="radio"
                    value="4"
                    checked={field.value === "4"}
                    onChange={field.onChange}
                  />
                  <label>4</label>
                </div>
              </>
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="video"
            defaultValue={"dontVideo"}
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Видео: <span style={{ color: "red" }}>*</span>
                </label>
                <div>
                  <input
                    type="radio"
                    value="withVideo"
                    onChange={field.onChange}
                    checked={field.value === "withVideo"}
                  />
                  <label>Да</label>
                  <br />
                  <input
                    type="radio"
                    value="dontVideo"
                    onChange={field.onChange}
                    checked={field.value === "dontVideo"}
                  />
                  <label>Нет</label>
                </div>
              </>
            )}
          />
          <label className={styles.label}>
            Критерии оценки: <span style={{ color: "red" }}>*</span>
          </label>
          <ReactTags
            tags={evaluationCriteriaTags}
            inputFieldPosition="top"
            handleDelete={handleDeleteEvaluationCriteriaTag}
            handleAddition={handleAddEvaluationCriteriaTag}
            onTagUpdate={onUpdateEvaluationCriteriaTag}
            editable
            clearAll
            onClearAll={onClearAllEvaluationCriteriaTags}
            allowAdditionFromPaste
            maxTags={15}
            placeholder="Введите критерий и нажмите - Enter"
          />
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Дата окончания: <span style={{ color: "red" }}>*</span>
                </label>
                <DatePicker
                  //@ts-ignore
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="yyyy-MM-dd"
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <>
                <label className={styles.label}>
                  Изображение челленджа: <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.mpo"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    field.onChange(file);
                  }}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="winnerPrize"
            render={({ field }) => (
              <>
                <label className={styles.label}>Приз победителя:</label>
                <Input
                  maxLength={255}
                  minLength={2}
                  autofocus={!field.value}
                  type="text"
                  placeholder="Введите приз победителя"
                  {...field}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="participantPrize"
            render={({ field }) => (
              <>
                <label className={styles.label}>Приз участника:</label>
                <Input
                  maxLength={255}
                  minLength={2}
                  autofocus={!field.value}
                  type="text"
                  placeholder="Введите приз участника"
                  {...field}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="winnerAchievement"
            render={({ field }) => (
              <>
                <label className={styles.label}>Достижение победителя:</label>
                <Select
                  placeholder="Выберите достижение победителя"
                  {...field}
                  // @ts-ignore
                  options={data?.data?.map((item) => ({
                    value: item.id,
                    label: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "20px", marginRight: "10px" }}
                        />
                        {item.name}
                      </div>
                    ),
                  }))}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="participantAchievement"
            render={({ field }) => (
              <>
                <label className={styles.label}>Достижение участника:</label>
                <Select
                  placeholder="Выберите достижение участника"
                  {...field}
                  // @ts-ignore
                  options={data?.data?.map((item) => ({
                    value: item.id,
                    label: (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "20px", marginRight: "10px" }}
                        />
                        {item.name}
                      </div>
                    ),
                  }))}
                />
              </>
            )}
          />
        </div>
        {Object.keys(errors).length > 0 && (
          <div className={styles.error}>Заполните обязательные поля!</div>
        )}
        <Button type="submit">Создать челлендж</Button>
      </form>
    </div>
  );
};
