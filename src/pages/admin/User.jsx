import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Http from '../../services/Http'
import { Card, Table, Form, Row, Col, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import moment from 'moment'
import { toast } from 'react-toastify'

const User = () => {
  const params = useParams()
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: ""
  });

  const [memberships, setMemberships] = useState({})
  const [invoices, setInvoices] = useState([])

  const validationProfileSchema = yup.object({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    email: yup
      .string()
      .email('Enter a vaild email.')
      .required('Email is required.')
  });

  const validationPasswordsSchema = yup.object({
    password: yup
      .string()
      .required('Password is required.')
      .min(8, 'Password should be minimum 8 characters in length.')
      .required('Password is required.'),
    confirmPassword: yup
      .string()
      .test('password-match', 'Password and Confirm password do not match.', function (value) {
        return this.parent.password === value
      })
  })

  useEffect(() => {
    const getUser = async () => {
      let id = params.id
      let { data } = await Http.get(`admin/users/${id}`)
      setUser({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email
      })
      setMemberships(data.memberships)
      setInvoices(data.invoices)
    }
    getUser()
  }, []);

  
  const updateProfile = async (user, { resetForm }) => {
    let { data } = await Http.put(`admin/users/${params.id}`, user);
    if (data.status) {
      toast.success(data.msg);
    } else {
      toast.error(data.msg);
    }
  }
  
  const updatePassword = async (passwords, { resetForm }) => {
    let { data } = await Http.put(`admin/users/${params.id}/password`, {
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
    <Row gutter={15}>
      <Col md={6}>
        <Card className='mb-4'>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h5' bsPrefix='mb-0 card-title text-light'>
              User profile
            </Card.Title>
          </Card.Header>
          <Card.Body className='p-4'>
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
                        <Form.Control
                          type='text'
                          name='firstName'
                          onChange={handleChange}
                          value={values.firstName}
                          isInvalid={!!errors.firstName}
                          touched={touched}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Last name:</Form.Label>
                        <Form.Control
                          type='text'
                          name='lastName'
                          onChange={handleChange}
                          value={values.lastName}
                          isInvalid={!!errors.lastName}
                          touched={touched}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                          type='email'
                          name='email'
                          onChange={handleChange}
                          value={values.email}
                          isInvalid={!!errors.isInvalid}
                          touched={touched}
                        />
                        <Form.Control.Feedback type='invalid'>
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" variant='primary' style={{ float: 'right' }}>
                    Update profile
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className='mb-4'>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h5' bsPrefix='mb-0 card-title text-light'>
              Change password
            </Card.Title>
          </Card.Header>
          <Card.Body className='p-4'>
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
                      name="password"
                      onChange={handleChange}
                      value={values.password}
                      isInvalid={!!errors.password}
                      touched={touched}
                    />
                    <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className='mb-3'>
                    <Form.Label>Confirm password:</Form.Label>
                    <Form.Control 
                      type='password' 
                      name="confirmPassword"
                      onChange={handleChange}
                      value={values.confirmPassword}
                      isInvalid={!!errors.confirmPassword}
                      touched={touched}/>
                    <Form.Control.Feedback type='invalid'>{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant='primary' style={{ float: 'right' }}>
                    Change password
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12}>
        <Card className='mb-4'>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h5' bsPrefix='mb-0 card-title text-light'>
              Invoice histories
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table bordered hover className='text-center mb-0'>
              <thead
                style={{
                  background: '#3c4b64',
                  color: '#fafafa',
                  borderColor: 'rgb(44 56 74 / 95%)'
                }}
              >
                <tr>
                  <th>No</th>
                  <th>Invoice number</th>
                  <th>Amount</th>
                  <th>Paid date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length ? (
                  invoices.map((invoice, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{invoice._id}</td>
                      <td>${invoice.amount}</td>
                      <td>
                        {moment(invoice.paid_date).format(
                          'YYYY.MM.DD HH:mm:ss'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className='text-danger'>
                      Empty invoices
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12}>
        <Card className='mb-4'>
          <Card.Header
            style={{ background: '#3c4b64' }}
            bsPrefix='card-header py-3'
          >
            <Card.Title as='h5' bsPrefix='mb-0 card-title text-light'>
              Premium memberships
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Table bsPrefix='table table-bordered' className='text-center'>
              <thead
                style={{
                  background: '#3c4b64',
                  color: '#fafafa',
                  borderColor: 'rgb(44 56 74 / 95%)'
                }}
              >
                <tr>
                  <th>Subjects</th>
                  <th>End date</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {memberships.length ? (
                  memberships.map((membership, idx) => (
                    <tr key={idx}>
                      <td>
                        <ul className='mb-0'>
                          {membership.subjects.map((subject, idx) => (
                            <li key={idx}>
                              {subject.year.name} - {subject.name}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {Number(membership.period) === -1
                          ? '-'
                          : moment(membership.expiredDate).format(
                              'YYYY.MM.DD HH:mm:ss'
                            )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className='text-danger'>
                      Empty memberships
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default User
