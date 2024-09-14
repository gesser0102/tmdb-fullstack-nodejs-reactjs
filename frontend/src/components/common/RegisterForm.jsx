import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/userModule";
import { setAuthModalOpen } from "../../redux/loginModalSlice";
import { setUser } from "../../redux/userSlice";

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);

  const signinForm = useFormik({
    initialValues: {
      password: "",
      username: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Usuário é obrigatório"),
      password: Yup.string()
        .required("Senha é obrigatória"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Senha não confere")
        .required("Confirmar senha é obrigatória")
    }),
    onSubmit: async values => {
      setIsLoginRequest(true);
      const { response, err } = await userApi.signup(values);
      setIsLoginRequest(false);

      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Registro Realizado Com Sucesso");
      }

      if (err) toast.error(err.message);
    }
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="text"
          placeholder="Usuário"
          name="username"
          fullWidth
          value={signinForm.values.username}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.username && signinForm.errors.username !== undefined}
          helperText={signinForm.touched.username && signinForm.errors.username}
        />
        <TextField
          type="password"
          placeholder="Senha"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.password && signinForm.errors.password !== undefined}
          helperText={signinForm.touched.password && signinForm.errors.password}
        />
        <TextField
          type="password"
          placeholder="Confirmar Senha"
          name="confirmPassword"
          fullWidth
          value={signinForm.values.confirmPassword}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.confirmPassword && signinForm.errors.confirmPassword !== undefined}
          helperText={signinForm.touched.confirmPassword && signinForm.errors.confirmPassword}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        Registrar
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState()}
      >
        Entrar
      </Button>
    </Box>
  );
};

export default SignupForm;