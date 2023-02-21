import { useState, useEffect } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Http from '../../services/Http'
import DataTable from '../../components/DataTable'
import moment from 'moment'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Sales = () => {
  const [isGetData, setIsGetData] = useState(0)
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState()
  const [pagination, setPagination] = useState({
    page: 1,
    totalCount: 0,
    pageSize: 10
  })
  const weeklyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Last 7 days sales'
      }
    }
  }
  const [weeklyLabels, setWeeklyLabels] = useState([]);
  const [weeklyStatistics, setWeeklyStatistics] = useState([]);
  const weeklyData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: 'Income',
        data: weeklyStatistics,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }
  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Monthly sales'
      }
    }
  }
  const monthlyLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const [monthlyStatistics, setMonthlyStatistics] = useState([]);
  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Income',
        data: monthlyStatistics,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  const annuallyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Annually sales'
      }
    }
  }
  const [annuallyLabels, setAnnuallyLabels] = useState([]);
  const [annuallyStatistics, setAnnaullyStatistics] = useState([]);
  const annuallyData = {
    labels: annuallyLabels,
    datasets: [
      {
        label: 'Income',
        data: annuallyStatistics,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  const columns = [
    {
      key: '_id',
      name: 'No',
      width: 65,
      render: (rowData, idx) => idx + 1
    },
    {
      key: 'transaction_id',
      name: 'Transaction number'
    },
    {
      key: 'user',
      name: 'User',
      render: (rowData, idx) =>
        rowData.user.firstName + ' ' + rowData.user.lastName
    },
    {
      key: 'amount',
      name: 'Amount',
      width: 120
    },
    {
      key: 'currency',
      name: 'Currency',
      width: 120,
    },
    {
      key: 'type',
      name: 'Payment type',
      width: 160
    },
    {
      key: 'createdAt',
      name: 'Paid date',
      render: (rowData) => {
        return moment(rowData.createdAt).format("YYYY-MM-DD HH:mm:ss")
      },
      width: 180
    }
  ]

  useEffect(() => {
    const getTransactions = async () => {
      let { data } = await Http.get('admin/transactions', {
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
    getTransactions()
  }, [isGetData]);

  useEffect(() => {
    const getStatistics = async () => {
      let { data } = await Http.get("admin/transactions/get-statistics");
      setWeeklyLabels(data.weeklyStatistics.map(data => moment(data.date).format("YYYY/MM/DD")));
      setWeeklyStatistics(data.weeklyStatistics.map(data => data.amount));
      setMonthlyStatistics(data.monthlyStatistics.map(data => data.amount));
      setAnnuallyLabels(data.annuallyStatistics.map(data => data.year));
      setAnnaullyStatistics(data.annuallyStatistics.map(data => data.amount));
    }
    getStatistics();
  }, []);
  const onChange = ({ search, pagination, sort }) => {
    setSort(sort)
    setSearch(search)
    setPagination(pagination)
    setIsGetData(!isGetData)
  }
  return (
    <Card>
      <Card.Header
        style={{ background: '#3c4b64' }}
        bsPrefix='card-header py-3'
      >
        <Card.Title as='h5' bsPrefix='mb-0 card-title text-light'>
          Sales management
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4}>
            <div style={{margin: '.5rem'}}>
              <Line options={weeklyOptions} data={weeklyData} height={300}/>
            </div>
          </Col>
          <Col md={4}>
            <div style={{margin: '.5rem'}}>
              <Line options={monthlyOptions} data={monthlyData} height={300}/>
            </div>
          </Col>
          <Col md={4}>
            <div style={{margin: '.5rem'}}>
              <Line options={annuallyOptions} data={annuallyData} height={300}/>
            </div>
          </Col>
        </Row>
        <hr />
        <DataTable
          columns={columns}
          data={data}
          sort={sort}
          search={search}
          pagination={pagination}
          onChange={onChange}
        />
      </Card.Body>
    </Card>
  )
}

export default Sales
