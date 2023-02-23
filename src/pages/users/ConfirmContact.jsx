import { useEffect } from "react";
import { Container, Card } from "react-bootstrap";
import "./ConfirmContact.css";

const ConfirmContact = () => {
    useEffect(() => {
        document.title = "AnswerSheet - HSC made easy"
    }, []);

    return (
        <div className="confirm-contact-container d-flex align-items-center justify-content-center">
            <Container className="d-flex align-items-center justify-content-center">
                <Card style={{flexBasis: 500, textAlign: 'center', padding: 20}}>
                    <Card.Body>
                        <img width="160" src={require("../../assets/images/success_register.jpg")} alt="Successful Confirm"/>
                        <h3>Thanks for contacting us</h3>
                        <p style={{fontSize: 20}}>We endeavour to reply within 1 business day.</p>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default ConfirmContact;
