import { useState, useEffect } from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"
import Http from "../../../../services/Http"
import { Year11Img, Year12Img, LockImg } from "../../../../services/Assets"

const CategoryList = () => {
    const [years, setYears] = useState([]);

    useEffect(() => {
        (async () => {
            let { data } = await Http.get("years")
            setYears(data.data);
        })();
    }, []);

    return (
        <Row>
            {years.length !== 0 &&
              years.map((year, idx) => (
                <Col lg="6" key={idx}>
                  <div className="category">
                    <div className="category-list-content">
                      <h3 className="category-title">{year.name}</h3>
                      <Nav className="flex-column">
                        {year.subjects.map((subject, idx) => (
                          <Nav.Item key={idx}>
                            <LinkContainer to={`/${year.slug}/${subject.slug}`}>
                              <Nav.Link className="d-flex">
                                <i className="fa fa-circle"></i> 
                                <span>{subject.name}</span>
                              </Nav.Link>
                            </LinkContainer>
                          </Nav.Item>
                        ))}
                      </Nav>
                    </div>
                    <div className="category-banner-content">
                      <img
                        src={idx ? Year12Img : Year11Img}
                        className="category-banner-img"
                        alt="year-banner"
                      />
                      <img
                        src={LockImg}
                        alt="Lock"
                        className="category-lock-img"
                      />
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
    )
}

export default CategoryList;