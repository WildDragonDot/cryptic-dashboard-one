import React, { useEffect, useState } from "react";
import "./VideoDetails.css";
import axios from "axios";
import { Header } from "../components";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import swal from "@sweetalert/with-react";

const VideoDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentColor, accountAddress2, status, setAccountAddress, account } =
    useStateContext();
  const [fetchAllData, setFetchAllData] = useState([]);
  const [fetchAllDonerData, setFetchAllDonerData] = useState([]);
  const [totalETHDonation, setTotalETHDonation] = useState(0);
  const [totalMATICDonation, setTotalMATICDonation] = useState(0);
  const [videoLink, setVideoLink] = useState("");
  const [item, setItem] = useState({});
  const param = useParams();

  async function fetchData() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_LOCALHOST_URL}/php/API/fetch_videos`
      );
      setFetchAllData(result.data);
    } catch (error) {
      setFetchAllData([]);
      console.error(error);
    }
  }

  async function fetchDonerData() {
    try {
      var FormData = require("form-data");
      var data = new FormData();
      data.append("id", param.id);
      var config = {
        method: "post",
        url: `${process.env.REACT_APP_LOCALHOST_URL}/php/API/fetch_doner_by_video`,
        data: data,
      };
      axios(config).then(function (response) {
        setFetchAllDonerData(response.data);
      });
    } catch (error) {
      setFetchAllDonerData([]);
      console.error(error);
    }
  }

  const donationData = () => {
    var FormData = require("form-data");
    var data = new FormData();
    data.append("id", param.id);
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_LOCALHOST_URL}/php/API/totalTipping`,
      data: data,
    };
    axios(config)
      .then(function (response) {
        setTotalETHDonation(response.data[0].total_eth_donation_on_video);
        setTotalMATICDonation(response.data[0].total_matic_donation_on_video);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
    donationData();
    fetchDonerData();
  }, []);

  const handleDeleteVideo = async (id) => {
    try {
      var FormData = require("form-data");
      var data = new FormData();
      data.append("id", id);
      var config = {
        method: "post",
        url: `${process.env.REACT_APP_LOCALHOST_URL}/php/API/deleteVideo`,
        data: data,
      };
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this video!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          axios(config)
            .then(function (response) {
              if (JSON.stringify(response.data.status) === "201") {
                swal({
                  title: "Video Deleted Successfully",
                  icon: "success",
                  button: "Ok",
                }).then(() => {
                  navigate("/videos");
                });
              } else {
                swal({
                  title: "Video Not Deleted",
                  icon: "error",
                  button: "Ok",
                }).then(() => {
                  navigate("/videos");
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          swal({
            title: "Error",
            text: "Something went wrong, please try again later",
            icon: "error",
            button: "Ok",
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
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

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header title="Details" />
        <div className="my-cont">
          <div className="bg-gray-80 rounded-lg shadow-xl" id="detail-card">
            {fetchAllData.map((item, index) => {
              return (
                <div key={index}>
                  {item.video_uuid === param.id ? (
                    <div>
                      <div className="details">
                        <div className="details-img">
                          <img
                            src={item.thumbnail_ipfs}
                            alt=""
                            className="rounded-lg p-2"
                            style={{ padding: "1.5rem" }}
                          />
                        </div>

                        <div className="details-info pl-5 pb-5 mt-7">
                          <div className="name p-1 text-sm font-semibold tracking-wide my-3">
                            <h1 className="text-lg font-bold">
                              Name of the Video
                            </h1>
                            <p className="text-color-style my-2">{item.name}</p>
                          </div>
                          <div className="desc p-1 text-sm font-semibold tracking-wide my-3">
                            <h1 className="text-lg font-bold">Description</h1>
                            <p className="text-color-style my-2">
                              {item.video_desc}
                            </p>
                          </div>
                          <div className="category p-1 text-sm font-semibold tracking-wide my-3">
                            <h1 className="text-lg font-bold">Category</h1>
                            <p className="text-color-style my-2">
                              {item.module}
                            </p>
                          </div>
                          <div className="date text-sm font-semibold tracking-wide my-3">
                            <h1 className="text-lg font-bold">
                              Date of Upload
                            </h1>
                            <p className="text-color-style my-2">{item.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })}
          </div>

          <div id="detail-card2">
            {fetchAllData.map((item, index) => {
              return (
                <div key={index}>
                  {item.video_uuid === param.id ? (
                    item.user_type != "user" ? (
                      <div className="btn-container flex gap p-3">
                        <a
                          href={item.link}
                          className="btn bg-gray-90"
                          style={{ background: "#6aa84f", color: "#fff" }}
                        >
                          Play now
                        </a>
                        <Link
                          to={`/editvideo/${param.id}`}
                          className="btn bg-gray-90"
                          style={{ background: "#e69138", color: "#fff" }}
                        >
                          Edit Video
                        </Link>
                        <button
                          className="btn bg-gray-90"
                          onClick={() => handleDeleteVideo(item.video_uuid)}
                          style={{ background: "#f44336", color: "#fff" }}
                        >
                          Delete Video
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-content p-3">
                        <a
                          href={item.link}
                          className="btn bg-gray-70 text-center"
                          style={{ background: "#6aa84f", color: "#fff" }}
                        >
                          Play now
                        </a>
                        <button
                          className="btn bg-gray-70 text-center"
                          onClick={() => handleDeleteVideo(item.video_uuid)}
                          style={{ background: "#f44336", color: "#fff" }}
                        >
                          Delete Video
                        </button>
                      </div>
                    )
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })}

            <div className="total-tipping my-4">
              <div>
                <h1 className="text-xl font-semibold">Total Tipping in ETH</h1>
                <p className="text-color-style my-1">{totalETHDonation} ETH</p>
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  Total Tipping in MATIC
                </h1>
                <p className="text-color-style my-1">
                  {totalMATICDonation} MATIC
                </p>
              </div>
            </div>
            <div className="contributors my-4">
              <h1 className="text-xl font-semibold">Top Contributors</h1>
              <div className="overflow-auto rounded-lg shadow-xl my-2">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th
                        className="p-3 text-sm font-semibold tracking-wide text-left"
                        scope="col"
                      >
                        Sender
                      </th>
                      <th
                        className="p-3 text-sm font-semibold tracking-wide text-left"
                        scope="col"
                      >
                        Amount
                      </th>
                      <th
                        className="p-3 text-sm font-semibold tracking-wide text-left"
                        scope="col"
                      >
                        Transaction Link
                      </th>
                      <th
                        className="p-3 text-sm font-semibold tracking-wide text-left"
                        scope="col"
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchAllDonerData.length > 0 && fetchAllDonerData.map((item, index) => {
                      return (
                        <>
                          <tr key={index} className="bg-gray-50">
                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                              {item.from_user_address.slice(0, 8)}...
                            </td>
                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                              {item.eth_price}
                            </td>
                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                              <a href={item.txn_link}>
                                {item.txn_link.slice(0, 20)}
                              </a>
                              ...
                            </td>
                            <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                              {item.date}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoDetails;
