import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../store/reducers/userReducer";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { Container, Form, Button } from "react-bootstrap";
import { useGoogleLogin } from "@react-oauth/google";
import Http from "../../services/Http";
import FormInput from "../../components/FormInput";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SignUpSvg from "../../assets/images/Group-14629.svg";
import GoogleSvg from "../../assets/images/google.svg";
import "./SignUp.css";

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let user = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    };

    const validationSchema = yup.object({
        firstName: yup.string('Enter your first name.')
            .required('First name is required.'),
        lastName: yup.string('Enter your last name.')
            .required('Last name is required.'),
        email: yup.string('Enter your email')
            .email('Enter a vaild email.')
            .required('Email is required.'),
        password: yup.string('Enter your password.')
            .min(8, 'Password should be minimum 8 characters in length.')
            .required('Password is required.'),
        confirmPassword: yup.string()
            .test('password-match', 'Password and Confirm password do not match.', function(value) { 
                return this.parent.password === value
            })
    });
    
    useEffect(() => {
        document.title = "AnswerSheet - Sign Up";
    }, []);
    const onRegister = async (user, { resetForm }) => {
        let { data } = await Http.post("register", user);
        if (data.success) {
            resetForm();
            navigate("/confirm-email");
        } else {
            toast.error(data.msg);
        }
    }
    const googleRegister = useGoogleLogin({
        onSuccess: async (tokenRes) => {
            let { data } = await Http.post("register/google", tokenRes);
            if (data.status) {
                toast.success(data.msg);
                await dispatch(createUser({
                    user: data.user,
                    token: data.token
                }));
                navigate("/subjects");
            } else {
                toast.error(data.msg);
            }
        },
        onError: errRes => {
            console.log(errRes)
        }
    });

    return (
        <div className="signup-container">
            <Container>
                <div className="page-content">
                    <div className="page-left-content">
                        <LazyLoadImage src={SignUpSvg} alt="Sign Up"/>
                    </div>
                    <div className="page-right-content">
                        <div className="signup-form">
                            <h1 className="page-title">Create account</h1>
                            <Formik 
                                // validationSchema={validationSchema}
                                validateOnChange={false}
                                validateOnBlur={false}
                                onSubmit={onRegister}
                                initialValues={user}
                            >
                                {({handleSubmit, handleChange, values, touched, errors}) => (
                                    <Form noValidate onSubmit={handleSubmit} className="mt-4">
                                        <div className="d-grid">
                                            <Button variant="primary" className="google-signup-btn" onClick={googleRegister}>
                                                <LazyLoadImage src={GoogleSvg} alt="google" />
                                                Sign up with Google
                                            </Button>
                                        </div>
                                        <div style={{display: "flex", alignItems: 'center', justifyContent: 'center'}}>
                                            <div style={{flex: 1}}><hr/></div>
                                            <div className="py-2 px-3 fw-bold text-dark">OR</div>
                                            <div style={{flex: 1}}><hr/></div>
                                        </div>
                                        <FormInput 
                                            required
                                            name="firstName"
                                            className="mb-4" 
                                            icon="fa fa-user" 
                                            type="text" 
                                            placeholder="First name"
                                            onChange={handleChange}
                                            value={values.firstName}
                                            touched={touched}
                                            errors={errors}
                                            /> 
                                        <FormInput 
                                            required
                                            name="lastName"
                                            className="mb-4" 
                                            icon="fa fa-user" 
                                            type="text" 
                                            placeholder="Last name"
                                            onChange={handleChange}
                                            value={values.lastName}
                                            touched={touched}
                                            errors={errors}/>
                                        <FormInput 
                                            required
                                            name="email"
                                            className="mb-4" 
                                            icon="fa fa-envelope" 
                                            type="email" 
                                            placeholder="Email"
                                            onChange={handleChange}
                                            value={values.email}
                                            touched={touched}
                                            errors={errors}
                                            />
                                        <FormInput 
                                            required
                                            name="password"
                                            className="mb-4" 
                                            icon="fa fa-lock" 
                                            type="password" 
                                            placeholder="Create password"
                                            onChange={handleChange}
                                            value={values.password}
                                            touched={touched}
                                            errors={errors}
                                            />
                                        <FormInput
                                            required
                                            name="confirmPassword"
                                            className="mb-5"
                                            icon="fa fa-check"
                                            type="password"
                                            placeholder="Confirm password"
                                            onChange={handleChange}
                                            value={values.confirmPassword}
                                            touched={touched}
                                            errors={errors}
                                            />
                                        <div className="d-grid">
                                            <Button variant="primary" type="submit">Create account</Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default SignUp;