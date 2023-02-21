import { useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import "./ConfirmEmail.css";

const ConfirmEmail = () => {
    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy"
    }, []);

    return (
        <div className="confirm-email-container d-flex align-items-center justify-content-center">
            <Container className="d-flex align-items-center justify-content-center">
                <Card style={{flexBasis: 500, textAlign: 'center', padding: 20}}>
                    <Card.Body>
                        <img width="160" src={require("../../assets/images/success_register.jpg")} alt="Successful Register"/>
                        <h3>Sign up successful</h3>
                        <p style={{fontSize: 20}}>Check your email for a validation link.</p>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default ConfirmEmail;