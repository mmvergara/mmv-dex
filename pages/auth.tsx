import { getServerSideSupabaseClientSession } from "../supabase/services/auth-service";
import { useState, useRef, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { AuthError, AuthResponse } from "@supabase/supabase-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { usernameToEmail } from "../utils/helper-functions";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../utils/useSnowFlakeLoading";
import Head from "next/head";
import { authValidationSchema } from "../utils/models-validators";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(ctx);
  if (session) return { notFound: true };
  return { props: {} };
};

const Login: React.FC = () => {
  const usernameInputRef = useRef<HTMLInputElement | null>(null!);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [formState, setFormState] = useState<"Login" | "Signup">("Login");
  const { SnowFlakeLoading, setIsLoading } = useSnowFlakeLoading();
  const [authError, setAuthError] = useState<null | string>(null);
  const toggleFormState = () => 
    setFormState((prev) => {
      if (prev === "Login") return "Signup";
      return "Login";
    });

  const authHandler = async () => {
    setIsLoading(true);

    const email = usernameToEmail(formik.values.username);
    const password = formik.values.password;
    const userData = { email, password };

    let error: AuthError | null = null;
    let response: AuthResponse | null = null;

    if (formState == "Login") response = await supabase.auth.signInWithPassword(userData);
    if (formState === "Signup") response = await supabase.auth.signUp(userData);
    if (response) error = response.error || null;

    if (error) {
      setAuthError(error?.message || "Error Occured");
    } else {
      toast.success("Authenticated");
      router.push("/");
      setAuthError(null);
    }
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: authValidationSchema,
    onSubmit: authHandler,
  });
  useEffect(() => {
    // Focus on the username input on the first render
    usernameInputRef.current?.focus();
  }, []);

  const usernameError = formik.touched.username && formik.errors.username;
  const passwordError = formik.touched.password && formik.errors.password;
  const changeFormStateButtonText =
    formState === "Login" ? "Don't have an account? Register here" : "Already have an account? Login here";
  return (
    <>
      <Head>
        <title>Dex | Auth </title>
        <meta name='description' content='Dex Authentication Page' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <form
          className='flex flex-col mt-8 justify-center items-center max-w-[320px] mx-auto bg-gray- p-4'
          onSubmit={formik.handleSubmit}
        >
          <h2 className='text-5xl mb-4 font-Poppins'>{formState}</h2>
          {usernameError && <p className='text-left pl-2 w-[100%] text-red-600'>{usernameError}</p>}
          <input
            ref={usernameInputRef}
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
          <button type='submit' className='formButton flex justify-center items-center gap-1'>
            {formState}
            {SnowFlakeLoading}
          </button>
          <p
            className='text-purplePri mt-8 text-center hover:purpleSec underline underline-offset-2 cursor-pointer'
            onClick={toggleFormState}
          >
            {changeFormStateButtonText}
          </p>
          {authError && (
            <p className='text-center mt-2 pl-2 w-[100%] font-Poppins font-bold text-red-600'>{authError}</p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
