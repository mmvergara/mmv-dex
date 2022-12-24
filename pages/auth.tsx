import { supabase } from "../supabase/client";
import { useFormik } from "formik";
import { authFormSchema } from "../schema/FormSchemas";
import { useState } from "react";
import { AuthError } from "@supabase/supabase-js";
import Router from "next/router";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { user } = useAuth();
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
    const email = formik.values.username + "@dexlocalhost.com";
    const password = formik.values.password;
    let error: AuthError | null = null;
    setAuthError("");

    if (formState == "Login") {
      setStatus("Logging In . . .");
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = loginError;
    }

    if (formState === "Signup") {
      setStatus("Signing up . . ");
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    }

    if (error) setAuthError(error.message);
    setStatus("");
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: authFormSchema,
    onSubmit: authHandler,
  });
  const usernameError = formik.touched.username && formik.errors.username;
  const passwordError = formik.touched.password && formik.errors.password;
  return (
    <form
      className='flex flex-col justify-center items-center max-w-[320px] mx-auto'
      onSubmit={formik.handleSubmit}
    >
      <h2 className='text-5xl mb-4 font-Poppins'>{formState}</h2>
      {usernameError && <p className='text-left pl-2 w-[100%] text-red-600'>{usernameError}</p>}
      <input
        type='text'
        className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='Username'
        id='username'
        name='username'
        value={formik.values.username}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      {passwordError && <p className='text-left pl-2 w-[100%] text-red-600'>{passwordError}</p>}
      <input
        className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='Password'
        type='password'
        id='password'
        name='password'
        color='primary'
        value={formik.values.password}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      <button
        type='submit'
        className='w-[100%] p-2 bg-purplePri hover:bg-purpleSec rounded-md font-semibold text-white'
      >
        {formState}
      </button>
      <p
        className='text-purplePri mt-2 text-center hover:purpleSec underline underline-offset-2 cursor-pointer'
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
