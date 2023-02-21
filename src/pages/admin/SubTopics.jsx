import { useState, useEffect } from "react";
import { Modal, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../../components/DataTable";
import Http from "../../services/Http";

const SubTopics = () => {
    const [isGetData, setIsGetData] = useState(0);
    const [data, setData] = useState([]);
    const [sort, setSort] = useState();
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, totalCount: 0, pageSize: 10 });
    const columns = [{
        key: "_id",
        name: "No",
        width: 65,
        render: (rowData, idx) => idx + 1
    }, {
        key: "name",
        name: "Name",
    }, {
        key: "year",
        name: "Year",
        render: (rowData, idx) => rowData.topic.subject.year.name
    }, {
        key: "subject",
        name: "Subject",
        render: (rowData, idx) => rowData.topic.subject.name
    }, {
        key: "topic",
        name: "Topic",
        render: (rowData, idx) => rowData.topic.name,
    }, {
        key: "action",
        name: "Action",
        render: (rowData, idx) => (
            <div>
                <Link className="btn btn-sm btn-outline-success me-1" to={`/admin/sub-topics/edit/${rowData._id}`}>
                    <i className="fa fa-edit"></i>
                </Link>
                <Button variant="btn btn-sm btn-outline-danger" size="sm" onClick={() => removeSubTopic(rowData)}><i className="fa fa-trash"></i></Button>
            </div>
        ),
        sortable: false,
        width: 90
    }];
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [subTopic, setSubTopic] = useState({});

    useEffect(() => {
        const getSubTopics = async () => {
            let { data } = await Http.get("admin/sub-topics", {
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
        getSubTopics();
    }, [isGetData]);

    const onChange = ({search, pagination, sort}) => {
        setSort(sort);
        setSearch(search);
        setPagination(pagination);
        setIsGetData(!isGetData);
    }

    const removeSubTopic = (subTopic) => {
        setSubTopic(subTopic);
        setShowDeleteModal(true);
    }

    const deleteSubTopic = async () => {
        let { data } = await Http.delete(`admin/sub-topics/${subTopic._id}`);
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
                    Subtopics management
                    <Link className="btn btn-primary btn-sm float-end" to={'/admin/sub-topics/create'}><i className="fa fa-plus"></i> New subtopic</Link>
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <DataTable
                    columns={columns}
                    data={data}
                    sort={sort}
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
                    <Button variant="primary" onClick={deleteSubTopic}><i className="fa fa-thumbs-up"></i> Yes</Button>
                    <Button variant="danger" onClick={() => setShowDeleteModal(false)}><i className="fa fa-thumbs-down"></i> No</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )
}

export default SubTopics;