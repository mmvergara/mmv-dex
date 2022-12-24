"use client";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { MdReviews } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai";
import { ImHome } from "react-icons/im";
import { RiLoginCircleFill, RiLogoutCircleFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Navbar = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const logoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    let logoutStatus = "Logout successful";
    if (error) logoutStatus = error.message;

    toast.error(logoutStatus, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <nav className='text-sm  text-black tracking-wide bg-gray-100 py-2 shadow-lg px-6  flex  justify-between items-center'>
      <Link href='/' className=' text-2xl font-bold'>
        // Dex //
      </Link>
      <div className='flex gap-1 sm:gap-2 font-semibold font-Poppins'>
        <Link
          href='/'
          className='px-4 py-2 hover:bg-gray-300 text-black transition-colors ease-in rounded-sm underline-offset-4'
        >
          <span className='block sm:hidden text-xl '>
            <AiFillHome />
          </span>
          <span className='hidden sm:block'>Home</span>
        </Link>

        {user && (
          <>
            <Link
              href='/post/create'
              className='px-4 py-2 hover:bg-gray-300 transition-colors ease-in rounded-sm  border-2'
            >
              <span className='block sm:hidden text-xl'>
                <FiPlusSquare />
              </span>
              <span className='hidden sm:block'>Peer Review</span>
            </Link>
            <Link
              href='/post/create'
              className='px-4 py-2 hover:bg-gray-300 transition-colors ease-in rounded-sm  border-2'
            >
              <span className='block sm:hidden text-xl'>
                <MdReviews />
              </span>
              <span className='hidden sm:block'>Peer Review</span>
            </Link>
          </>
        )}
        {user ? (
          <a
            onClick={logoutHandler}
            className='px-4 py-2 hover:bg-rose-600 transition-colors ease-in rounded-sm cursor-pointer border-2 pb-2 border-gray-100'
          >
            <span className='block sm:hidden text-xl'>
              <RiLogoutCircleFill />
            </span>
            <span className='hidden sm:block'>Logout</span>
          </a>
        ) : (
          <Link
            href='/auth'
            className='px-4 py-2 bg-purpleSec text-white transition-colors ease-in rounded-sm '
          >
            <span className='block sm:hidden text-xl '>
              <RiLoginCircleFill />
            </span>
            <span className='hidden sm:block'>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
