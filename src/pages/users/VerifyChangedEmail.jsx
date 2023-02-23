import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/reducers/userReducer";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Http from "../../services/Http";

const VerifyChangedEmail = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy"
        const abortController = new AbortController();
        setVerifyChangedEmail(abortController.signal);
        return () => abortController.abort();
    }, []);

    const setVerifyChangedEmail = async (signal) => {
        let { data } = await Http.get(`verify-changed-email/${token}`, { signal });
        if (data.status) {
            toast.success(data.msg);
            await dispatch(updateUser({
                user: data.user,
                token: data.token
            }));
            navigate("/subjects");
        } else {
            toast.error(data.msg);
            navigate("/login")
        }
    }
    return (
        <div className="page-container d-flex align-items-center justify-content-center">
            <Container className="text-center">
                <span className="alert alert-success">Please wait while verifing your new email...</span>
            </Container>
        </div>
    )
}

export default VerifyChangedEmail;