import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import Http from "../../services/Http";
import "./Membership.css";

const Membership = () => {
    const navigate = useNavigate()
    const [price, setPrice] = useState(0);
    useEffect(() => {
        document.title = "AnswerSheet - Get Access to our HSC resources";
        const get3Month1SubjectPricing = async () => {
            let { data } = await Http.get('memberships/get-membership-price', {
                params: {
                    period: 3,
                    subject_nums: 1
                }
            });
            setPrice(data.price)
        }
        get3Month1SubjectPricing()
    }, []);
    return (
        <div className="membership-container py-4">
            <Container>
                <h1 className="page-title text-center">Membership</h1>
                <div className="membership-items">
                    <Card className="membership-item">
                        <Card.Body>
                            <div className="membership-header">
                                <p>Free</p>
                                <p>Membership</p>
                            </div>
                            <div className="membership-content py-3 px-1">
                                <ul style={{listStyle: 'none'}}>
                                    <li><i className="fa fa-check"></i> High quality syllabus summaries.</li>
                                    <li><i className="fa fa-check"></i> HSC exam-style practice questions.</li>
                                </ul>
                                <div className="d-grid mx-3 mt-auto">
                                    <Button variant="primary" onClick={() => navigate("/signup")}>Sign Up For Free</Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="membership-item">
                        <Card.Body>
                            <div className="membership-header-mask"></div>
                            <div className="membership-header premium-membership-header">
                                <p>Premium</p>
                                <p>Membership</p>
                                <h1 className="text-light mt-2">${price}</h1>
                            </div>
                            <div className="membership-content py-3 px-1">
                                <ul style={{listStyle: 'none'}}>
                                    <li><i className="fa fa-check"></i> High quality syllabus summaries - All topics.</li>
                                    <li><i className="fa fa-check"></i> 100’s of HSC exam-style practice questions - ALL topics.</li>
                                    <li><i className="fa fa-check"></i> Practice exams - HSC, trials, yearlies, by topic etc.</li>
                                    <li><i className="fa fa-check"></i> Homework help.</li>
                                </ul>
                                <div className="d-grid mx-3">
                                    <Button variant="primary" onClick={() => navigate("/premium-membership")}>View pricing</Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </div>
    )
}

export default Membership;