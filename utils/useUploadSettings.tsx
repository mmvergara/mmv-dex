import { useState } from "react";
import { compressionMethod, uploadServer } from "../types";

const useUploadSettings = () => {
  const [isCompressed, setIsCompressed] = useState<boolean>(true);
  const [compressionMethod, setCompressionMethod] = useState<compressionMethod>("client");
  const [uploadServer, setUploadServer] = useState<uploadServer>("supabase");

  const uploadSettings = {
    isCompressed,
    compressionMethod,
    uploadServer,
  };

  const UploadSettingsUI = (
    <div className=' font-Poppins min-w-[200px] border-2 p-4 mb-4'>
      <input
        type='checkbox'
        name='Upload Compressed'
        id='compressed'
        defaultChecked={isCompressed}
        onChange={() => setIsCompressed((ps) => !ps)}
      />{" "}
      Compress Image
      <br />
      {isCompressed && (
        <div className='mb-4' style={{ paddingLeft: "1em" }}>
          <input
            type='radio'
            name='compressMethod'
            value='client'
            checked={"client" === compressionMethod}
            onChange={(e) => {
              if (e.target.value === "client") setCompressionMethod("client");
            }}
          />{" "}
          Client Side
          <br />
          <input
            type='radio'
            name='compressMethod'
            value='server'
            checked={"server" === compressionMethod}
            onChange={(e) => {
              if (e.target.value === "server") setCompressionMethod("server");
            }}
          />{" "}
          Server Side
        </div>
      )}
      <div>
        <input
          type='radio'
          name='server'
          value='supabase'
          checked={"supabase" === uploadServer}
          onChange={(e) => {
            if (e.target.value === "supabase") setUploadServer("supabase");
          }}
        />{" "}
        Supabase Server
        <br />
        <input
          type='radio'
          name='server'
          value='vercel'
          checked={"vercel" === uploadServer}
          onChange={(e) => {
            if (e.target.value === "vercel") setUploadServer("vercel");
          }}
        />{" "}
        Vercel Server
      </div>
    </div>
  );

  return { UploadSettingsUI, uploadSettings };
};

export default useUploadSettings;
