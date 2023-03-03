import { useState, useEffect } from "react";
import "./signup.css";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import swal from "@sweetalert/with-react"; 

const DualAuth = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { status, account, setAccountAddress, chainId } = useStateContext();

  const handleLogin = async () => {
    if (status === "notConnected") {
      setAccountAddress(null);
      navigate("/login");
    } else if (status === "connected") {
      var FormData = require("form-data");
      var data = new FormData();
      data.append("username", username);
      data.append("password", password);
      var config = {
        method: "post",
        url: `${process.env.REACT_APP_LOCALHOST_URL}/php/API/dual_auth`,
        data: data,
      };
      axios(config).then(function (response) {
        if (response.data["userExists"] === true) {
          sessionStorage.setItem("finflixUser", account);
          setAccountAddress(account);
          swal({
              title: "Success!",
              text: "You have successfully logged in!",
              icon: "success",
              button: "OK",
            }).then(() => {
            navigate("/");
            });
        } else {
          swal({ 
            title: "Error!",
            text: "Incorrect username or password!",
            icon: "error",
            button: "OK",
          });
        }
      });
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
        navigate("/dualauth");
      } else {
        setAccountAddress(account);
        navigate("/");
      }
    }
  }, [status, accountAddress]);

  return (
    <div className="relative min-h-screen flex ">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        <div
          className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1579451861283-a2239070aaa9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)",
          }}
        >
          <div className="absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0"></div>
          <div className="w-full  max-w-md z-10">
            <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Finflix Dashboard
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal">
              Finflix is a decentrlize video ott plateform. where you can learn
              about crypto.
            </div>
          </div>
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Password Authentication
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Please login with your username and password
              </p>
            </div>

            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="my-4">
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="my-4">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600  hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualAuth;
