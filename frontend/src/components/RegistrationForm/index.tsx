import { useState } from "react";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import styles from "./RegistrationForm.module.scss";
import { registerUser } from "api/auth"; // Assuming you have this function in api.js
import { MuiTelInput } from "mui-tel-input";

export const RegisterForm = () => {
  const [showCodeField, setShowCodeField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!showPasswordField) {
      // Verify SMS code
      registerUser(data.phoneNumber, data.code);
      setShowCodeField(false);
      setShowPasswordField(true);
    } else {
      // Register user
      registerUser(data.phoneNumber, data.password);
    }
  };

  const handleSendSmsCode = async (data: any) => {
    // Send SMS code to phone number
    registerUser(data.phoneNumber, data.code);
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
              />
              <TextField
                label="Повторите пароль"
                {...register("confirmPassword")}
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={<>{errors.confirmPassword?.message}</>}
              />
              <Button type="submit" variant="contained" fullWidth>
                Зарегистрироваться
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
        onClick={!showCodeField ? handleSendSmsCode : undefined}
      >
        Регистрация
      </Button>
    </form>
  );
};
