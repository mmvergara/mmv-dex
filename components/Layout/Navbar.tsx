import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { RiLoginCircleFill } from "react-icons/ri";
import { emailToUsername } from "../../utils/helper-functions";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { toast } from "react-toastify";
import Router from "next/router";
import Link from "next/link";
import CreateReviewDrawer from "../forms/CreateReviewDrawer";
import { useUserRole } from "../../context/RoleContext";

const Navbar:React.FC = () => {
  const supabase = useSupabaseClient();
  const role = useUserRole();
  const user = useUser();

  const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);
  const toggleNavDrawer = () => setNavDrawerOpen((prev) => !prev);

  const [createReviewDrawerOpen, setCreateReviewDrawerOpen] = useState<boolean>(false);
  const toggleCreateReviewDrawer = () => {
    setCreateReviewDrawerOpen((prev) => !prev);
    if (!createReviewDrawerOpen) toggleNavDrawer();
  };

  const closeAllDrawers = () => {
    setNavDrawerOpen(false);
    setCreateReviewDrawerOpen(false);
  };

  const logoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    if (!error) toast.success("Logout Success");
    Router.push("/auth");
  };

  const username = emailToUsername(user?.email);

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
          <p className='navLink text-xl' onClick={toggleNavDrawer}>
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
      {user && (
        <>
          <CreateReviewDrawer
            isOpen={createReviewDrawerOpen}
            toggleCreateReviewDrawer={toggleCreateReviewDrawer}
            closeAllDrawers={closeAllDrawers}
          />
          <Drawer isOpen={navDrawerOpen} placement='right' size='sm' onClose={toggleNavDrawer}>
            <DrawerOverlay onClick={toggleNavDrawer} />
            <DrawerContent className='max-w-[300px] shadow-lg' backgroundColor='whitesmoke'>
              <DrawerHeader className='flex justify-between items-center'>
                <h4 className='font-Poppins p-4'>Hello! {username}</h4>
                <span onClick={toggleNavDrawer} className='navLink hover:bg-rose-500 font-Poppins p-4 m-2'>
                  <GrClose />
                </span>
              </DrawerHeader>
              <DrawerBody>
                <ul onClick={toggleNavDrawer} className='flex flex-col font-Poppins font-semibold'>
                  <Link href={`/profile/${username}`} className='navLink py-4 '>
                    My Profile
                  </Link>
                  {role === "admin" && (
                    <Link href={`/p/dashboard`} className='navLink py-4 '>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href='/post/create' className='navLink py-4 '>
                    Create Post
                  </Link>
                  <a onClick={toggleCreateReviewDrawer} className='navLink py-4 '>
                    Create Review
                  </a>
                  <Link href='/search-users' className='navLink py-4 '>
                    Search Users
                  </Link>
                  <span onClick={logoutHandler} className='navLink py-4 hover:bg-rose-400'>
                    Logout
                  </span>
                </ul>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </nav>
  );
};

export default Navbar;
