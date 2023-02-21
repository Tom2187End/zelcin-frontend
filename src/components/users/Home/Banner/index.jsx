import { Container, Row, Col } from "react-bootstrap";
import { BannerImg } from "../../../../services/Assets";

const Banner = ({title, content}) => {
  return (
    <div className="banner-container">
      <Container>
        <Row>
          <Col lg="5">
            <div className="h-100 d-flex flex-column justify-content-center">
              <h1 className="banner-title">{title}</h1>
              <p className="banner-description">{content}</p>
            </div>
          </Col>
          <Col lg="7" className="text-end">
            <img src={BannerImg} alt="banner" />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Banner
