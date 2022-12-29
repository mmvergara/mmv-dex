import { authValidationSchema } from "../schemas/yup-schemas";
import { axiosErrorParse } from "../utils/error-handling";
import { useFormik } from "formik";
import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import axios from "axios";
import Router from "next/router";

const Login: React.FC = () => {
  const user = useUser();
  if (user) {
    Router.push("/");
    return <></>;
  }
  const [formState, setFormState] = useState<"Login" | "Signup">("Login");
  const [status, setStatus] = useState<null | string>(null);
  const [authError, setAuthError] = useState<null | string>(null);

  const toggleFormState = () =>
    setFormState((prev) => {
      if (prev === "Login") return "Signup";
      return "Login";
    });

  const authHandler = async () => {
    const username = formik.values.username;
    const password = formik.values.password;
    const userData = { username, password };
    setAuthError("");
    try {
      if (formState == "Login") {
        setStatus("Logging In . . .");
        await axios.post(`/api/auth/login`, userData);
      }
      if (formState === "Signup") {
        setStatus("Signing up . . ");
        await axios.put(`/api/auth/register`, userData);
      }
      // Router.reload();
    } catch (err) {
      const { data, error } = axiosErrorParse(err);
      setAuthError(error.message);
    }
    setStatus("");
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: authValidationSchema,
    onSubmit: authHandler,
  });
  const usernameError = formik.touched.username && formik.errors.username;
  const passwordError = formik.touched.password && formik.errors.password;
  return (
    <form
      className='flex flex-col mt-8 justify-center items-center max-w-[320px] mx-auto bg-gray- p-4'
      onSubmit={formik.handleSubmit}
    >
      <h2 className='text-5xl mb-4 font-Poppins'>{formState}</h2>
      {usernameError && <p className='text-left pl-2 w-[100%] text-red-600'>{usernameError}</p>}
      <input
        type='text'
        className='w-[100%] mb-4 p-2 bg-inputPri sha focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='Username'
        id='username'
        name='username'
        value={formik.values.username}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      {passwordError && <p className='text-left pl-2 w-[100%] text-red-600'>{passwordError}</p>}
      <input
        className='w-[100%] mb-4 p-2 bg-inputPri sha focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='Password'
        type='password'
        id='password'
        name='password'
        color='primary'
        value={formik.values.password}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      <button type='submit' className='formButton'>
        {formState}
      </button>
      <p
        className='text-purplePri mt-8 text-center hover:purpleSec underline underline-offset-2 cursor-pointer'
        onClick={toggleFormState}
      >
        {formState === "Login"
          ? "Don't have an account? Register here"
          : "Already have an account? Login here"}
      </p>
      {status && <p className='text-center mt-2 pl-2 w-[100%] font-Poppins font-bold '>{status}</p>}
      {authError && (
        <p className='text-center mt-2 pl-2 w-[100%] font-Poppins font-bold text-red-600'>
          {authError}
        </p>
      )}
    </form>
  );
};

export default Login;
