import { useState, useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./SubTopics.css";
import TopicIcon from "../../assets/images/topic_icon.svg";

const SubTopics = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState({});
    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy";
        const getTopic = async () => {
            let { year, subject, topic } = params;
            let { data } = await Http.get(`topics/get-topic-by-slug`, {
                params: {
                    year_slug: year,
                    subject_slug: subject,
                    topic_slug: topic
                }
            });
            if (data.success) {
                setTopic(data.data);
            } else {
                toast.error(data.msg);
                navigate(`/subjects`);
            }
        }
        getTopic();
    }, []);

    return (
        <div className="sub-topics-container">
            <Container>
                <Card className="mb-4">
                    <Card.Body className="pt-5 px-5 pb-4">
                        <h2 className="topic-title">{topic.name}</h2>
                        { topic.description && <p>{topic.description}</p>}
                        <div className="sub-topic-list">
                            {
                                topic.subTopics && topic.subTopics.map((topic, idx) => (
                                    <div className="d-grid" key={idx}>
                                        <Link className="btn btn-primary learn-btn" to={`/${params.year}/${params.subject}/${params.topic}/${topic.slug}`}>
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

export default SubTopics;