import { useState, useEffect } from "react";
import Http from "../../services/Http";
import { Card, Modal, Badge, Button } from "react-bootstrap";
import DataTable from "../../components/DataTable";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const [isGetData, setIsGetData] = useState(0);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState();
    const [pagination, setPagination] = useState({page: 1, totalCount: 0, pageSize: 10});
    const [userId, setUserId] = useState(0);
    const [status, setStatus] = useState(1);
    const [visibleConfirmStatus, setVisibleConfirmStatus] = useState(0);
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
        key: "status",
        name: "Status",
        render: (rowData) => {
            return rowData.status ? 
                <Badge pill bg="success">Enabled</Badge> : 
                <Badge pill bg="danger">Disabled</Badge>
        }
    }, {
        key: "action",
        name: "Action",
        width: 90,
        render: (rowData) => {
            return (
                <div>
                    <Button variant="outline-success"
                        data-tip="Detail"
                        key="1" size="sm"
                        className="me-1"
                        onClick={() => navigate(`/admin/users/${rowData._id}`)}
                    >
                        <i className="fa fa-eye"></i>
                    </Button>
                    <Button variant="outline-danger"
                        data-tip="Delete"
                        key="2" size="sm"
                        onClick={() => removeUser(rowData._id)}><i className="fa fa-trash"></i></Button>
                    <ReactTooltip/>
                </div>
            )
        },
        sortable: false
    }];

    useEffect(() => {
        const getUsers = async () => {
            let { data } = await Http.get("admin/users", {
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

    const changeStatus = (id, status) => {
        setUserId(id);
        setStatus(status);
        setVisibleConfirmStatus(1);
    }

    const updateStatus = async () => {
        let { data } = await Http.put(`admin/users/${userId}`, {
            status
        });
        if (data.success) {
            toast.success(data.msg);
            setIsGetData(!isGetData);
            setVisibleConfirmStatus(0);
        } else {
            toast.error(data.msg);
        }
    }

    const removeUser = (id) => {
        setUserId(id);
        setVisibleDeleteUser(1);
    }

    const deleteUser = async (id) => {
        let { data } = await Http.delete(`admin/users/${userId}`);
        if (data.status) {
            toast.success(data.msg);
            setIsGetData(!isGetData);
            setVisibleDeleteUser(0)
        }
    }

    return (
        <Card>
            <Card.Header style={{background: '#3c4b64'}} bsPrefix="card-header py-3">
                <Card.Title as="h5" bsPrefix="mb-0 card-title text-light">Users management</Card.Title>
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
            <Modal show={visibleConfirmStatus} onHide={() => setVisibleConfirmStatus(0)}>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you really going to change the user's status?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => updateStatus()}>Yes</Button>
                    <Button variant="danger" onClick={() => setVisibleConfirmStatus(0)}>No</Button>
                </Modal.Footer>
            </Modal>
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

export default Users;