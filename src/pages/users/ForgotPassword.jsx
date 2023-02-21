import { useEffect } from "react";
import { Formik } from 'formik'
import { Card, Form, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import * as yup from 'yup'
import FormInput from '../../components/FormInput'
import Http from "../../services/Http";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  let user = {
    email: ''
  }
  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Email is invalid.')
      .required('Email is required field.')
  });

  useEffect(() => {
    document.title = 'AnswerSheet - HSC made easy';
  }, []);

  const onVerifyEmail = async (user, { resetForm }) => {
    let { data } = await Http.post("forgot-password", user);
    if (data.status) {
        toast.success(data.msg);
    } else {
        toast.error(data.msg);
    }
    resetForm();
  }

  return (
    <div className='forgot-password-container'>
        <Card style={{flexBasis: 450}}>
          <Card.Body className="px-5 py-5">
            <Card.Title as="h3" className="mb-3 text-center">Forgot password</Card.Title>
            <p className="text-center">Please enter your email address and we will send you instructions on how to reset your password.</p>
            <Formik
              validationSchema={validationSchema}
              onSubmit={onVerifyEmail}
              initialValues={user}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <FormInput
                    required
                    name='email'
                    className='mb-4'
                    icon='fa fa-envelope'
                    type='email'
                    placeholder='Please enter your email.'
                    onChange={handleChange}
                    value={values.email}
                    touched={touched}
                    errors={errors}
                  />
                  <div className="d-grid">
                    <Button type="submit" variant="primary">Submit</Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
    </div>
  )
}

export default ForgotPassword
