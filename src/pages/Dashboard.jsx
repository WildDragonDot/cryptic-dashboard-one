import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import { Stacked, Pie, LineChart } from "../components";
import {
  MdOutlineSupervisorAccount,
  MdVideoLibrary,
  MdAttachMoney,
  MdEmojiPeople,
} from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentColor, currentMode, setAccountAddress, status, account } =
    useStateContext();
  const [totalVideos, setTotalVideos] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalDonations, setTotalDonations] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [visitorsData, setVisitorsData] = useState([]);
  const [todayETHDonation, setTodayETHDonation] = useState(0);
  const [todayMATICDonation, setTodayMATICDonation] = useState(0);
  const [todayVideo, setTodayVideo] = useState(0);
  const [weeklyVideo, setWeeklyVideo] = useState(0);
  const [weeklyETHDonation, setWeeklyETHDonation] = useState(0);
  const [weeklyMATICDonation, setWeeklyMATICDonation] = useState(0);
  const [todayVisitor, setTodayVisitor] = useState(0);
  const [weeklyVisitor, setWeeklyVisitor] = useState(0);
  const [unit, setUnit] = useState("ETH");
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

  async function fetchTotal() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_LOCALHOST_URL}/php/API/total_data`
      );
      setTotalVideos(parseInt(result.data[0]["total_video"]));
      setTotalUsers(parseInt(result.data[0]["total_user"]));
      setTotalDonations(parseInt(result.data[0]["total_donation"]));
      setTotalVisitors(parseInt(result.data[0]["total_visitor"]));
    } catch (error) {
      setVideoData([]);
      console.error(error);
    }
  }

  async function fetchLineData() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_LOCALHOST_URL}/php/API/LineChart`
      );
      setVideoData(result.data.reverse());
      setTodayVideo(parseInt(result.data.reverse()[0]["count"]));
      let weeklyData = 0;
      result.data.reverse().map((item) => {
        weeklyData += parseInt(item["count"]);
      });
      setWeeklyVideo(weeklyData);
    } catch (error) {
      setVideoData([]);
      console.error(error);
    }
  }

  async function fetchBarData() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_LOCALHOST_URL}/php/API/BarChart`
      );
      setTodayETHDonation(result.data[0]['count_eth']);
      setTodayMATICDonation(result.data[0]['count_matic']);
      let weeklyethData = 0;
      let weeklymaticData = 0;
      result.data.map((item) => {
        weeklyethData += parseFloat(item["count_eth"]);
        weeklymaticData +=  parseFloat(item["count_matic"]);
      });
      setWeeklyETHDonation(weeklyethData);
      setWeeklyMATICDonation(weeklymaticData);
    } catch (error) {
      setTodayETHDonation(0);
      setTodayMATICDonation(0);
      console.error(error);
    }
  }

  async function fetchVisitors() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_LOCALHOST_URL}/php/API/fetch_visitors`
      );
      setVisitorsData(result.data);
      setTodayVisitor(parseInt(result.data.reverse()[0]["count"]));
      let weeklyData = 0;
      result.data.reverse().map((item) => {
        weeklyData += parseInt(item["count"]);
      });
      setWeeklyVisitor(weeklyData);
    } catch (error) {
      setVisitorsData([]);
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTotal();
    fetchVisitors();
    fetchLineData();
    fetchBarData();
  }, []);

  const data = [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: totalUsers,
      title: "Total Users",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600",
    },
    {
      icon: <MdVideoLibrary />,
      amount: totalVideos,
      title: "Total Videos",
      iconColor: "rgb(255, 244, 229)",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "green-600",
    },
    {
      icon: <MdAttachMoney />,
      amount: totalDonations,
      title: "Total Doner",
      iconColor: "rgb(228, 106, 118)",
      iconBg: "rgb(255, 244, 229)",
      pcColor: "green-600",
    },
    {
      icon: <MdEmojiPeople />,
      amount: totalVisitors,
      title: "Total Visits",
      iconColor: "rgb(0, 194, 146)",
      iconBg: "rgb(235, 250, 242)",
      pcColor: "red-600",
    },
  ];

  const dailyStats = [
    {
      icon: <MdVideoLibrary />,
      total: todayVideo,
      title: "Total Videos",
      unit: "videos",
      iconBg: "#FB9678",
      pcColor: "red-600",
    },
    {
      icon: <MdAttachMoney />,
      total: todayETHDonation,
      title: "Total Donation(ETH)",
      unit: "ETH",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "red-600",
    },
    {
      icon: <MdAttachMoney />,
      total: todayETHDonation,
      title: "Total Donation(MATIC)",
      unit: "MATIC",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "red-600",
    },
    {
      icon: <MdEmojiPeople />,
      total: todayVisitor,
      title: "Total Visitors",
      unit: "visitors",
      iconBg: "#00C292",
      pcColor: "green-600",
    },
  ];
  const weeklyStats = [
    {
      icon: <MdVideoLibrary />,
      total: weeklyVideo,
      title: "Total Videos",
      unit: "videos",
      iconBg: "#FB9678",
      pcColor: "red-600",
    },
    {
      icon: <MdAttachMoney />,
      total: weeklyETHDonation,
      title: "Total Donation(ETH)",
      unit: "ETH",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "red-600",
    },
    {
      icon: <MdAttachMoney />,
      total: weeklyMATICDonation,
      title: "Total Donation(MATIC)",
      unit: "MATIC",
      iconBg: "rgb(254, 201, 15)",
      pcColor: "red-600",
    },
    {
      icon: <MdEmojiPeople />,
      total: weeklyVisitor,
      title: "Total Visitors",
      unit: "visitors",
      iconBg: "#00C292",
      pcColor: "green-600",
    },
  ];

  return (
    <div className="mt-20">
      {/* <Header title="Dashboard"/> */}
      <div className="setStylecardContainer flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="flex m-3 flex-wrap justify-center gap-10 items-center">
          {data.map((item) => (
            <div
              key={item.title}
              className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl shadow-lg"
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">
                  <CountUp end={item.amount} duration={4} />
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <div className="w-750 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-5 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Today's Stats</p>
          </div>

          <div className="mt-10 ">
            {dailyStats.map((item) => (
              <div
                key={item.title}
                className="flex justify-between mt-4 w-full"
                style={{marginRight : "15px"}}
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{ background: item.iconBg }}
                    className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  >
                    {item.icon}
                  </button>
                  <div>
                    <p className="mt-3 text-md font-semibold">{item.title}</p>
                  </div>
                </div>

                <p className={`mt-3 text-${item.pcColor}`}>
                  {item.total} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-750 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-between">
            <p className="text-xl font-semibold">Last 7 Days' Stats</p>
          </div>
          <div className="mt-10 ">
            {weeklyStats.map((item) => (
              <div
                key={item.title}
                className="flex justify-between mt-4 w-full"
                style={{marginRight : "15px"}}
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{ background: item.iconBg }}
                    className="text-2xl hover:drop-shadow-xl text-white rounded-full p-3"
                  >
                    {item.icon}
                  </button>
                  <div>
                    <p className="mt-3 text-md font-semibold">{item.title}</p>
                  </div>
                </div>

                <p className={`mt-3 text-${item.pcColor}`}>
                  {item.total} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="flex gap-10 m-4 flex-wrap justify-center chart">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
            <div className="flex justify-between items-center gap-2 mb-10">
              <p className="text-xl font-semibold">Video Details</p>
            </div>
            <div className="md:w-full overflow-auto">
              <LineChart
                data={videoData}
                id="line-chart"
                xTitle="Day"
                yTitle="No of Videos Uploaded"
                xName="date"
                yName="count"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-10 m-4 flex-wrap justify-center chart">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
            <div className="flex justify-between items-center gap-2 mb-10">
              <p className="text-xl font-semibold">Donation Details</p>
              <div className="z-50"> 
                <div className="dropdown inline-block relative">
                  <button className="border  text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                    <span className="mr-1">Dropdown</span>
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                    </svg>
                  </button>
                  <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                    <li className="">
                      <a
                        className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-11 block whitespace-no-wrap" 
                        onClick={() => setUnit("ETH")}
                      >
                        ETH
                      </a>
                    </li>
                    <li className=""> 
                      <a
                        className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-11 block whitespace-no-wrap"
                        onClick={() => setUnit("MATIC")}
                      >
                        MATIC
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="md:w-full overflow-auto">
              <Stacked type={unit} />
            </div>
          </div>
        </div>

        <div className="flex gap-10 m-4 flex-wrap justify-center chart">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
            <div className="flex justify-between items-center gap-2 mb-10">
              <p className="text-xl font-semibold">Visitors Data</p>
            </div>
            <div className="md:w-full overflow-auto">
              <Pie data={visitorsData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
