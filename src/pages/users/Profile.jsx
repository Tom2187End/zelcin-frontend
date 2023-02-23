import { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Button
} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { createUser } from '../../store/reducers/userReducer'
import { Formik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import Http from '../../services/Http'

const Profile = () => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user.user)
  const token = useSelector(state => state.user.token)
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  })

  const validationProfileSchema = yup.object({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    email: yup
      .string()
      .email('Enter a vaild email.')
      .required('Email is required.')
  })

  const validationPasswordsSchema = yup.object({
    password: yup
      .string()
      .min(8, 'Password should be minimum 8 characters in length.')
      .required('Password is required.'),
    confirmPassword: yup
      .string()
      .test(
        'password-match',
        'Password and Confirm password do not match.',
        function (value) {
          return this.parent.password === value
        }
      )
  })

  useEffect(() => {
    document.title = 'AnswerSheet - Profile'
  }, [])

  useEffect(() => {
    setUser(userState)
  }, [userState])

  const updateProfile = async (user, { resetForm }) => {
    let id = user._id
    let { data } = await Http.put(`users/${id}`, user)
    if (data.status) {
      toast.success(data.msg)
      dispatch(
        createUser({
          user: data.data,
          token: token
        })
      )
    } else {
      toast.error(data.msg)
    }
  }

  const updatePassword = async (passwords, { resetForm }) => {
    let { data } = await Http.patch(`users/${user._id}`, {
      password: passwords.password
    });
    if (data.status) {
      resetForm();
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
  }
  return (
    <Container className='py-3'>
      <Card>
        <Card.Header
          style={{ background: '#3c4b64' }}
          bsPrefix='card-header py-3'
        >
          <Card.Title as='h5' bsPrefix='card-title mb-0 text-light'>
            Profile
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4 className='mb-3'>Update profile</h4>
              <Formik
                enableReinitialize={true}
                validationSchema={validationProfileSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={updateProfile}
                initialValues={user}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label>First name:</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <i className='fa fa-user'></i>
                            </InputGroup.Text>
                            <Form.Control
                              type='text'
                              name='firstName'
                              value={values.firstName}
                              onChange={handleChange}
                              isInvalid={!!errors.firstName}
                              touched={touched}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors.firstName}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Last name:</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <i className='fa fa-user'></i>
                            </InputGroup.Text>
                            <Form.Control
                              type='text'
                              name='lastName'
                              value={values.lastName}
                              onChange={handleChange}
                              isInvalid={!!errors.lastName}
                              touched={touched}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors.lastName}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Email:</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <i className='fa fa-envelope'></i>
                            </InputGroup.Text>
                            <Form.Control
                              type='email'
                              name='email'
                              value={values.email}
                              onChange={handleChange}
                              isInvalid={!!errors.email}
                              touched={touched}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors.email}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Form.Group>
                        <Form.Group>
                          <Button
                            type='submit'
                            variant='primary'
                            className='float-end'
                          >
                            <i className='fa fa-save'></i> Update
                          </Button>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
            <Col md={6}>
              <h4 className='mb-3'>Change password</h4>
              <Formik
                enableReinitialize={true}
                validationSchema={validationPasswordsSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={updatePassword}
                initialValues={passwords}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                      <Form.Label>New password:</Form.Label>
                      <Form.Control
                        type='password'
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        touched={touched}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                      <Form.Label>Confirm password:</Form.Label>
                      <Form.Control
                        type='password'
                        name='confirmPassword'
                        value={values.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        touched={touched}
                      />
                      <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>
                    <Button
                      type='submit'
                      variant='primary'
                      style={{ float: 'right' }}
                    >
                      <i className='fa fa-edit'></i> Change password
                    </Button>
                  </Form>
                )}
                </Formik>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Profile
