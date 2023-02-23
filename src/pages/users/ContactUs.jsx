import { useEffect } from 'react'
import Http from '../../services/Http'
import { toast } from 'react-toastify'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Container, Card, Row, Col, Nav, Form, Button } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PhoneIcon from '../../assets/images/sms.svg'
import DiscordIcon from '../../assets/images/discord.svg'
import EmailIcon from '../../assets/images/chat.svg'
import SkypeIcon from '../../assets/images/fb_messanger.svg'
import './ContactUs.css'
import { useNavigate } from 'react-router-dom'

const ContactUs = () => {
  useEffect(() => {
    document.title = 'AnswerSheet - Contact Us'
  }, [])

  const navigate = useNavigate()
  let contact = { name: '', email: '', message: '' }
  // let contact = { name: '', email: '', message: '', acceptPrivacyPolicy: false }
  const validationSchema = yup.object({
    name: yup.string('Enter your name.').required('Name is required.'),
    email: yup
      .string('Enter your email.')
      .email('Enter a valid email.')
      .required('Email is required.'),
    acceptPrivacyPolicy: yup
      .bool()
      .oneOf([true], 'Accept Privacy & Policy is required.')
  })
  const onSendMessage = async (contact, { resetForm }) => {
    console.log(contact)
    // try {
    //   let { data } = await Http.post('message', {
    //     name: contact.name,
    //     email: contact.email,
    //     message: contact.message
    //   })
    //   if (data.success) {
    //     toast.success(data.data.msg)
    //     resetForm()
    //     navigate('/confirm-contact');
    //   } else {
    //     toast.error(data.data.msg)
    //   }
    // } catch (err) {
    //   toast.error(err.getMessage())
    // }
  }
  return (
    <div className='contact-us-container'>
      <Container>
        <Row>
          <Col lg={5} md={12}>
            <Card>
              <h1 className='page-title'>Message us</h1>
              <Card.Body>
                <div className='contact-list'>
                  <Nav className='flex-column'>
                    <Nav.Item>
                      <Nav.Link href='#'>
                        <LazyLoadImage src={PhoneIcon} alt='sms' /> 0411444111
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href='#'>
                        <LazyLoadImage src={DiscordIcon} alt='discord' />{' '}
                        0411444111
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href='#'>
                        <LazyLoadImage src={EmailIcon} alt='email' />{' '}
                        AnswerSheet
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href='#'>
                        <LazyLoadImage src={SkypeIcon} alt='fbmassenger' />{' '}
                        Message us
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link href='#'>
                        <small style={{ fontSize: 12 }}>
                          We endeavour to reply with 1 business day, most of the
                          time sooner.
                        </small>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={7} md={12}>
            <Card>
              <h1 className='page-title'>Email us</h1>
              <Card.Body>
                <Formik
                  validationSchema={validationSchema}
                  onSubmit={onSendMessage}
                  validateOnChange={false}
                  validateOnBlur={false}
                  initialValues={contact}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    errors
                  }) => (
                    <Form
                      className='contact-us-form'
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <Row gutter={10}>
                        <Col md={4}>
                          <Form.Group className='mb-4'>
                            <Form.Control
                              type='text'
                              placeholder='Your name'
                              name='name'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.name}
                              touched={touched}
                              isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors.name}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group className='mb-4'>
                            <Form.Control
                              type='email'
                              placeholder='Reply email'
                              name='email'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              touched={touched}
                              isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group className='mb-4'>
                            <Form.Select
                              as="select"
                              name='enquiryNature'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.enquiryNature}
                              defalutValue={"sales"}
                              touched={touched}
                              isInvalid={!!errors.enquiryNature}
                            >
                              <option value="sales">Sales</option>
                              <option value="tech">Tech support</option>
                              <option value="others">Other</option>
                            </Form.Select>
                            {/* <Form.Control.Feedback type='invalid'>
                              {errors.enquiryNature}
                            </Form.Control.Feedback> */}
                          </Form.Group>
                        </Col>
                        <Col md={8}>
                          <Form.Group className='mb-4'>
                            <Form.Control
                              as='textarea'
                              placeholder='Your message'
                              rows={7}
                              name='message'
                              value={values.message}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              style={{minHeight: 'calc(12.3rem)'}}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          {/* <Form.Group className='mb-3'>
                            <Form.Label
                              className={
                                'terms-and-conditions ' +
                                (!!errors.acceptPrivacyPolicy
                                  ? 'is-invalid'
                                  : '')
                              }
                            >
                              <Form.Check
                                inline
                                name='acceptPrivacyPolicy'
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.acceptPrivacyPolicy}
                                touched={touched}
                                isInvalid={!!errors.acceptPrivacyPolicy}
                              />{' '}
                              I agree to the privacy policy
                            </Form.Label>
                            <Form.Control.Feedback type='invalid'>
                              {errors.acceptPrivacyPolicy}
                            </Form.Control.Feedback>
                          </Form.Group> */}
                          <div className='d-grid mt-2 mb-3'>
                            <Button variant='primary' type='submit'>
                              Submit
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ContactUs
