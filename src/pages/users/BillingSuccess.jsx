import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/reducers/userReducer";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Http from "../../services/Http";
import "./BillingSuccess.css";

const BillingSuccess = () => {
    const { gateway } = useParams();
    const [ searchParams ] = useSearchParams();
    const [ email, setEmail ] = useState();
    const [ invoiceId, setInvoiceId ] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy"
        const setBillingTransaction = async () => {
            dispatch(setLoading(true));
            setTimeout(async () => {
                let paymentId;
                let payerId
                let historyId = searchParams.get('history_id');
                if (gateway === "paypal") {
                    paymentId = searchParams.get("paymentId");
                    payerId = searchParams.get("PayerID");
                } else if (gateway === "stripe") {
                    paymentId = searchParams.get("session_id");
                    payerId = 0;
                }
                let { data } = await Http.get(`billing/${gateway}/return?paymentId=${paymentId}&payerId=${payerId}&historyId=${historyId}`)
                if (data.success) {
                    setEmail(data.email);
                    setInvoiceId(data.invoiceId);
                    dispatch(setLoading(false));
                    toast.success(data.msg);
                } else {
                    if (data.retry) {
                        await setBillingTransaction();
                    } else {
                        dispatch(setLoading(false));
                        toast.error(data.msg);
                    }
                }
            }, 2500);
        }
        setBillingTransaction();
    }, []);
    
    const receiveInvoice = async () => {
        let { data } = await Http.post("billing/invoice", {
            email: email,
            invoiceId: invoiceId
        });
        if (data.success) {
            toast.success(data.msg);
            navigate("/login");
        } else {
            toast.error(data.msg);
            navigate("/login");
        }
    }

    return (
        <div className="billing-success-container">
            <Button variant="primary" className="me-3" onClick={receiveInvoice}><i className="fa fa-envelope"></i> Receive invoice</Button>
            <Button variant="danger" onClick={() => navigate("/login")}><i className="fa fa-undo"></i> Back to login</Button>
        </div>
    )
}

export default BillingSuccess