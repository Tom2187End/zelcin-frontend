import { useEffect } from "react"
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './AboutUs.css'

const AboutUs = () => {
  useEffect(() => {
    document.title = "AnswerSheet - HSC tutoring alternative";
  }, []);
  return (
    <div className='about-us-container'>
      <Container>
        <h1 className='page-title text-center'>About us</h1>
        <p className='text-center page-description'>We make the HSC Easy.</p>
        <p className='text-center fw-bold'>
          Our learning materials cover the entire syllabus and includes:
        </p>
        <Row className="about-items my-5">
          <Col md={6}>
            <Card className="mt-2 mb-3 shadow">
              <Card.Body className="p-4">
                <Card.Title as='h4' className='about-item-title'>
                  Exam-relevant summary of
                  <br /> each dot-point
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mt-2 mb-3 shadow">
              <Card.Body className="p-4">
                <Card.Title as='h4' className='about-item-title'>
                  Questionnaire bank in HSC<br/> exam style, separated by topic
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mt-2 mb-3 shadow">
              <Card.Body className="p-4">
                <Card.Title as='h4' className='about-item-title'>
                  Practice exams by modules<br/> and topics
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mt-2 mb-3 shadow">
              <Card.Body className="p-4">
                <Card.Title as='h4' className='about-item-title'>
                  Exam-relevant summary of<br/> of each dot-point
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <p className='text-center'>
          Our learning materials are written by an inhouse team of academics and
          HSC markers.
        </p>
        <h6 className='text-center'>
          <Link className='to-signup fw-bold' to='/signup'>
            Sign up form a free account to view our learning materials
          </Link>
        </h6>
      </Container>
    </div>
  )
}

export default AboutUs
