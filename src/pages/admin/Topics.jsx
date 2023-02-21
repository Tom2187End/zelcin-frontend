import { useState, useEffect } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import Http from "../../services/Http";
import "./Topics.css";

const Topics = () => {
    const [isGetData, setIsGetData] = useState(0);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState();
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const [topic, setTopic] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const columns = [{
        key: "_id",
        name: "No",
        width: 65,
        render: (rowData, idx) => idx + 1
    }, {
        key: "name",
        name: "Name",
        width: 180
    }, {
        key: "year",
        name: "Year",
        render: (rowData, idx) => rowData.subject.year.name,
        width: 100
    }, {
        key: "subject",
        name: "Subject",
        render: (rowData, idx) => rowData.subject.name,
        width: 200
    }, {
        key: "description",
        name: "Description",
        render: (rowData, idx) => <div className="topic-description" dangerouslySetInnerHTML={{__html: rowData.description }}></div>,
        sortable: false
    }, {
        key: "action",
        name: "Action",
        width: 90,
        render: (rowData, idx) => (
            <div>
                <Link className="btn btn-sm btn-outline-success me-1" to={`/admin/topics/edit/${rowData._id}`}>
                    <i className="fa fa-edit"></i>
                </Link>
                <Button variant="btn btn-sm btn-outline-danger" size="sm" onClick={() => removeTopic(rowData)}><i className="fa fa-trash"></i></Button>
            </div>
        ),
        sortable: false
    }];

    useEffect(() => {
        const getTopics = async () => {
            let { data } = await Http.get("admin/topics", {
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
        getTopics();
    }, [isGetData]);
    
    const onChange = ({search, pagination, sort}) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }
    const removeTopic = (topic) => {
        setTopic(topic);
        setShowDeleteModal(true);
    }
    const deleteTopic = async () => {
        let { data } = await Http.delete(`admin/topics/${topic._id}`);
        if (data.success) {
            setIsGetData(!isGetData);
            setShowDeleteModal(false);
            toast.success(data.msg);
        } else {
            toast.error(data.msg);
        }
    }
    return (
        <Card>
            <Card.Header style={{background: '#3c4b64'}} bsPrefix="card-header py-3">
                <Card.Title as="h5" bsPrefix="card-title text-light mb-0">
                    Topics management
                    <Link to="/admin/topics/create" className="btn btn-primary btn-sm float-end">
                        <i className="fa fa-plus"></i> New topic
                    </Link>
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
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deleting is permanent and cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={deleteTopic}><i className="fa fa-thumbs-up"></i> Yes</Button>
                    <Button variant="danger" onClick={() => setShowDeleteModal(false)}><i className="fa fa-thumbs-down"></i> No</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )
}

export default Topics;