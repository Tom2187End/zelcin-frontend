import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import TopicIcon from "../../assets/images/topic_icon.svg";
import "./Topics.css";

const Topics = () => {
    const params = useParams(); 
    const navigate = useNavigate();
    const [subject, setSubject] = useState({});
    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy";
        const getSubject = async () => {
            let { year, subject } = params;
            let { data } = await Http.get(`subjects/get-subject-by-slug`, {
                params: {
                    year_slug: year, 
                    subject_slug: subject
                }
            });
            if (data.success) {
                setSubject(data.data);
            } else {
                toast.error(data.msg);
                navigate("/subjects");
            }
        }
        getSubject();
    }, []);
    return (
        <div className="topics-container">
            <Container>
                <Card className="mb-4">
                    <Card.Body className="pt-5 px-5 pb-4">
                        <h2 className="subject-title">{subject.name}</h2>
                        { subject.description && <p>{subject.description}</p>}
                        <div className="topic-list">
                            {
                                subject.topics && subject.topics.map((topic, idx) => (
                                    <div className="d-grid" key={idx}>
                                        <Link className="btn btn-primary learn-btn" to={`/${params.year}/${params.subject}/${topic.slug}`}>
                                            <img src={TopicIcon} alt="Icon"/> <span>{topic.name}</span>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>        
    )
}

export default Topics;