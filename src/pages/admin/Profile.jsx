import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createUser } from "../../store/reducers/userReducer";
import { Card, Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import Http from "../../services/Http";
import { toast } from "react-toastify";

const Profile = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const [ user, setUser ] = useState({});
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    useEffect(() => {
        const getUser = async () => {
            let { data } = await Http.get(`admin/users/me`);
            setUser(data);
        }
        getUser();
    }, []);

    const changeInput = (ev, key) => {
        setUser({
            ...user,
            [key]: ev.target.value
        });
    } 

    const updateProfile = async (ev) => {
        ev.preventDefault();
        let { data } = await Http.put("/admin/users/me", user);
        if (data.status) {
            toast.success(data.msg);
            dispatch(createUser({
                user: data.user,
                token: token
            }));
        } else {
            toast.error(data.msg);
        }
    }

    const changePassword = async (ev) => {
        ev.preventDefault();
        if (currentPassword === "") {
            toast.error("Please enter your current password.");
        } else if (newPassword === "") {
            toast.error("Please enter your new password.");
        } else if (newPassword.length < 8) {
            toast.error("The password length should be at least 8 characters.")
        } else if (confirmPassword === "") {
            toast.error("Please enter your confirm password.");
        } else if (newPassword !== confirmPassword) {
            toast.error("Passwords does not match.");
        } else {
            let { data } = await Http.patch("/admin/users/me", {
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            if (data.status) {
                toast.success(data.msg);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.msg);
            }
        }
    }
    return (
        <Card className="create-subject-container">
            <Card.Header style={{background: '#3c4b64'}} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h5">
                    Profile
                </Card.Title>
            </Card.Header>       
            <Card.Body className="p-4">
                <Row>
                    <Col md={6} sm={12}>
                        <h4 className="mb-3">Update profile</h4>
                        {
                            Object.keys(user).length &&
                            <Form onSubmit={updateProfile}>
                            <Form.Label>First name:</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: 40}}><i className="fa fa-user"></i></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={user.firstName}
                                    onChange={(ev) => changeInput(ev, "firstName") }
                                />
                            </InputGroup>
                            <Form.Label>Last name:</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: 40}}><i className="fa fa-user"></i></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={user.lastName}
                                    onChange={(ev) => changeInput(ev, "lastName")}
                                />
                            </InputGroup>
                            <Form.Label>Email:</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: 40}}><i className="fa fa-envelope"></i></InputGroup.Text>
                                <Form.Control 
                                    type="email"
                                    name="email" 
                                    defaultValue={user.email}
                                    onChange={(ev) => changeInput(ev, "email")}
                                />
                            </InputGroup>
                            <div className="form-actions float-end">
                                <Button variant="primary" type="submit"><i className="fa fa-save"></i> Update profile</Button>
                            </div>
                        </Form>
                        }
                    </Col>
                    <Col md={6} sm={12}>
                        <h4 className="mb-3">Change password</h4>
                        <Form onSubmit={changePassword}>
                            <Form.Label>Current password: </Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: 40}}><i className="fa fa-key"></i></InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Please enter your current password."
                                    value={currentPassword}
                                    onChange={(ev) => setCurrentPassword(ev.target.value)}
                                />
                            </InputGroup>
                            <Form.Label>New password:</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: 40}}><i className="fa fa-lock"></i></InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    name="newPassword"
                                    placeholder="Please enter your new password."
                                    value={newPassword}
                                    onChange={(ev) => setNewPassword(ev.target.value)}
                                />
                            </InputGroup>
                            <Form.Label>Confirm password:</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: 40}}><i className="fa fa-lock"></i></InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Please enter your new password."
                                    value={confirmPassword}
                                    onChange={(ev) => setConfirmPassword(ev.target.value)}
                                />
                            </InputGroup>
                            <div className="form-actions float-end">
                                <Button variant="primary" type="submit"><i className="fa fa-save"></i> Change password</Button>
                            </div>
                        </Form>    
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Profile;