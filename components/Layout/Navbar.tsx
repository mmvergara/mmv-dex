"use client";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase/client";

const Navbar = () => {
  const { user } = useAuth();
  const logoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <nav className='text-black py-4 px-6 flex justify-between items-center'>
      <Link href='/' className='text-purplePri text-2xl font-bold'>
        // Dex //
      </Link>
      <div className='flex'>
        <Link
          href='/'
          className='px-4 py-2 font-bold font-Poppins hover:underline underline-offset-4'
        >
          Home
        </Link>
        {user && (
          <Link
            href='/create-post'
            className='px-4 py-2 font-bold font-Poppins hover:underline underline-offset-4'
          >
            Create Post
          </Link>
        )}
        {user ? (
          <a
            onClick={logoutHandler}
            className='px-4 py-2 font-bold font-Poppins hover:underline underline-offset-4 cursor-pointer'
          >
            Logout
          </a>
        ) : (
          <Link
            href='/auth'
            className='px-4 py-2 font-bold font-Poppins hover:underline underline-offset-4'
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
