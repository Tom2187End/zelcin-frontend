import { useEffect } from "react";
import { Formik } from 'formik'
import { Card, Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import FormInput from '../../components/FormInput'
import Http from '../../services/Http'
import './ResetPassword.css'

const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const passwords = {
    newPassword: '',
    confirmPassword: ''
  }

  const validationSchema = yup.object({
    newPassword: yup
      .string('Enter your password.')
      .min(8, 'Password should be minimum 8 characters in length.')
      .required('Password is required.'),
    confirmPassword: yup
      .string('Enter your confirm password.')
      .test('password-match', 'Password and Confirm password do not match.', function (value) {
        return this.parent.newPassword === value
      })
  })

  useEffect(() => {
    document.title = "AnswerSheet - HSC made easy";
  }, []);

  const onRestPassword = async (passwords, { resetForm }) => {
    let { newPassword: password } = passwords;
    let { token } = params;
    let { data } = await Http.post('reset-password', {
        password, token
    });
    if (data.status) {
        toast.success(data.msg);
        navigate("/login");
    } else {
        toast.error(data.msg);
    }
  }

  return (
    <div className='reset-password-container'>
      <Card style={{ flexBasis: 450 }}>
        <Card.Body className='px-5 py-5'>
          <Card.Title as='h3' className='mb-4 text-center'>
            Reset password
          </Card.Title>
          <Formik
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={onRestPassword}
            initialValues={passwords}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <FormInput
                  required
                  name='newPassword'
                  className='mb-4'
                  icon='fa fa-key'
                  type='password'
                  placeholder='New password'
                  onChange={handleChange}
                  value={values.newPassword}
                  touched={touched}
                  errors={errors}
                />
                <FormInput
                  required
                  name='confirmPassword'
                  className='mb-4'
                  icon='fa fa-lock'
                  type='password'
                  placeholder='Confirm password'
                  onChange={handleChange}
                  value={values.confirmPassword}
                  touched={touched}
                  errors={errors}
                />
                <div className='d-grid'>
                  <Button type='submit' variant='primary'>
                    Reset
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ResetPassword
