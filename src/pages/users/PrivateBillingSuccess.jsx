import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading, updateMembership } from "../../store/reducers/userReducer";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Http from "../../services/Http";
import "./PrivateBillingSuccess.css";

const PrivateBillingSuccess = () => {
    const { gateway } = useParams();
    const [ searchParams ] = useSearchParams();
    const [ invoiceId, setInvoiceId ] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy";
        const setPrivateBillingTransaction = async () => {
            dispatch(setLoading(true));
            setTimeout(async () => {
                let paymentId;
                let payerId;
                let historyId = searchParams.get('history_id');
                if (gateway === "paypal") {
                    paymentId = searchParams.get("paymentId");
                    payerId = searchParams.get("PayerID");
                } else if (gateway === "stripe") {
                    paymentId = searchParams.get("session_id");
                    payerId = 0;
                }
                console.log("GATEWAY=====>", gateway, "PAYMENTID======>", paymentId, "PAYERID======>", payerId, "HISTORYID======>", historyId)
                let { data } = await Http.get(`private-billing/${gateway}/return?paymentId=${paymentId}&payerId=${payerId}&historyId=${historyId}`)
                if (data.success) {
                    setInvoiceId(data.invoiceId);
                    dispatch(setLoading(false));
                    dispatch(updateMembership(data.membershipId));
                    toast.success(data.msg);
                } else {
                    if (data.retry) {
                        await setPrivateBillingTransaction();
                    } else {
                        dispatch(setLoading(false));
                        toast.error(data.msg);
                    }
                }
            }, 2500);
            navigate('/private-membership');
        }
        setPrivateBillingTransaction();
    }, []);

    const receiveInvoice = async () => {
        let { data } = await Http.post("private-billing/invoice", {
            invoiceId
        });
        if (data.success) {
            toast.success(data.msg);
            navigate("/subjects");
        } else {
            toast.error(data.msg);
            navigate("/subjects");
        }
    }

    return (
        <div className="private-billing-success-container">
            <Button variant="primary" className="me-3" onClick={receiveInvoice}>
                <i className="fa fa-envelope"></i> Receive invoice
            </Button>
            <Button variant="danger" onClick={() => navigate("/subjects")}>
                <i className="fa fa-undo"></i> Back to subjects
            </Button>
        </div>
    )
}

export default PrivateBillingSuccess;