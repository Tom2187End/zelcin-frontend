import { Row, Col } from "react-bootstrap"
import { BookImg } from "../../../../services/Assets"

const IntroList = ({ title }) => {
  const items = [
    "Study from out high quality syllabus summaries - try for free",
    "Test yourself with our HSC - style exams, trials, and topic tests",
    "Practice with 100's of exam - style questions",
    "Get online support from our tutors"
  ];

  return (
    <div className="intro-list">
      <h2 className="text-center">{title}</h2>
      <Row className="my-4">
        {items.map((item, idx) => (
          <Col lg="6" key={idx} className="mb-0">
            <div className="intro-item">
              <img src={BookImg} alt="book" className="me-2 mt-1" />
              <div>{item}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default IntroList
