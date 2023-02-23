import { useState, useEffect, useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

const EditSubTopic = () => {
    const params = useParams();
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [years, setYears] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subTopic, setSubTopic] = useState({ year: "", subject: "", topic: "", name: "", content: "", permission: 0 });
    const validationSchema = yup.object({
        year: yup.string('Choose a year.')
            .required('Year is required.'),
        subject: yup.string('Choose a subject.')
            .required('Subject is required'),
        topic: yup.string('Choose a topic.')
            .required('Topic is required.'),
        name: yup.string('Enter a sub topic name.')
            .test('len', 'Must be less than or equal to 64 characters.', function(val) {
                if (!val) val = "";
                return val.length <= 64;
            })
            .required('Please enter a name.')
    });

    useEffect(() => {
        const getYears = async () => {
            let { data } = await Http.get("/admin/years/get-all-populate");
            setYears(data);
            setSubjects(data.length ? data[0].subjects : []);
            setTopics(data.length && data[0].subjects.length ? data[0].subjects[0].topics : []);
            setSubTopic({
                ...subTopic,
                year: data.length ? data[0]._id : "",
                subject: (data.length && data[0].subjects.length) ? data[0].subjects[0]._id : "",
                topic: (data.length && data[0].subjects.length && data[0].subjects[0].topics.length) ? data[0].subjects[0].topics[0]._id : "" 
            });
        }
        getYears();
    }, []);

    useEffect(() => {
        const getSubTopic = async () => {
            let { id } = params;
            let { data } = await Http.get(`/admin/sub-topics/${id}`);
            if (data.success) { 
                setSubTopic({
                    ...subTopic,
                    year: data.data.topic.subject.year._id,
                    subject: data.data.topic.subject._id,
                    topic: data.data.topic._id,
                    name: data.data.name,
                    content: data.data.content,
                    permission: data.data.permission
                })
            } else {
                toast.error(data.msg);
            }
        }
        getSubTopic();
    }, []);
    
    const onChangeYear = (ev) => {
        let idx = years.findIndex(year => year._id === ev.target.value);
        setSubjects(years[idx].subjects);
        setTopics(years[idx].subjects.length ? years[idx].subjects[0].topics : []);
        setSubTopic({
            ...subTopic,
            year: ev.target.value,
            subject: years[idx].subjects.length ? years[idx].subjects[0]._id : "",
            topic: years[idx].subjects.length && years[idx].subjects[0].topics.length ? years[idx].subjects[0].topics[0]._id : ""
        });
    }

    const onChangeSubject = (ev) => {
        let idx = subjects.findIndex(subject => subject._id === ev.target.value);
        setTopics(subjects[idx].topics);
        setSubTopic({
            ...subTopic,
            subject: ev.target.value,
            topic: subjects[idx].topics.length ? subjects[idx].topics[0]._id : ""
        });
    }

    const onChangeTopic = (ev) => {
        setSubTopic({
            ...subTopic,
            topic: ev.target.value
        });
    }

    const onChangePermission = (ev) => {
        setSubTopic({
            ...subTopic,
            permission: Number(ev.target.value)
        });
    }
    const onUpdate = async (subTopic, { resetForm }) => {
        let { id } = params;
        subTopic.content = editorRef.current.getContent();
        let { data } = await Http.put(`admin/sub-topics/${id}`, subTopic);
        if (data.success) {
            toast.success(data.msg);
            resetForm();
            navigate("/admin/sub-topics");
        } else {
            toast.error(data.msg);
        }
    }
    return (
        <Card>
            <Card.Header style={{background: "#3c4b64"}} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h5">
                    Edit subtopic
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={onUpdate}
                    initialValues={subTopic}
                    enableReinitialize
                >{({handleSubmit, handleChange, handleBlur, values, touched, errors}) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Year:</Form.Label>
                            <Form.Select 
                                name="year"
                                value={subTopic.year}
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
                                value={subTopic.subject}
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
                            <Form.Select 
                                name="topic"
                                value={subTopic.topic}
                                onChange={onChangeTopic}
                                onBlur={handleBlur}
                                touched={touched}
                                isInvalid={!!errors.topic}
                            >
                                {topics.map((topic, idx) => <option key={idx} value={topic._id}>{topic.name}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.topic}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Please enter a sub topic name."
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
                            <Form.Check
                                inline
                                type="radio"
                                name="permission"
                                label="Open"
                                id="permission-1"
                                value="0"
                                checked={values.permission === 0}
                                onChange={onChangePermission}
                                onBlur={handleBlur}
                            />
                            <Form.Check 
                                inline
                                type="radio"
                                name="permission"
                                label="Free"
                                id="permission-2"
                                value="1"
                                checked={values.permission === 1}
                                onChange={onChangePermission}
                                onBlur={handleBlur}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                name="permission"
                                label="Premium"
                                id="permission-3"
                                value="2"
                                checked={values.permission === 2}
                                onChange={onChangePermission}
                                onBlur={handleBlur}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description:</Form.Label>
                            <Editor
                                tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                                onInit={(ev, editor) => editorRef.current = editor}
                                init={{
                                    height: 450,
                                    menubar: true,
                                    plugins: ['image', 'grid', 'tiny_mce_wiris', 'code', 'table', 'link', 'media', 'codesample'],
                                    toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | grid_insert | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | help',
                                    draggable_modal: true,
                                    init_instance_callback: function(editor) {
                                        editor.contentWindow.addEventListener("copy", function(ev) {
                                            ev.preventDefault()
                                        });
                                        editor.contentWindow.addEventListener("paste", function(ev) {
                                            ev.preventDefault();
                                        });
                                        editor.contentWindow.addEventListener("keydown", function(ev) {
                                            if((ev.ctrlKey || ev.metaKey) && (ev.key === "p" || ev.charCode === 16 || ev.charCode === 112 || ev.keyCode === 80) ){
                                                ev.cancelBubble = true;
                                                ev.preventDefault();
                                                ev.stopImmediatePropagation();
                                            }  
                                        })
                                        
                                    },
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                                name="content"
                                initialValue={values.content}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="float-end"><i className="fa fa-save"></i> Save</Button>
                    </Form>
                )}</Formik>
            </Card.Body>
        </Card>
    )
}   

export default EditSubTopic;