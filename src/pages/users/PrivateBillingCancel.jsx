import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateBillingCancel = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(navigate);
    }, []);

    return (<></>);
}

export default PrivateBillingCancel;