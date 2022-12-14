import axios from "axios";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import { useState } from "react";
import { Line } from "rc-progress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Web3Storage } from "web3.storage";
import swal from "@sweetalert/with-react";
import "./Uploader.css";

// Construct with token and endpoint
function getAccessToken() {
  return process.env.REACT_APP_WEBTHREETOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
const projectSecret = process.env.REACT_APP_IPFS_SECRET_KEY;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const Uploader = () => {
  const navigate = useNavigate();
  const { currentColor, account, status, setAccountAddress } =
    useStateContext();
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [videoProgress, setVideoProgress] = useState(null);
  const [imageProgress, setImageProgress] = useState(null);

  function videoUploadSuccess() {
    setVideoTitle("");
    setVideoCategory("");
    setVideoFile("");
    setVideoFileName("");
    setVideoUploading(false);
    setDescription("");
    setImageFile("");
    setImageFileName("");
    setVideoProgress(null);
    setImageProgress(null);
  }

  function handleFileChange(target, setter) {
    setVideoFileName(target.files[0].name);
    setter(target.files[0]);
  }

  function handleFileChangeImage(target, setter) {
    setImageFileName(target.files[0].name);
    setter(target.files[0]);
  }

  async function handleFileUpload() {
    document.getElementById("select").style.cursor = "not-allowed";
    document.getElementById("countries").style.pointerEvents = "none";
    document.getElementById("title-container").style.cursor = "not-allowed";
    document.getElementById("title").style.pointerEvents = "none";
    document.getElementById("description-container").style.cursor =
      "not-allowed";
    document.getElementById("description").style.pointerEvents = "none";
    document.getElementById("image-container").style.cursor = "not-allowed";
    document.getElementById("image").style.pointerEvents = "none";
    document.getElementById("video-container").style.cursor = "not-allowed";
    document.getElementById("video").style.pointerEvents = "none";
    document.querySelector("button").style.disabled = "true";
    setVideoUploading(true);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(videoFile);
    reader.onloadend = async () => {
      // Web3Storage video upload start
      try {
        const fileInput = document.querySelector("#input_video");
        const files = fileInput.files;
        const onRootCidReady = (cid) => {
          console.log("uploading files with cid:", cid);
        };
        const totalSize = files[0].size;
        let fileName = files[0].name.replace(/\s/g, "%20");
        fileName = fileName.replace(/#/g, "%23");
        let uploaded = 0;
        const onStoredChunk = (size) => {
          uploaded += size;
          const pct = 100 * (uploaded / totalSize);
          setVideoProgress(pct.toFixed(2));
          console.log(`Uploading... ${pct.toFixed(2)}% complete`);
        };
        const client = makeStorageClient();
        const IpfsCid = await client.put(files, {
          onRootCidReady,
          onStoredChunk,
        });
        const VideoUrl = `https://${IpfsCid}.ipfs.w3s.link/${fileName}`;

        imageUpload(VideoUrl);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
      // Web3Storage video upload end

      async function imageUpload(VideoUrl) {
        try {
          let ImageUrl = "";
          var FormData = require("form-data");
          var data = new FormData();
          const reader = new window.FileReader();
          reader.readAsArrayBuffer(imageFile);
          reader.onloadend = async () => {
            // Web3Storage image upload start
            try {
              const fileInput = document.querySelector("#input_thumbnail");
              const files = fileInput.files;
              const onRootCidReady = (cid) => {
                console.log("uploading files with cid:", cid);
              };
              const totalSize = files[0].size;
              let fileName = files[0].name.replace(/\s/g, "%20");
              fileName = fileName.replace(/#/g, "%23");
              let uploaded = 0;
              const onStoredChunk = (size) => {
                uploaded += size;
                const pct = 100 * (uploaded / totalSize);
                setImageProgress(pct.toFixed(1));
                console.log(`Uploading... ${pct.toFixed(1)}% complete`);
              };
              const client = makeStorageClient();
              const IpfsCid = await client.put(files, {
                onRootCidReady,
                onStoredChunk,
              });
              ImageUrl = `https://${IpfsCid}.ipfs.w3s.link/${fileName}`;
            } catch (error) {
              console.log(error);
            }
            //   web3Storage image upload end

            data.append("category", videoCategory);
            data.append("name", videoTitle);
            data.append("video_desc", description);
            data.append("video_uid", VideoUrl);
            data.append("thumbnail_ipfs", ImageUrl);
            data.append("user_address", account);
            data.append("user_type", "admin");

            var config = {
              method: "post",
              url: `${process.env.REACT_APP_LOCALHOST_URL}/php/API/upload_video`,
              data: data,
            };
            axios(config)
              .then(function (response) {
                videoUploadSuccess();
                setVideoUploading(false);
                swal({
                  title: "Video Uploaded Successfully",
                  icon: "success",
                  button: "Ok",
                }).then(() => {
                  navigate("/videos");
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          };
        } catch (error) {
          console.log(error);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 10000));
    };
  }

  function handleChange(target, setter) {
    setter(target.value);
  }
  const notify = () => {
    toast.success("Video uploaded successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const accountAddress = sessionStorage.getItem("finflixUser");
  useEffect(() => {
    if (status === "notConnected") {
      setAccountAddress(null);
      navigate("/login");
    } else if (status === "connected") {
      if (!accountAddress) {
        setAccountAddress(null);
        navigate("/login");
      } else {
        setAccountAddress(account);
      }
    }
  }, [status, accountAddress]);

  useEffect(() => {
    document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
      const dropZoneElement = inputElement.closest(".drop-zone");

      dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
      });

      inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
          updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
      });

      dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
      });

      ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
          dropZoneElement.classList.remove("drop-zone--over");
        });
      });

      dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0].type === "video/mp4") {
          setVideoFileName(e.dataTransfer.files[0].name);
          setVideoFile(e.dataTransfer.files[0]);
        } else {
          setImageFileName(e.dataTransfer.files[0].name);
          setImageFile(e.dataTransfer.files[0]);
        }

        if (e.dataTransfer.files.length) {
          inputElement.files = e.dataTransfer.files;
          updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove("drop-zone--over");
      });
    });

    function updateThumbnail(dropZoneElement, file) {
      let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

      // First time - remove the prompt
      if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
      }

      // First time - there is no thumbnail element, so lets create it
      if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
      }

      thumbnailElement.dataset.label = file.name;

      // Show thumbnail for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
      } else {
        thumbnailElement.style.backgroundImage = null;
      }
    }
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div
          className="bg-white dark:text-gray-200 text-gray-600 dark:bg-secondary-dark-bg px-6 py-8 rounded shadow-md w-full bg-grey-lighter1"
          style={{ borderRadius: "1.5rem" }}
        >
          <div className=" mb-2">
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 text-center">
              Video Uploader
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="mx-auto w-full max-w-[550px]">
              <form
                className="py-6 px-9"
                action="https://formbold.com/s/FORM_ID"
                method="POST"
              >
                <div className="mb-5" id="select">
                  <label
                    htmlFor="countries"
                    className="mb-3 block text-base font-medium "
                  >
                    Select an option
                  </label>
                  <select
                    id="countries"
                    className="w-full rounded-md border border-[#e0e0e0]  py-3 px-6 text-base font-medium text-[#6B7280] outline-none bg-[#e7e7e7] focus:border-[#6A64F1] focus:shadow-md"
                    placeholder="Select category"
                    onChange={(e) => handleChange(e.target, setVideoCategory)}
                  >
                    <option defaultValue>Choose video category</option>
                    <option value="927f0965-6eed-462c-bfa0-79867c9f9448">Explainers</option>
                    <option value="fd3d24bd-8764-494e-9ade-40911b8e11a1">Tutorials</option>
                    <option value="5dae4ba7-933a-40a9-8866-49ee971ccf87">Review</option>
                    <option value="5822014a-02af-41c4-8564-0ec4ceba8db6">News</option>
                    <option value="0f01d804-648d-42a7-ab11-bdc373f4b7bd">Others</option>
                  </select>
                </div>
                <div className="mb-5" id="title-container">
                  <label
                    htmlFor="title"
                    className="mb-3 block font-medium text-base"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={videoTitle}
                    onChange={(e) => handleChange(e.target, setVideoTitle)}
                    id="title"
                    placeholder="Video Title"
                    className="w-full rounded-md border border-[#e0e0e0]  py-3 px-6 text-base font-medium text-[#6B7280] outline-none bg-[#e7e7e7] focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>

                <div className="mb-5" id="description-container">
                  <label
                    htmlFor="email"
                    className="mb-3 block text-base font-medium"
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => handleChange(e.target, setDescription)}
                    id="description"
                    rows="3"
                    className="w-full rounded-md border border-[#e0e0e0] py-3 px-6 text-base font-medium text-[#6B7280] outline-none bg-[#e7e7e7] focus:border-[#6A64F1] focus:shadow-md"
                    placeholder="Video Description..."
                  ></textarea>
                </div>

                <div className="mb-5" id="image-container">
                  {/* <span>
                    {imageFileName == "" ? "No File Selected" : imageFileName}
                  </span> */}
                  {!imageProgress ? (
                    <>
                      <div id="image">
                        {/* <label
                        className="file-input__label mt-2"
                        htmlFor="input_thumbnail"
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="upload"
                          className="svg-inline--fa fa-upload fa-w-16"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="currentColor"
                            d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                          ></path>
                        </svg>
                        <span>Upload Thumbnail</span>
                      </label>

                      <input
                        id="input_thumbnail"
                        className="w-full rounded-md border border-[#e0e0e0]  py-3 px-6 text-base font-medium text-[#6B7280] outline-none bg-[#e7e7e7] focus:border-[#6A64F1] focus:shadow-md file-input__input"
                        type="file"
                        onChange={(e) =>
                          handleFileChangeImage(e.target, setImageFile)
                        }
                        accept="image/*"
                      /> */}
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="thumbnail">Thumbnail</label>
                            <div className="drop-zone">
                              <span className="drop-zone__prompt">
                                <i className="fa-solid fa-cloud-arrow-up icon"></i>
                                <br />
                                Drop thumbnail here or click to upload
                              </span>
                              <input
                                type="file"
                                name="thumbnail"
                                id="input_thumbnail"
                                className="drop-zone__input"
                                required
                                onChange={(e) =>
                                  handleFileChangeImage(e.target, setImageFile)
                                }
                                accept="image/*"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mt-2">
                        Thumbnail uploading in progress... {imageProgress}%
                      </p>
                      <Line
                        percent={imageProgress}
                        strokeWidth={3}
                        strokeColor={currentColor}
                        className="mt-2"
                      />
                    </>
                  )}
                </div>

                <div className="mb-5" id="video-container">
                  {/* <span>
                    {videoFileName == "" ? "No File Selected" : videoFileName}
                  </span> */}
                  {!videoProgress ? (
                    <>
                      <div id="video">
                        {/* <label
                          className="file-input__label mt-2"
                          htmlFor="input_video"
                        >
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="upload"
                            className="svg-inline--fa fa-upload fa-w-16"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path
                              fill="currentColor"
                              d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                            ></path>
                          </svg>
                          <span>Upload Video</span>
                        </label>
                        <input
                          className="w-full rounded-md border border-[#e0e0e0]  py-3 px-6 text-base font-medium text-[#6B7280] outline-none bg-[#e7e7e7] focus:border-[#6A64F1] focus:shadow-md file-input__input"
                          type="file"
                          id="input_video"
                          onChange={(e) =>
                            handleFileChange(e.target, setVideoFile)
                          }
                          accept="video/*"
                        /> */}
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="video">Video</label>
                            <div className="drop-zone">
                              <span className="drop-zone__prompt">
                                <i className="fa-solid fa-cloud-arrow-up icon"></i>
                                <br />
                                Drop video here or click to upload
                              </span>
                              <input
                                type="file"
                                name="video"
                                id="input_video"
                                onChange={(e) =>
                                  handleFileChange(e.target, setVideoFile)
                                }
                                className="drop-zone__input"
                                required
                                accept="video/*"
                              />
                            </div>
                            <span
                              className="my-1"
                              style={{fontSize:"12px", color: currentColor}}
                            >
                              <i
                                className="fa fa-info-circle"
                                aria-hidden="true"
                              ></i>{" "}
                              Video size should be less than 100 mb
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mt-2">
                        Video uploading in progress... {videoProgress}%
                      </p>
                      <Line
                        percent={videoProgress}
                        strokeWidth={3}
                        strokeColor={currentColor}
                        className="mt-2"
                      />
                    </>
                  )}
                </div>
                <div>
                  {!videoUploading ? (
                    videoTitle &&
                    videoCategory &&
                    description &&
                    videoFile &&
                    imageFile ? (
                      <button
                        type="button"
                        className="hover:shadow-form w-full rounded-md  py-3 px-8 text-center text-base font-semibold text-white outline-none"
                        onClick={handleFileUpload}
                        style={{ background: currentColor }}
                      >
                        Send File
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="hover:shadow-form w-full rounded-md  py-3 px-8 text-center text-base font-semibold text-white outline-none opacity-70 transition ease-in-out duration-150 cursor-not-allowed"
                        onClick={handleFileUpload}
                        style={{ background: currentColor }}
                        disabled
                      >
                        Send File
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      className="w-full inline-flex items-center py-3 px-8 border border-transparent text-base leading-6 font-medium rounded-md justify-center  text-white transition ease-in-out duration-150 cursor-not-allowed"
                      disabled
                      style={{ background: currentColor }}
                    >
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
