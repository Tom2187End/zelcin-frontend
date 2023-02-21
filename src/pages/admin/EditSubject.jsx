import { useState, useEffect, useRef } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./EditSubject.css";

const EditSubject = () => {
    const params = useParams();
    const navigate = useNavigate();
    const fileRef = useRef(0);
    const [years, setYears] = useState([]);
    const [subject, setSubject] = useState({name: "", year: "", description: ""});
    const [file, setFile] = useState();

    const validationSchema = yup.object({
        name: yup.string('Enter a subject name.')
            .test('len', 'Must be less than 64 characters.', function(val) {
                return val.length < 64;
            })
            .required('Subject name is required.')
    })
    useEffect(() => {
        const getYears = async () => {
            let { data } = await Http.get("admin/years/get-all");
            setYears(data);
        }
        getYears();
    }, []);

    useEffect(() => {
        const getSubject = async () => {
            let { id } = params;
            let { data } = await Http.get(`admin/subjects/${id}`);
            if (data.success) {
                setSubject(data.data);
            } else {
                toast.error(data.msg);
            }
        }
        getSubject();
    }, []);
    const chooseFile = (ev) => {
        let virUrl = URL.createObjectURL(ev.target.files[0]);
        setFile(ev.target.files[0]);
        setSubject({...subject, icon: virUrl});
    }
    const onUpdate = async (subject, { resetForm }) => {
        let { id } = params;
        let formData = new FormData();
        if (file) formData.append("icon", file);
        formData.append("year", subject.year);
        formData.append("name", subject.name);
        formData.append("description", subject.description);
        let { data } = await Http.put(`admin/subjects/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (data.success) {
            toast.success(data.msg);
            resetForm();
            setFile(null);
            navigate("/admin/subjects");
        } else {
            toast.error(data.msg);
        }
    }
    return (
        <Card className="edit-subject-container">
            <Card.Header style={{background: '#3c4b64'}} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h5">
                    Edit subject
                </Card.Title>
            </Card.Header>       
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onUpdate}
                    initialValues={{ name: subject.name, year: subject.year, description: subject.description }}
                    enableReinitialize
                >
                    {({handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={2} md={3}>
                                <div className="file-preview">
                                    <div className="file-preview-content" style={{backgroundImage: `url(${subject.icon})`}}>
                                        <Button variant="outline-primary" size="sm" onClick={() => fileRef.current.click()}>Choose Icon</Button>
                                    </div>
                                    <Form.Control 
                                        className="d-none"
                                        type="file"
                                        accept=".png,.jpg,.bmp,.svg,.git,.tiff,.pdf,.eps"
                                        ref={fileRef} onChange={chooseFile}
                                    />
                                </div>
                            </Col>
                            <Col lg={10} md={9}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Year:</Form.Label>
                                    <Form.Select 
                                        name="year" 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        value={values.year}
                                        touched={touched}
                                        isInvalid={!!errors.year}
                                    >
                                        {years.map((year, idx) => <option key={idx} value={year._id}>{year.name}</option>)}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subject:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Please enter a subject name."
                                        name="name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                        touched={touched}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                placeholder="Please enter a subject description"
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                rows="10"
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="float-end"><i className="fa fa-save"></i> Update</Button>
                    </Form>                        
                    )}
                </Formik>
            </Card.Body>
        </Card>
    )
}

export default EditSubject;