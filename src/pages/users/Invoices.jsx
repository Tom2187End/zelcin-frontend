import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card } from 'react-bootstrap'
import DataTable from '../../components/DataTable'
import Http from '../../services/Http'
import moment from 'moment'

const Invoices = () => {
  const navigate = useNavigate()
  const [isGetData, setIsGetData] = useState(false)
  const [data, setData] = useState([])
  const [sort, setSort] = useState()
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    totalCount: 0,
    pageSize: 10
  })
  const columns = [
    {
      key: '_id',
      name: 'No',
      width: 65,
      render: (rowData, idx) => idx + 1
    },
    {
      key: 'invoice_id',
      name: 'Invoice number'
    },
    {
      key: 'item_name',
      name: 'Item'
    },
    {
      key: 'amount',
      name: 'Amount'
    },
    {
      key: 'gst',
      name: 'GST'
    },
    {
      key: 'currency',
      name: 'Currency'
    },
    {
      key: 'paid_date',
      name: 'Paid date',
      render: (rowData, idx) =>
        moment(rowData.paid_date).format('YYYY-MM-DD HH:mm:ss')
    }
  ]

  useEffect(() => {
    document.title = 'AnswerSheet - Invoices'
  }, [])

  useEffect(() => {
    const getInvoices = async () => {
      let { data } = await Http.get('invoices', {
        params: {
          search: search,
          length: pagination.pageSize,
          page: pagination.page,
          sortKey: sort ? sort.key : '',
          sortDir: sort ? sort.dir : ''
        }
      })
      setData(data.data)
      setPagination({ ...pagination, totalCount: data.totalCount })
    }
    getInvoices()
  }, [isGetData])
  const onChange = ({ search, pagination, sort }) => {
    setSort(sort)
    setSearch(search)
    setPagination(pagination)
    setIsGetData(!isGetData)
  }
  const onRow = id => {
    console.log(id)
    navigate(`/invoices/${id}`)
  }
  return (
    <div className='invoices-container py-4'>
        <Container>
            <Card className='create-subject-container'>
                <Card.Header bsPrefix='card-header py-3 bg-white'>
                <Card.Title bsPrefix='card-title mb-0' as='h2'>
                    Invoices
                </Card.Title>
                </Card.Header>
                <Card.Body>
                <DataTable
                    columns={columns}
                    data={data}
                    sort={sort}
                    search={search}
                    pagination={pagination}
                    emptyText='No invoices available'
                    onRow={onRow}
                    onChange={onChange}
                />
                </Card.Body>
            </Card>
        </Container>
    </div>
  )
}

export default Invoices
