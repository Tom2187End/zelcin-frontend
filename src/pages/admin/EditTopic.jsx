import { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditSubject = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topic, setTopic] = useState({ year: "", subject: "", name: "", description: "" });
    const validationSchema = yup.object({
        subject: yup.string('Choose a subject.')
            .required('Subject is required.'),
        name: yup.string('Enter a topic name.')
            .test('len', 'Must be less than 64 characters.', function(val) {
                if (!val) val = "";
                return val.length < 64;
            })
            .required('Please enter a name.')
    })
    useEffect(() => {
        const getTerms = async () => {
            let { data } = await Http.get("admin/years/get-all-populate");
            setYears(data);
            setSubjects(data.length ? data[0].subjects : []);
        }
        getTerms();
    }, []);

    useEffect(() => {
        const getTopic = async () => {
            let { id } = params;
            let { data } = await Http.get(`admin/topics/${id}`);
            if (data.success) {
                setTopic({
                    ...topic, 
                    year: data.data.subject.year._id, 
                    subject: data.data.subject._id,
                    name: data.data.name,
                    description: data.data.description
                });
            } else {
                toast.error(data.msg);
            }
        }
        getTopic();
    }, []);
    const onChangeYear = (ev) => {
        let idx = years.findIndex(year => year._id === ev.target.value);
        setSubjects(years[idx].subjects);
        setTopic({
            ...topic,
            year: years[idx]._id,
            subject: years[idx].subjects.length ? years[idx].subjects[0]._id : ""
        });
    }

    const onChangeSubject = (ev) => {
        setTopic({
            ...topic,
            subject: ev.target.value
        });
    } 

    const onUpdate = async (topic, { resetForm }) => {
        let { id } = params;
        let { data } = await Http.put(`admin/topics/${id}`, topic);
        if (data.success) {
            toast.success(data.msg);
            resetForm();
            navigate("/admin/topics");
        } else {
            toast.error(data.msg);
        }
    }

    return (
        <Card>
            <Card.Header style={{background: '#3c4b64'}} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h5">
                    Edit topic
                </Card.Title>
            </Card.Header>       
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onUpdate}
                    initialValues={topic}
                    enableReinitialize
                >
                    {({handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Year:</Form.Label>
                            <Form.Select 
                                name="year" 
                                value={topic.year}
                                onChange={onChangeYear} 
                                onBlur={handleBlur}
                                touched={touched}
                                isInvalid={!!errors.year}
                            >
                                {years.map((year, idx) => <option key={idx} value={year._id}>{year.name}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject:</Form.Label>
                            <Form.Select
                                name="subject"
                                value={topic.subject}
                                onChange={onChangeSubject}
                                onBlur={handleBlur}
                                touched={touched}
                                isInvalid={!!errors.subject}
                            >
                                {subjects.map((subject, idx) => <option key={idx} value={subject._id}>{subject.name}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Topic:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Please enter a topic name."
                                name="name"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                touched={touched}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Please enter a topic description."
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                rows={10}
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