import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SubjectsSvg from "../../assets/images/Group-14631.svg"
import SubjectIcon from "../../assets/images/subject_icon.svg";
import "./Subjects.css";
const Subjects = () => {
    const [years, setYears] = useState([]);
    useEffect(() => {
        document.title = "AnswerSheet - HSC study guides to help you get a band 6";
        const getYears = async () => {
            let { data } = await Http.get("years");
            if (data.success) {
                setYears(data.data);
            } else {
                toast.error(data.msg);
            }
        }
        getYears();
    }, []);
    return (
        <div className="subjects-container">
            <Container>
                {
                    years.map((year, idx) => (
                        <Card className="mb-4" key={idx}>
                            <Card.Body className="pt-4 pt-sm-4 pt-md-5 pt-3 px-sm-4 px-md-5  pb-3 pb-sm-4">
                                <div className="d-flex justify-content-between">
                                    <div className="pe-lg-3 pe-0">
                                        <h1 className="year-title">{year.name}</h1>
                                        {year.description && <p>{year.description}</p>}
                                        <div className="subject-list">
                                            {
                                                year.subjects.map((subject, idx) => (
                                                    <div key={idx} className="d-grid">
                                                        <Link className="btn btn-primary learn-btn" to={`/${year.slug}/${subject.slug}`} key={idx}>
                                                            <LazyLoadImage src={SubjectIcon} alt="Icon"/> <span>{subject.name}</span>
                                                        </Link>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <LazyLoadImage className="subjects-image" src={SubjectsSvg} alt="subject"/>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                }
            </Container>
        </div>        
    )
}

export default Subjects;