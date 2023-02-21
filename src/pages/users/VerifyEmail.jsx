import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../../store/reducers/userReducer";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Http from "../../services/Http";

const VerifyEmail = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy"
        const abortController = new AbortController();
        setVerifyEmail(abortController.signal);
        return () => abortController.abort();
    }, []);

    const setVerifyEmail = async (signal) => {
        let { data } = await Http.get(`verify-email/${token}`, { signal });
        if (data.status) {
            toast.success(data.msg);
            await dispatch(createUser({
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
                <span className="alert alert-success">Please wait while verifing your email...</span>
            </Container>
        </div>
    )
}

export default VerifyEmail;