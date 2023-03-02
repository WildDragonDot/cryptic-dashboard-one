import { useState, useEffect } from 'react';
import './signup.css';
import { ethers } from 'ethers';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate = useNavigate();
    const [haveMetamask, sethaveMetamask] = useState(true);
    const [accountBalance, setAccountBalance] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const { status, connect, account,setAccountAddress, chainId, ethereum } = useStateContext();
    useEffect(() => {
        const checkMetamaskAvailability = async () => {
            if (!ethereum) {
                sethaveMetamask(false);
            }
            sethaveMetamask(true);
        };
        checkMetamaskAvailability();
    }, []);

    const connectWallet = async () => {
        if (ethereum !== undefined) {
            connect();
            if (status === 'connected') {
                setAccountAddress(account);
                navigate('/dualauth');
            }
            else if (status === 'notConnected') {
                setAccountAddress(null);
                navigate('/login');
            }
        }
    };

    return (
        <div className="relative min-h-screen flex ">
            <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
                <div className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
                    style={{ backgroundImage: "url(https://images.unsplash.com/photo-1579451861283-a2239070aaa9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)" }}>
                    <div className="absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0"></div>
                    <div className="w-full  max-w-md z-10">
                        <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">Cryptic Dashboard</div>
                        <div className="sm:text-sm xl:text-md text-gray-200 font-normal">Cryptic is a decentrlize video ott plateform. where you can learn about crypto.</div>
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
                <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-slate-900">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-bold text-white">
                                Welcom Back!
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">Please Connect with your account</p>
                        </div>
                        <div className="flex flex-row justify-center items-center space-x-3 bg-slate-200 w-60 m-auto rounded-2xl">
                            <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank"
                                className="w-40 h-11 items-center justify-center inline-flex rounded-2xl font-bold text-lg  text-white hover:shadow-lg cursor-pointer transition ease-in duration-300"><img
                                    src="https://1000logos.net/wp-content/uploads/2022/05/MetaMask-Emblem.png"
                                    className="w-full" /></a>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="h-px w-16 bg-gray-200"></span>
                            <span className="text-gray-300 font-normal">Connect with metamask</span>
                            <span className="h-px w-16 bg-gray-200"></span>
                        </div>
                        <form className="mt-8 space-y-6" action="#" method="POST">
                            <div>
                                <button type="button" onClick={connectWallet}
                                    className="w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600  hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                                    Connect
                                </button>
                            </div>
                            <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                                <span>Install metamask extension for login.</span>
                                <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank"
                                    className="text-indigo-400 hover:text-blue-500 no-underline hover:underline cursor-pointer transition ease-in duration-300">metamask extension</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;