"use client";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { RiLoginCircleFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const Navbar = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const handleClose = () => setDrawerOpen((prev) => !prev);
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
    toggleDrawer();
  };

  const username = user?.email?.split("@").slice(0, -1).join("");

  return (
    <nav className='text-sm font-semibold font-Poppins text-black tracking-wide bg-gray-100 py-2 shadow-lg px-6  flex  justify-between items-center'>
      <Link href='/' className='text-2xl font-bold'>
        // Dex //
      </Link>
      <span className='flex'>
        <Link href='/' className='navLink border-2 mr-2'>
          <span className='block sm:hidden text-xl '>
            <AiFillHome />
          </span>
          <span className='hidden sm:block'>Home</span>
        </Link>
        {user ? (
          <p className='navLink text-xl' onClick={toggleDrawer}>
            <GiHamburgerMenu />
          </p>
        ) : (
          <Link href='/auth' className='navLink text-white bg-purplePri hover:bg-purpleSec '>
            <span className='block sm:hidden text-xl '>
              <RiLoginCircleFill />
            </span>
            <span className='hidden sm:block'>Login</span>
          </Link>
        )}
      </span>

      <Drawer isOpen={drawerOpen} placement='right' size='sm' onClose={handleClose}>
        <DrawerOverlay onClick={toggleDrawer} />
        <DrawerContent className='max-w-[300px] shadow-lg' backgroundColor='whitesmoke'>
          <DrawerHeader className='flex justify-between items-center'>
            <h4 className='font-Poppins p-4'>Hello! {username}</h4>
            <span onClick={toggleDrawer} className='navLink hover:bg-rose-500 font-Poppins p-4 m-2'>
              <GrClose />
            </span>
          </DrawerHeader>
          <DrawerBody>
            {user && (
              <ul onClick={toggleDrawer} className='flex flex-col font-Poppins font-semibold'>
                <Link href='/post/create' className='navLink py-4 '>
                  My Profile
                </Link>
                <Link href='/post/create' className='navLink py-4 '>
                  Create Post
                </Link>
                <Link href='/peer-review/create' className='navLink py-4 '>
                  Create Review
                </Link>
                <span onClick={logoutHandler} className='navLink py-4 hover:bg-rose-400'>
                  Logout
                </span>
              </ul>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};

export default Navbar;
