import { useEffect, useState } from 'react';
import BounceLoader from "react-spinners/BounceLoader";
import { useStateContext } from '../contexts/ContextProvider';

const CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Loader = () => {
    const { currentColor, currentMode, setAccountAddress, status, account } = useStateContext();
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("rgb(63,94,251)");


    return (
        <div className="sweet-loading" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <BounceLoader color={color} loading={loading} cssOverride={CSSProperties} size={150} aria-label="Loading Spinner" />
        </div>
    )
}

export default Loader