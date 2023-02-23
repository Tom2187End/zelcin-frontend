import { useState, useEffect } from "react";
import Http from "../../services/Http";
import { useNavigate } from "react-router-dom";
import { Card, Modal, Button, Form, InputGroup } from "react-bootstrap";
import DataTable from "../../components/DataTable";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";

const Staffs = () => {
    const [isGetData, setIsGetData] = useState(0);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState();
    const [pagination, setPagination] = useState({page: 1, totalCount: 0, pageSize: 10});
    const [staffId, setStaffId] = useState(0);
    const [staffStatus, setStaffStatus] = useState(1);
    const [staff, setStaff] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        isSendInstructions: true
    });
    const [visibleNewModal, setVisibleNewModal] = useState(false);
    // const [visibleConfirmStatus, setVisibleConfirmStatus] = useState(0);
    const [visibleDeleteUser, setVisibleDeleteUser] = useState(0);
    
    const columns = [{
        key: "_id",
        name: "No",
        width: 65,
        render: (rowData, idx) => idx + 1
    }, {
        key: "firstName",
        name: "First name"
    }, {
        key: "lastName",
        name: "Last name",
    }, {
        key: "email",
        name: "Email"
    }, {
        key: "action",
        name: "Action",
        width: 120,
        render: (rowData) => {
            return (
                <div>
                    <Button variant="outline-success"
                        data-tip="Edit"
                        key="1" size="sm"
                        className="me-1"
                        onClick={() => navigate(`/admin/staffs/${rowData._id}`)}
                    >
                        <i className="fa fa-edit"></i>
                    </Button>
                    <Button variant="outline-primary"
                        data-tip={ rowData.status ? 'Disable' : 'Allow' }
                        key="2" size="sm"
                        className="me-1"
                        onClick={() => {loginMng(rowData._id)}}
                    >
                        {
                            rowData.status ? <i className="fa fa-thumbs-up"></i> : <i className="fa fa-thumbs-down"></i>
                        }
                    </Button>
                    <Button variant="outline-danger"
                        data-tip="Delete"
                        key="3" size="sm"
                        onClick={() => removeUser(rowData._id)}><i className="fa fa-trash"></i></Button>
                    <ReactTooltip/>
                </div>
            )
        },
        sortable: false
    }];

    useEffect(() => {
        const getUsers = async () => {
            let { data } = await Http.get("admin/staffs", {
                params: {
                    search,
                    length: pagination.pageSize,
                    page: pagination.page,
                    sortKey: sort ? sort.key : "",
                    sortDir: sort ? sort.dir : ""
                }
            });
            setData(data.data);
            setPagination({ ...pagination, totalCount: data.totalCount});
        }
        getUsers();
    }, [isGetData]);

    const onChange = ({search, pagination, sort}) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }

    const changeInput = (val, key) => {
        setStaff({...staff, [key]: val});
    }

    const generatePassword = () => {
        var length = 12,
            charset = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()0123456789",
            password = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        setStaff({...staff, password: password});
    }

    const createStaff = async () => {
        if (staff.firstName === "") {
            toast.error("Please enter a staff's first name.", "Warning!");
        } else if (staff.lastName === "") {
            toast.error("Please enter a staff's last name.", "Warning!");
        } else if (staff.email === "") {
            toast.error("Please enter a staff's email.", "Warning!");
        } else {
            staff.role = 1;
            staff.isPaid = true;
            staff.status = true;
            let { data } = await Http.post("admin/staffs", staff);
            if (data.status) {
                toast.success(data.msg, "Success!");
                setIsGetData(!isGetData);
                setVisibleNewModal(false);
            } else {
                toast.error(data.msg, "Warning!");
            }
        }
    }

    const loginMng = async (id) => {
        let result = await Http.put(`admin/staffs/login-mng/${id}`);
        if (result.data.status) {
            toast.success(result.data.msg);
            const newData = data.map((c, i) => {
                if (c._id == id) {
                    c.status = c.status ? false : true;
                    return c;
                } else {
                    return c;
                }
            });
            setData(newData);
        } else {
            toast.error(result.data.msg, "Warning!");
        }
    }

    const removeUser = (id) => {
        setStaffId(id);
        setVisibleDeleteUser(1);
    }

    const deleteUser = async (id) => {
        let { data } = await Http.delete(`admin/staffs/${staffId}`);
        if (data.status) {
            toast.success(data.msg);
            setIsGetData(!isGetData);
            setVisibleDeleteUser(0)
        } else {
            toast.error(data.msg);
        }
    }

    return (
        <Card>
            <Card.Header style={{background: '#3c4b64'}} bsPrefix="card-header py-3">
                <Card.Title as="h5" bsPrefix="mb-0 card-title text-light">
                    Staff management
                    <Button variant="primary" size="sm" className="float-end" onClick={() => setVisibleNewModal(true)}><i className="fa fa-plus"></i> New staff</Button>
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
            </Card.Body>
            <Modal size="md" show={visibleNewModal} onHide={() => setVisibleNewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>New staff</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Text style={{width: 40}}><i className="fa fa-user"></i></InputGroup.Text>
                            <Form.Control type="text" value={staff.firstName} placeholder="First name" onChange={(ev) => changeInput(ev.target.value, "firstName")}/>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text style={{width: 40}}><i className="fa fa-user"></i></InputGroup.Text>
                            <Form.Control type="text" value={staff.lastName} placeholder="Last name" onChange={(ev) => changeInput(ev.target.value, "lastName")}/>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text style={{width: 40}}><i className="fa fa-envelope"></i></InputGroup.Text>
                            <Form.Control type="email" value={staff.email} placeholder="Email" onChange={(ev) => changeInput(ev.target.value, "email")}/>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" value={staff.password} placeholder="Password" onChange={(ev) => changeInput(ev.target.value, "password")}/>
                            <Button type="button" variant="outline-primary" onClick={generatePassword}>Generate</Button>
                        </InputGroup>
                        <Form.Group>
                            <Form.Check type="checkbox" checked={staff.isSendInstructions} onChange={(ev) => changeInput(ev.target.checked, "isSendInstructions")} label="Send sign-in instructions"/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => createStaff()}><i className="fa fa-save"></i> Create</Button>
                    <Button variant="danger" onClick={() => setVisibleNewModal(0)}><i className="fa fa-times"></i> Cancel</Button>
                </Modal.Footer>
            </Modal>
            {/* <Modal show={visibleConfirmStatus} onHide={() => setVisibleConfirmStatus(0)}>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>You are going to { staffStatus ? 'ban' : 'allow' } the staff.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => loginMng()}>Yes</Button>
                    <Button variant="danger" onClick={() => setVisibleConfirmStatus(0)}>No</Button>
                </Modal.Footer>
            </Modal> */}
            <Modal show={visibleDeleteUser} onHide={() => setVisibleDeleteUser(0)}>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deleting is permanent and cannot be undone.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => deleteUser()}>Yes</Button>
                    <Button variant="danger" onClick={() => setVisibleDeleteUser(0)}>No</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );

}

export default Staffs;