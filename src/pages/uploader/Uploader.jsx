import React, { useState } from "react";
import "./Uploader.css";
import FileUploader from "./FileUploader";
import UrlUploader from "./UrlUploader";
import { Switch } from 'antd';

const Uploader = () => {
  const [status, setStatus] = useState(false);

  const stateChange = () =>{
    status === false ? setStatus(true) : setStatus(false);
   
  }
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      <div className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div
          className="bg-white  text-gray-600  px-6 py-8 rounded shadow-md w-full bg-slate-100"
          style={{ borderRadius: "1.5rem" }}
        >
          <div className=" mb-2">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 text-center">
              Video Uploader
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="mx-auto w-full max-w-[550px]">
              <div className="toggleBtn flex items-center justify-center mt-5">
                <img src="./images/file_icon.png" alt="files" width="20" />
                <Switch onClick={stateChange} className="mx-3" />
                <img src="./images/youtube_icon.png" alt="toutube" width="25" />
              </div>
                  {status === false ? <FileUploader /> : <UrlUploader />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
