import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/modal";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { MdOutlineRateReview } from "react-icons/md";
import { emailToUsername } from "../../utils/helper-functions";
import { DatabaseTypes } from "../../types/db/db-types";
import { GrClose } from "react-icons/gr";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";
import Link from "next/link";

type props = {
  toggleCreateReviewDrawer: () => void;
  closeAllDrawers: () => void;
  isOpen: boolean;
};

const CreateReviewDrawer: React.FC<props> = ({ isOpen, closeAllDrawers, toggleCreateReviewDrawer }) => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const session = useSession();
  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading("", false);
  const [usernameLists, setUsernameLists] = useState<{ email: string; id: string }[] | null>(null);
  const [username, setUsername] = useState<string>("");

  const handleClose = () => toggleCreateReviewDrawer();

  useEffect(() => {
    const ac = new AbortController();
    const signal = ac.signal;
    getProfiles(username, signal);
    return () => {
      ac.abort();
    };
  }, [username]);

  async function getProfiles(username: string, signal: AbortSignal) {
    setTimeout(async () => {
      setIsLoading(true);
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id,email")
        .like("email", `${username}%`)
        .limit(10)
        .abortSignal(signal);
      if (error) {
        // Ignore error if the error is a "Aborted request"
        if (Number(error.code) === 20) return;
        setIsLoading(false);
        toast.error(error.message);
        return;
      }

      if (profiles) setUsernameLists(profiles.filter((p) => p.id !== session?.user.id));
      setIsLoading(false);
    }, 500);
  }

  return (
    <>
      <Drawer isOpen={isOpen} placement='right' size='sm' onClose={handleClose} colorScheme='gray'>
        <DrawerOverlay onClick={handleClose} />
        <DrawerContent className='max-w-[300px] shadow-lg' backgroundColor='whitesmoke'>
          <DrawerHeader className='flex justify-between items-center'>
            <h4 className='font-Poppins p-4 flex gap-2'>
              Create Review for: <div className='flex text-purpleSec text-2xl'>{isLoading && SnowFlakeLoading}</div>
            </h4>
            <span onClick={handleClose} className='navLink hover:bg-rose-500 font-Poppins p-4 m-2'>
              <GrClose />
            </span>
          </DrawerHeader>
          <DrawerBody>
            <section>
              <form className='w-[100%] max-w-[500px] mx-auto'>
                <div className='mx-2'>
                  <input
                    list='users'
                    name='Name'
                    className='w-[100%] mb-4 p-2 bg-slate-200 focus:bg-white rounded-md tracking-wide font-Poppins'
                    type='text'
                    placeholder='Username'
                    onChange={(e) => setUsername(e.target?.value)}
                  />
                  <div>
                    <article>
                      {usernameLists?.map((user) => {
                        const username = emailToUsername(user.email);
                        return (
                          <Link
                            href={`/peer-review/create?username=${username}`}
                            key={user.id}
                            onClick={() => closeAllDrawers()}
                            className='flex items-center group w-[100%] hover:bg-slate-200 font-Poppins font-semibold border-2 p-2 my-2'
                          >
                            <p className='mr-auto group-hover:underline'>@{username}</p>
                            <span className='text-2xl flex flex-grow-1 gap-2'>
                              <MdOutlineRateReview />
                            </span>
                          </Link>
                        );
                      })}
                      {usernameLists?.length === 0 && <p>No User's Found 😞</p>}
                    </article>
                  </div>
                </div>
              </form>
            </section>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default CreateReviewDrawer;
