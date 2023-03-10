import { GiSnowflake2 } from "react-icons/gi";
import { useState } from "react";

const useSnowFlakeLoading = (tailwindClasses: string = "", initialLoadingState: boolean = false) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialLoadingState);

  const SnowFlakeLoading = isLoading ? (
    <span className={`spin ${tailwindClasses}`}>
      <GiSnowflake2 />
    </span>
  ) : (
    <></>
  );

  return { isLoading, SnowFlakeLoading, setIsLoading };
};
export default useSnowFlakeLoading;
