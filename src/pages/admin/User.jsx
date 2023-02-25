import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Http from '../../services/Http'
import { Card, Table, Form, Row, Col, Button, Modal, Accordion } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import moment from 'moment'
import { toast } from 'react-toastify'
import './User.css';

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
  const [isOpen, setIsOpen] = useState(false);
  const [years, setYears] = useState([]);
  const [memberships, setMemberships] = useState({})
  const [invoices, setInvoices] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])

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

  useEffect(() => {
    const getYears = async () => {
      let { data } = await Http.get('years')
      if (data.success) {
        setYears(data.data)
      } else {
        toast.error(data.msg)
      }
    }
    getYears()
  }, [])

  const selectSubject = (subject, year) => {
    let subjects = [...selectedSubjects]
    let find = subjects.indexOf(subject)
    if (find > -1) {
      console.log(subjects);
      subjects.splice(find, 1)
    } else {
      subject.year_name = year.name;
      subjects.push(subject)
    }
    setSelectedSubjects(subjects)
  }
  const isSelectedSubject = _subject => {
    if (selectedSubjects.findIndex(subject => subject === _subject) === -1) {
      return false
    } else {
      return true
    }
  }
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
  const onAddMembership = () => {
    console.log("ADDMEMBERSHIP")
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
                      touched={touched} />
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
                  <th>Invoice number</th>
                  <th>Actions</th>
                  <th>Amount</th>
                  <th>Paid date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length ? (
                  invoices.map((invoice, idx) => (
                    <tr key={idx}>
                      <td>{invoice._id}</td>
                      <td>
                        <Button variant="success" size="sm" className="me-1"><i className="fa fa-eye"></i></Button>
                        <Button variant="primary" size="sm" className="me-1"><i className="fa fa-edit"></i></Button>
                        <Button variant="danger" size="sm" className="me-1"><i className="fa fa-trash"></i></Button>
                      </td>
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
                  <th>Invoice Number</th>
                  <th>Current Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {memberships.length ? (
                  memberships.map((membership, idx) => (
                    <tr key={idx}>
                      <td>
                        <ul className='mb-0' style={{ listStyleType: 'none' }}>
                          {membership.subjects.map((subject, idx) => (
                            <li key={idx}>
                              {subject.year.name} - {subject.name}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {
                          invoices[idx]._id
                        }
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {Number(membership.period) === -1
                          ? '-'
                          : moment(membership.expiredDate).format(
                            'YYYY.MM.DD HH:mm:ss'
                          )}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <Button variant="success" size="sm" className="me-1"><i className="fa fa-eye"></i></Button>
                        <Button variant="primary" size="sm" className="me-1"><i className="fa fa-edit"></i></Button>
                        <Button variant="danger" size="sm" className="me-1"><i className="fa fa-trash"></i></Button>
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
            <Button variant="primary" className="" onClick={() => setIsOpen(true)}><i className="fa fa-plus"></i> Add membership</Button>
            <Modal
              show={isOpen}
              onHide={() => setIsOpen(false)}
              centered
              size='lg'
              className='add-membership-modal'
            >
              <Modal.Body className='p-4'>
                <Modal.Title as='h3' className='mb-2'>
                  Add membership
                </Modal.Title>
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  onSubmit={onAddMembership}
                  initialValues={years}
                  enableReinitialize
                >
                  {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <div>
                        <p className='fs-5 fw-400 mb-1'>Subject(s)</p>
                        <Accordion defaultActiveKey={-1}>
                          {years.map((year, idx) => (
                            <Accordion.Item key={idx} eventKey={idx}>
                              <Accordion.Header>{year.name}</Accordion.Header>
                              <Accordion.Body>
                                <ul className='mb-0 nav flex-column'>
                                  {year.subjects.map((subject, idx) => (
                                    <li
                                      key={idx}
                                      className='py-2'
                                      onClick={() => selectSubject(subject, year)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {subject.name}
                                      <Form.Check
                                        inline
                                        name='subjects'
                                        className='float-end'
                                        checked={
                                          isSelectedSubject(subject) ? true : false
                                        }
                                        value={subject}
                                        onChange={ev => selectSubject(ev.target.value, year)}
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </div>
                      <Row className="mb-3">
                        <Col sm={12} lg={6}>
                          <Form.Select
                            name="continue-until"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.membership}
                            touched={touched}
                            isInvalid={!!errors.membership}
                            className="mb-2"
                          >
                            {/* {years.map((year, idx) => <option key={idx} value={year._id}>{year.name}</option>)} */}
                          </Form.Select>
                        </Col>
                        <Col sm={12} lg={6}>
                          <Form.Select
                            name="link-invoice"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.invoice}
                            touched={touched}
                            isInvalid={!!errors.invoice}
                            className="mb-2"
                          >

                          </Form.Select>
                        </Col>
                      </Row>
                      <Button variant="primary" type="summit" className="form-control">Add membership</Button>
                      <button
                        className='btn-close'
                        onClick={() => setIsOpen(false)}
                      ></button>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default User
