import axios from "axios";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import { useState } from "react";
import { Line } from "rc-progress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Web3Storage } from "web3.storage";
import swal from "@sweetalert/with-react";
import getVideoId from "get-video-id";

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

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "53946fd371mshf425708a1a54e91p1222cejsne4f12169650b",
    "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
  },
};

const UrlUploader = () => {
  const navigate = useNavigate();
  const { currentColor, account, status, setAccountAddress } =
    useStateContext();
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [videoFiles, setVideoFiles] = useState("");
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

  function handleFileChangeImage(target, setter) {
    setImageFileName(target.files[0].name);
    setter(target.files[0]);
  }

  async function getResp(url) {
    const { id } = getVideoId(url);
    const response = await fetch(
      `https://yt-api.p.rapidapi.com/dl?id=${id}`,
      options
    );
    return response;
  }

  async function handleFileUpload() {
    document.getElementById("select").style.cursor = "not-allowed";
    document.getElementById("countries").style.pointerEvents = "none";
    document.getElementById("video-container").style.cursor = "not-allowed";
    document.getElementById("video").style.pointerEvents = "none";
    document.querySelector("button").style.disabled = "true";
    setVideoUploading(true);

    // Get URL from form input
    const Url = `${videoFile}`;

    // fetch data from url
    const resp1 = await getResp(Url);
    const Data = await resp1.json();

    let title = Data.title;
    let description = "";
    if (Data.description.length >= 100) {
      description = Data.description.substring(0, 100) + "....";
    } else if (Data.description == "") {
      description = title;
    } else {
      description = Data.description;
    }
    let videoUrl = Data.formats[1].url;
    let imgUrl = Data.thumbnail[1].url;

    // console.log(Data);
    // console.log(`data title ${title}`);
    // let desc = Data.description;
    // setDescription(`${title}`);
    // console.log(`data title ${title}`);
    console.log(title);
    console.log(`this is dicription ${description}`);
    // console.log(videoUrl);
    // console.log(imgUrl);

    // covert image url into blob
    let imgRes = await fetch(`${imgUrl}`);
    let imgData = await imgRes.blob();

    // covert video url into blob
    const response2 = await fetch(`${videoUrl}`);
    const videoData = await response2.blob();
    // console.log(`this is video file ${videoData}`);

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(videoData);
    reader.onloadend = async () => {
      // Web3Storage video upload start

      let metadata1 = {
        type: "video/mp4",
      };
      let vFile = [new File([videoData], "sample.mp4", metadata1)];
      try {
        // const fileInput = document.querySelector("#input_video");

        const files = vFile;
        console.log(files);

        const onRootCidReady = (cid) => {
          console.log("uploading files with cid:", cid);
        };
        console.log(`this is name of files ${files[0].name}`);
        console.log(`this is size of files ${files[0].size}`);
        const totalSize = files[0].size;
        // let fileName = files.name.replace[0](/\s/g, "%20");
        // fileName = fileName.replace[0](/#/g, "%23");
        let fileName = files[0].name;
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
        console.log(`this is video url web3 ${VideoUrl}`);

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
          reader.readAsArrayBuffer(imgData);
          reader.onloadend = async () => {
            // Web3Storage image upload start
            let metadata2 = {
              type: "image/jpeg",
            };
            let imgFile = [new File([imgData], "test.jpg", metadata2)];
            console.log(imgFile);
            try {
              const files = imgFile;
              console.log(`this is img file ${files}`);
              const onRootCidReady = (cid) => {
                console.log("uploading files with cid:", cid);
              };
              const totalSize = files[0].size;
              let fileName = files[0].name;
              console.log(`this is size of img ${files[0].size}`);

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
              console.log(`img url of web3 ${ImageUrl}`);
            } catch (error) {
              console.log(error);
            }
            //   web3Storage image upload end

            data.append("category", videoCategory);
            data.append("name", title);
            data.append("video_desc", description);
            data.append("video_uid", VideoUrl);
            data.append("thumbnail_ipfs", ImageUrl);
            data.append("user_address", account);
            data.append("user_type", "admin");

            console.log(`video videoCategory ${videoCategory}`);
            console.log(`video title ${title}`);
            console.log(`viseo description ${description}`);
            console.log(`viseo VideoUrl ${VideoUrl}`);
            console.log(`viseo ImageUrl ${ImageUrl}`);
            console.log(`video account ${account}`);
            console.log(`this is append data ${data}`);

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
    <>
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
              <option value="927f0965-6eed-462c-bfa0-79867c9f9448">
                Explainers
              </option>
              <option value="fd3d24bd-8764-494e-9ade-40911b8e11a1">
                Tutorials
              </option>
              <option value="5dae4ba7-933a-40a9-8866-49ee971ccf87">
                Review
              </option>
              <option value="5822014a-02af-41c4-8564-0ec4ceba8db6">News</option>
              <option value="0f01d804-648d-42a7-ab11-bdc373f4b7bd">
                Others
              </option>
            </select>
          </div>

          <div className="mb-5" id="video-container">
            {!videoProgress ? (
              <>
                <div id="video">
                  <div className="col-md-12">
                    <div className="mb-5" id="title-container">
                      <label className="mb-3 block font-medium text-base">
                        Video
                      </label>
                      <input
                        type="text"
                        name="video"
                        value={videoFile}
                        onChange={(e) => handleChange(e.target, setVideoFile)}
                        id="input_video"
                        placeholder="Drop video here or click to upload"
                        accept="video/*"
                        className="w-full rounded-md border border-[#e0e0e0]  py-3 px-6 text-base font-medium text-[#6B7280] outline-none bg-[#e7e7e7] focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                    <span
                      className="my-1"
                      style={{ fontSize: "12px", color: currentColor }}
                    >
                      <i className="fa fa-info-circle" aria-hidden="true"></i>{" "}
                      Video size should be less than 100 mb
                    </span>
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
              videoCategory && videoFile ? (
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
    </>
  );
};

export default UrlUploader;
