import { useState, useEffect, useRef } from "react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import DataTable from "../../components/DataTable";
import Http from "../../services/Http";
import { toast } from "react-toastify";
import "./Years.css";

const Years = () => {
    const fileRef = useRef(0);
    const [year, setYear] = useState({ image: "", name: "", description: "" });
    const [isGetData, setIsGetData] = useState(false);
    const [newVisible, setNewVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [removeVisible, setRemoveVisible] = useState(false);
    const [data, setData] = useState([]);
    const [file, setFile] = useState([]);
    const [sort, setSort] = useState();
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const columns = [{
        key: "_id",
        name: "No",
        width: 65,
        render: (rowData, idx) => idx + 1
    }, {
        key: "image",
        name: "Image",
        width: 100,
        sortable: false,
        render: (rowData, idx) => rowData.image ? <img src={rowData.image} alt="image" width="30" /> : <></>
    }, {
        key: "name",
        name: "Name"
    }, {
        key: "",
        name: "Action",
        render: (rowData) => {
            return (
                <div>
                    <CButton color="outline-success" size="sm" className="me-1" onClick={() => onEdit(rowData)}>
                        <i className="fa fa-edit"></i>
                    </CButton>
                    <CButton color="outline-danger" size="sm" onClick={() => onRemove(rowData)}>
                        <i className="fa fa-trash"></i>
                    </CButton>
                </div>
            );
        },
        width: 90,
        sortable: false
    }];

    const validationSchema = yup.object({
        name: yup.string()
            .required('Please enter a name.')
            .test('len', 'Must be less than 64 characters.', function (val) {
                if (!val) val = "";
                return val.length < 64;
            })
    });

    useEffect(() => {
        const getYears = async () => {
            let { data } = await Http.get('admin/years', {
                params: {
                    search,
                    length: pagination.pageSize,
                    page: pagination.page,
                    sortKey: sort ? sort.key : "",
                    sortDir: sort ? sort.dir : ""
                }
            });
            setData(data.data);
            setPagination({ ...pagination, totalCount: data.totalCount });
        }
        getYears();
    }, [isGetData]);

    const onNew = () => {
        setYear({
            image: "",
            name: "",
            description: ""
        });
        setNewVisible(true);
    }

    const onSave = async (year) => {
        let formData = new FormData();
        formData.append('image', file);
        formData.append('name', year.name);
        formData.append('description', year.description);
        let { data } = await Http.post("admin/years", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (data.success) {
            toast.success(data.msg);
            setNewVisible(false);
            setIsGetData(!isGetData);
        } else {
            toast.error(data.msg);
        }
    }

    const onEdit = (year) => {
        setYear({
            id: year._id,
            image: year.image ? year.image : "",
            name: year.name,
            description: year.description ? year.description : ""
        });
        setFile(year.image);
        setEditVisible(true);
    }

    const chooseFile = (ev) => {
        let virUrl = URL.createObjectURL(ev.target.files[0]);
        setFile(ev.target.files[0]);
        setYear({ ...year, image: virUrl });
    }

    const onUpdate = async (year) => {
        let { id } = year;
        let formData = new FormData();
        if (file) formData.append("image", file);
        formData.append("name", year.name);
        formData.append("description", year.description);
        let { data } = await Http.put(`admin/years/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (data.success) {
            toast.success(data.msg);
            setEditVisible(false);
            setFile(null);
            setIsGetData(!isGetData);
        } else {
            toast.error(data.msg);
        }
    }

    const onRemove = (year) => {
        setYear(year);
        setRemoveVisible(true);
    }

    const onDelete = async () => {
        let { data } = await Http.delete(`/admin/years/${year._id}`);
        if (data.success) {
            toast.success(data.msg);
            setRemoveVisible(false);
            setIsGetData(!isGetData);
        } else {
            toast.error(data.msg);
        }
    }
    const onChange = ({ search, pagination, sort = {} }) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }

    return (
        <Card>
            <Card.Header style={{ background: '#3c4b64' }} bsPrefix="card-header py-3">
                <Card.Title bsPrefix="card-title mb-0 text-light" as="h5">
                    Years management
                    <Button variant="primary"
                        size="sm"
                        className="float-end"
                        onClick={onNew}
                    >
                        <i className="fa fa-plus"></i> New year
                    </Button>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <DataTable
                    columns={columns}
                    data={data}
                    sort={sort}
                    search={search}
                    pagination={pagination}
                    onChange={onChange}
                />
                <CModal visible={newVisible} onClose={() => setNewVisible(false)} className="create-year-container">
                    <Formik
                        validationSchema={validationSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={onSave}
                        initialValues={year}
                    >
                        {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <CModalHeader>
                                    <CModalTitle>New year</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                    <Row>
                                        <Col lg={7} md={7} sm={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Year name"
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
                                                <Form.Control
                                                    as="textarea"
                                                    rows="5"
                                                    placeholder="Year description"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={5} md={5} sm={12}>
                                            <Form.Group className="mb-3">
                                                <div className="file-preview">
                                                    <div className="file-preview-content" style={{ backgroundImage: `url(${year.image})` }}>
                                                        <Button variant="outline-primary" size="sm" onClick={() => fileRef.current.click()}>Choose image</Button>
                                                    </div>
                                                    <Form.Control
                                                        className="d-none"
                                                        type="file"
                                                        accept=".png,.jpg,.bmp,.svg,.gif,.tiff,.pdf,.eps"
                                                        ref={fileRef} onChange={chooseFile} />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </CModalBody>
                                <CModalFooter>
                                    <CButton type="submit" color="primary"><i className="fa fa-save"></i> Save</CButton>
                                    <CButton color="danger" onClick={() => setNewVisible(false)}><i className="fa fa-times"></i> Cancel</CButton>
                                </CModalFooter>
                            </Form>
                        )}
                    </Formik>
                </CModal>
                <CModal visible={editVisible} onClose={() => setEditVisible(false)} className="create-year-container">
                    <Formik
                        validationSchema={validationSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={onUpdate}
                        initialValues={year}
                    >
                        {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <CModalHeader>
                                    <CModalTitle>Edit year</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                    <Row>
                                        <Col lg={7} md={7} sm={12}>
                                            <Form.Group>
                                                <Form.Control
                                                    type="hidden"
                                                    value={values.id}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Year name"
                                                    name="name"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.name}
                                                    touched={touched}
                                                    isInvalid={!!errors.name}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control
                                                    as="textarea"
                                                    rows="5"
                                                    placeholder="Year description"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col lg={5} md={5} sm={12}>
                                            <Form.Group className="mb-3">
                                                <div className="file-preview">
                                                    <div className="file-preview-content" style={{ backgroundImage: `url(${year.image})` }}>
                                                        <Button variant="outline-primary" size="sm" onClick={() => fileRef.current.click()}>Change image</Button>
                                                    </div>
                                                    <Form.Control
                                                        className="d-none"
                                                        type="file"
                                                        accept=".png,.jpg,.bmp,.svg,.gif,.tiff,.pdf,.eps"
                                                        ref={fileRef} onChange={chooseFile} />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </CModalBody>
                                <CModalFooter>
                                    <CButton type="submit" color="primary"><i className="fa fa-save"></i> Update</CButton>
                                    <CButton color="danger" onClick={() => setEditVisible(false)}><i className="fa fa-times"></i> Cancel</CButton>
                                </CModalFooter>
                            </Form>
                        )}
                    </Formik>
                </CModal>
                <CModal visible={removeVisible} onClose={() => setRemoveVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Are you sure?</CModalTitle>
                    </CModalHeader>
                    <CModalBody>Deleting is permanent and cannot be undone.</CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={onDelete}><i className="fa fa-thumbs-up"></i> Delete</CButton>
                        <CButton color="danger" onClick={() => setRemoveVisible(false)}><i className="fa fa-thumbs-down"></i> Cancel</CButton>
                    </CModalFooter>
                </CModal>
            </Card.Body>
        </Card>
    );
}

export default Years;