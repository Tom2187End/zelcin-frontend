import { useState, useEffect } from "react";
import Http from "../../services/Http";
import { Card, Button, Badge, Modal, Form } from "react-bootstrap";
import DataTable from "../../components/DataTable";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import moment from "moment";
import "./Messages.css"

const Messages = () => {
    const [isGetData, setIsGetData] = useState(0);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState();
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const [message, setMessage] = useState({ name: "", email: "", message: "" });
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const columns = [{
        key: "_id",
        name: "No",
        width: 65,
        render: (rowData, idx) => idx + 1
    }, {
        key: "name",
        name: "Name",
        width: 120
    }, {
        key: "email",
        name: "Email",
    }, {
        key: "message",
        name: "Message",
        render: (rowData) => {
            return <div className="message-description">{rowData.message}</div>
        },
        sortable: false
    }, {
        key: "createdAt",
        name: "Created date",
        render: (rowData) => {
            return <><i className="fa fa-clock-o"></i> {moment(rowData.createdAt).format("YYYY.MM.DD HH:mm:ss")}</> 
        },
        width: 185
    }, {
        key: "status",
        name: "Status",
        render: (rowData) => {
            return rowData.isRead ? 
                <Badge pill bg="success">Read</Badge> : 
                <Badge pill bg="danger">Not read</Badge>
        },
        width: 100,
        sortable: false
    }, {
        key: "action",
        name: "Action",
        width: 90,
        render: (rowData) => {
            return (
                <div>
                    <Button variant="outline-success"
                        className="me-1"
                        data-tip="View"
                        key="1" size="sm"
                        onClick={() => showMessage(rowData)}><i className="fa fa-eye"></i></Button>
                    <Button variant="outline-danger"
                        data-tip="Delete"
                        key="2" size="sm"
                        onClick={() => removeMessage(rowData)}><i className="fa fa-trash"></i></Button>
                    <ReactTooltip/>
                </div>
            )
        },
        sortable: false
    }];

    useEffect(() => {
        const getMessages = async () => {
            let { data } = await Http.get("admin/messages", {
                params: {
                    search: search,
                    length: pagination.pageSize,
                    page: pagination.page,
                    sortKey: sort ? sort.key : "",
                    sortDir: sort ? sort.dir : ""
                }
            });
            setData(data.data);
            setPagination({...pagination, totalCount: data.totalCount});
        }
        getMessages();
    }, [isGetData]);

    const onChange = ({search, pagination, sort}) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }
    const showMessage = async (message) => {
        if (!message.isRead) {
            let { data } = await Http.put(`admin/messages/${message._id}`, {
                isRead: true
            });
            if (data.success) {
                setMessage(message);
                setIsGetData(!isGetData);
                setShowViewModal(true);
            } else {
                toast.error(data.msg);
            }
        } else {
            setMessage(message);
            setShowViewModal(true);
        }
    }
    const removeMessage = async (message) => {
        setMessage(message);
        setShowDeleteModal(true);
    }
    const deleteMessage = async () => {
        let { data } = await Http.delete(`admin/messages/${message._id}`);
        if (data.success) {
            toast.success(data.msg);
            setIsGetData(!isGetData);
            setShowDeleteModal(false);
        } else {
            toast.error(data.msg);
        }
    }
    return (
        <Card>
            <Card.Header style={{background: '#3c4b64'}} bsPrefix="card-header py-3">
                <Card.Title  as="h5" bsPrefix="mb-0 card-title text-light">
                    Message management
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
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Message <small>({moment(message.createdAt).format("LLL")})</small></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control defaultValue={message.name} readOnly/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control defaultValue={message.email} readOnly/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            defaultValue={message.message}
                            rows={10}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deleting is permanent and cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={deleteMessage}><i className="fa fa-thumbs-up"></i> Yes</Button>
                    <Button variant="danger" onClick={() => setShowDeleteModal(false)}><i className="fa fa-thumbs-down"></i> No</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default Messages;