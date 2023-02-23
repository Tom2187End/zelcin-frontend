import { Form, Table, Button } from "react-bootstrap";
import Pagination from "./Pagination";
import "./DataTable.css";

const DataTable = ({
    pageItems = [5, 10, 20, 50, 100],
    columns,
    data = [],
    options = {
        responsive: true,
        bordered: true,
        center: true
    },
    pagination = {
        page: 1,
        totalCount: 10,
        pageSize: 10
    },
    sort,
    search,
    onChange,
    emptyText = "Empty data",
    onRow = () => {}
}) => {
    const onSearch = (e) => {
        if (e.keyCode === 13) onChange({search: e.target.value, pagination: {...pagination, page: 1}});
    }
    const requestSort = (key, order) => {
        var dir = "asc";
        if (order === undefined) {
            dir = "asc"; 
        } else if (order.dir === "asc") {
            dir = "desc";
        } else if (order.dir === "desc") {
            dir = "asc";
        }
        onChange({search, pagination, sort: {key, dir}});
    }
    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <Form.Select size="sm" style={{maxWidth: 100}} defaultValue={pagination.pageSize} onChange={(e) => onChange({search, pagination: {...pagination, pageSize: Number(e.target.value), page: 1}})}>
                    {pageItems.map((item, idx) => <option value={item} key={idx}>{item}</option>)}
                </Form.Select>
                <Form.Control size="sm" 
                    type="text" 
                    placeholder="Search..." 
                    style={{maxWidth: 200}} 
                    onKeyUp={(e) => onSearch(e)}
                />
            </div>
            <Table className={'datatable ' + (options.center ? 'text-center' : '')} responsive={options.responsive} bordered={options.bordered} hover>
                <thead>
                    <tr>
                        {columns.map((column, idx) => <th key={idx} style={{width: column.width ? column.width : 'auto'}}>
                            {column.name} 
                            {
                                (column.sortable !== false) && 
                                <Button className="sort-btn" size="sm" variant="link" onClick={() => requestSort(column.key, sort)}>
                                    {(typeof sort === "undefined" || sort.key !== column.key) && <i className="fa fa-arrows-v"></i>}
                                    { typeof sort !== "undefined" && sort.key === column.key && sort.dir === "asc" && <i className="fa fa-long-arrow-up"></i>}
                                    {typeof sort !== "undefined" && sort.key === column.key && sort.dir === "desc" && <i className="fa fa-long-arrow-down"></i>}
                                </Button>
                            }
                        </th>)}
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length ? data.map((rowData, idx) => {
                            return (
                                <tr key={idx} onClick={() => onRow(rowData._id)}>
                                    {columns.map((column, idx1) => {
                                        if (column.render) {
                                            return <td key={idx1}>{(column.render(rowData, idx))}</td>
                                        } else {
                                            return (
                                                <td key={idx1}>{rowData[column.key]}</td>
                                            )
                                        }
                                    })}
                                </tr>
                            )
                        }): <tr><td colSpan={columns.length} className="text-center text-danger">{emptyText}</td></tr>
                    }
                </tbody>
            </Table>
            <div className="d-flex align-items-center justify-content-end">
                <Pagination 
                    search={search}
                    pagination={pagination}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default DataTable;