import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import Pdf from "react-to-pdf";
import { CSVLink } from "react-csv";
import Http from "../../services/Http";
import "./Invoice.css";

const Invoice = () => {
    const ref = useRef(0);
    const { id } = useParams();
    const [ invoice, setInvoice ] = useState();
    const [pdfDemension, setPdfDemension ] = useState([]);
    useEffect(() => {
        document.title = 'AnswerSheet - Invoice';
        const getInvoice = async () => {
            let { data } = await Http.get(`invoices/${id}`);
            if (data.success) {
                setInvoice(data.invoice);
            } else {
                toast.error(data.msg);
            }
        }
        getInvoice();
    }, []);

    useEffect(() => {
        const resizeListener = () => {
            let pdfWidth = ref.current.clientWidth; 
            let pdfHeight = ref.current.clientHeight;
            let pdfWidthInch = pdfWidth * 0.01 + 1;
            let pdfHeightInch = pdfHeight * 0.01 + .75;
            setPdfDemension([pdfHeightInch, pdfWidthInch]);
        }
        setTimeout(() => resizeListener(), 500);
        window.addEventListener('resize', resizeListener);
        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, []);
    const options = {
        orientation: 'landscape',
        unit: "in",
        format: pdfDemension
    }
    return (
        <div className="invoice-container">
            <Container className="py-3" style={{position: 'relative'}}>
                <div style={{position: 'absolute', right: 40, zIndex: 1, top: 40}}>
                    {invoice && <Pdf 
                        targetRef={ref} 
                        filename={invoice.invoice_id + ".pdf"} 
                        options={options}
                        x={0.25}
                        y={0.25}
                        >
                        {({toPdf}) => {
                            return (
                            <Button variant="default" size="sm" className="mx-1" onClick={toPdf}>
                                <img src={require("../../assets/images/pdf_icon.png")} height="18" alt="PDF"/> <span>PDF</span>
                            </Button>
                            )
                        }}
                    </Pdf>
                    }
                    {invoice && <CSVLink
                        filename={invoice.invoice_id + ".csv"}
                        headers={[{
                            label: "Date",
                            key: "paid_date"
                        }, {
                            label: "Invoice number",
                            key: "invoice_id"
                        }, {
                            label: "Total",
                            key: "total"
                        }, {
                            label: "Sub total",
                            key: "sub_total"
                        }, {
                            label: "GST",
                            key: "gst"
                        }, {
                            label: "Item name",
                            key: "item_name"
                        }, {
                            label: "Item description",
                            key: "item_description"
                        }, {
                            label: "To",
                            key: "to"
                        }]} 
                        data={[{
                            paid_date: moment(invoice.paid_date).format("DD MMM YYYY HH:mm:ss"),
                            invoice_id: invoice.invoice_id,
                            total: Number(invoice.amount).toFixed(2),
                            sub_total: Number(invoice.amount - invoice.gst).toFixed(2),
                            gst: Number(invoice.gst).toFixed(2),
                            item_name: invoice.item_name,
                            item_description: invoice.item_description,
                            to: invoice.company
                        }]}  
                        className="btn btn-default btn-sm"> 
                        <img src={require("../../assets/images/csv_icon.png")} height="18" alt="CSV"/> <span>CSV</span>
                    </CSVLink>}
                </div>
                <div ref={ref}>
                    <Card className="mb-3">
                        <Card.Body className="p-4">
                            <h3 className="page-title mb-4">Tax Invoice</h3>
                            {
                                invoice &&
                                <div className="d-flex justify-content-between invoice-content">
                                    <div className="invoice-to mb-2">
                                        <h5 className="text-dark">To</h5>
                                        <h5>{invoice.item_name}</h5>
                                        <div className="description-items">
                                            <div className="description-item">
                                                <div className="description-item-name">Invoice number</div>
                                                <div className="description-item-value">{invoice.invoice_id}</div>
                                            </div>
                                            <div className="description-item">
                                                <div className="description-item-name">Paid date</div>
                                                <div className="description-item-value">{moment(invoice.paid_date).format("DD MMM YYYY")}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="invoice-from mb-2">
                                        <h5 className="text-dark">From</h5>
                                        <Row>
                                            <Col>
                                                <h5>{invoice.company}</h5>
                                                <p className="mb-0">{invoice.address}</p>
                                            </Col>
                                            <Col>
                                                <h5>All billing enquiries</h5>
                                                <p className="mb-0">{invoice.email}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            }
                        </Card.Body>
                    </Card>
                    <Card>
                        {
                            invoice &&
                            <Card.Body className="p-4 item-description-container">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="item-description-title"><img style={{verticalAlign: "middle"}} src={require("../../assets/images/bar_sort_icon.png")} height="14" alt="Bar Sort" className="me-2"/> Item description</div>
                                    <div className="item-description-title"><img style={{verticalAlign: "middle"}} src={require("../../assets/images/card_icon.png")} height="25" alt="Card" className="me-2"/> Amount</div>
                                </div>
                                <div className="d-flex justify-content-between item-description-content mb-4">
                                    <div>
                                        <p className="mb-1">{invoice.item_name}</p>
                                        <p>{invoice.item_description}</p>
                                    </div>
                                    <div>{Number(invoice.amount - invoice.gst).toFixed(2)}</div>
                                </div>
                                <div className="invoice-billing-info">
                                    <div className="invoice-billing-left-info">
                                        <div>
                                            <div>Sub total</div> 
                                            <div>{Number(invoice.amount - invoice.gst).toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div>Total GST 10%</div> 
                                            <div>{Number(invoice.gst).toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="invoice-billing-right-info">
                                        <div>Amount due aus</div>
                                        <div>{Number(invoice.amount).toFixed(2)}</div>
                                    </div>
                                </div>
                            </Card.Body>
                        }
                    </Card>
                </div>
            </Container>
        </div>
    )
}

export default Invoice;