import { useState } from "react";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import styles from "./LoginForm.module.scss";
import { login, smsCall } from "api/auth";
import { MuiTelInput } from "mui-tel-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
      "Неверный формат номера телефона"
    ),
  code: yup.string().matches(/^\d{4}$/, "Код должен содержать 4 цифры"),
  password: yup.string().min(6, "Пароль должен содержать не менее 6 символов"),
});

export const LoginForm = () => {
  const [showCodeField, setShowCodeField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (!showPasswordField) {
      // Send SMS code to phone number
      await loginUser(data.phoneNumber);
      setShowCodeField(true);
    } else {
      // Verify SMS code and login
      await login({
        password: data.code,
        username: data.phoneNumber,
      });
    }
  };

  const loginUser = async (phone: string) => {
    try {
      const { data } = await smsCall(phone);
      return data;
    } catch (error) {
      // Обработка ошибки
      console.error(error);
      throw error;
    }
  };

  const handleSendSmsCode = async (data: any) => {
    // Send SMS code to phone number
    await loginUser(data.phoneNumber);
    setShowCodeField(true);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <MuiTelInput
            fullWidth
            defaultCountry="RU"
            onlyCountries={["RU"]}
            disableDropdown
            langOfCountryName="ru"
            label="Номер телефона"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            {...field}
          />
        )}
      />
      <Modal
        open={showCodeField || showPasswordField}
        onClose={() => {
          setShowCodeField(false);
          setShowPasswordField(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {showCodeField ? "Введите код из SMS" : "Введите пароль"}
          </Typography>
          {showCodeField ? (
            <>
              <TextField
                label="Код из SMS"
                {...register("code")}
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={() => {
                  setShowCodeField(false);
                  setShowPasswordField(true);
                }}
              >
                Подтвердить
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Пароль"
                {...register("password")}
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
              <Button type="submit" variant="contained" fullWidth>
                Войти
              </Button>
            </>
          )}
        </Box>
      </Modal>
      <Button
        className={styles.button}
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit(handleSendSmsCode)}
      >
        Логин
      </Button>
    </form>
  );
};
