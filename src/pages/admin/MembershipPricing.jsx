import { useState, useEffect } from 'react'
import { Card, Modal, Form, Button } from 'react-bootstrap'
import { Formik, FormikProvider } from 'formik'
import * as yup from 'yup'
import DataTable from '../../components/DataTable'
import Http from '../../services/Http'
import { toast } from 'react-toastify'

const MembershipPricing = () => {
  const [isNew, setIsNew] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDel, setIsDel] = useState(false)
  const [isGetData, setIsGetData] = useState(0)
  const [priceId, setPriceId] = useState(0)
  const [data, setData] = useState([])
  const [sort, setSort] = useState('')
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    totalCount: 0,
    pageSize: 10
  })
  const [memberships, setMemberships] = useState([])
  const [values, setValues] = useState({
    period: 3,
    subject_nums: 1,
    price: 69
  })
  const validationSchema = yup.object({
    period: yup.number().required(),
    subject_nums: yup.number().required(),
    price: yup.number().required('Please enter the price.')
  })
  const columns = [
    {
      key: 'period',
      name: 'Membership period',
      render: (rowData, idx) =>
        Number(rowData.period) === 3
          ? 'Three months'
          : Number(rowData.period) === 12
          ? 'A year'
          : 'Unlimited'
    },
    {
      key: 'subject_nums',
      name: 'Number of subjects',
      render: (rowData, idx) => Number(rowData.subject_nums) + ' Subjects'
    },
    {
      key: 'price',
      name: 'Price',
      render: (rowData, idx) => 'AUD ' + Number(rowData.price).toFixed(2)
    },
    {
      key: '',
      name: 'Action',
      width: 90,
      sortable: false,
      render: (rowData, idx) => (
        <>
          <Button
            size='sm'
            variant='outline-success me-2'
            onClick={() => onEdit(rowData._id)}
          >
            <i className='fa fa-edit'></i>
          </Button>
          <Button
            size='sm'
            variant='outline-danger'
            onClick={() => onRemove(rowData._id)}
          >
            <i className='fa fa-trash-o'></i>
          </Button>
        </>
      )
    }
  ]

  useEffect(() => {
    let getMemberships = async () => {
      let { data } = await Http.get('memberships')
      setMemberships(data.memberships)
    }
    getMemberships()
  }, [])

  useEffect(() => {
    let getPrices = async () => {
      let { data } = await Http.get('admin/membership-pricing', {
        params: {
          search: search,
          length: pagination.pageSize,
          sortKey: sort ? sort.key : '',
          sortDir: sort ? sort.dir : ''
        }
      })
      setData(data.data);
      setPagination({...pagination, totalCount: data.totalCount});
    }
    getPrices()
  }, [isGetData])

  const onChange = ({ search, pagination, sort }) => {
    setSort(sort)
    setSearch(search)
    setPagination(pagination)
    setIsGetData(!isGetData);
  }

  const onSave = async (pricing, { resetForm }) => {
    let { data } = await Http.post('admin/membership-pricing', pricing)
    if (data.status) {
      toast.success(data.msg)
      resetForm()
      setIsNew(false)
      setIsGetData(!isGetData)
    } else {
      toast.error(data.msg)
    }
  }

  const onEdit = async id => {
    setIsEdit(true)
    setPriceId(id)
    let { data } = await Http.get(`admin/membership-pricing/${id}`)
    setValues({
      period: Number(data.period),
      subject_nums: Number(data.subject_nums),
      price: Number(data.price)
    })
  }

  const onUpdate = async (pricing, { resetForm }) => {
    let { data } = await Http.put(
      `admin/membership-pricing/${priceId}`,
      pricing
    )
    if (data.status) {
      toast.success(data.msg)
      resetForm()
      setIsEdit(false)
      setIsGetData(!isGetData)
    } else {
      toast.error(data.msg)
    }
  }

  const onRemove = id => {
    setIsDel(true)
    setPriceId(id)
  }

  const onDelete = async () => {
    let { data } = await Http.delete(`admin/membership-pricing/${priceId}`)
    if (data.status) {
      toast.success(data.msg)
      setIsDel(false)
      setIsGetData(!isGetData)
    } else {
      toast.error(data.msg)
    }
  }

  return (
    <Card className='membership-pricing-container'>
      <Card.Header
        style={{ background: '#3c4b64' }}
        bsPrefix='card-header py-3'
      >
        <Card.Title as='h5' bsPrefix='card-title mb-0 text-light'>
          Membership pricing
          <Button
            variant='primary'
            size='sm'
            className='float-end'
            onClick={() => setIsNew(true)}
          >
            <i className='fa fa-plus'></i> New price
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
      </Card.Body>
      <Modal show={isNew} onHide={() => setIsNew(false)}>
        <Modal.Header>
          <Modal.Title>New membership price</Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={validationSchema}
          onSubmit={onSave}
          initialValues={values}
          enableReinitialize
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className='mb-3'>
                  <Form.Label>Membership period</Form.Label>
                  <Form.Select
                    name='period'
                    onChange={handleChange}
                    value={values.period}
                    touched={touched}
                    isInvalid={!!errors.period}
                  >
                    {memberships.map((membership, idx) => (
                      <option key={idx} value={membership.period}>
                        {membership.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {errors.period}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Number of subjects</Form.Label>
                  <Form.Select
                    name='subject_nums'
                    onChange={handleChange}
                    value={values.subject_nums}
                    touched={touched}
                    isInvalid={!!errors.subject_nums}
                  >
                    <option value='1'>1 subject</option>
                    <option value='2'>2 subjects</option>
                    <option value='3'>3 subjects</option>
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {errors.subject_nums}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    name='price'
                    placeholder='0'
                    type='number'
                    min='0'
                    step='0.1'
                    onChange={handleChange}
                    value={values.price}
                    touched={touched}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='primary' type='submit'>
                  <i className='fa fa-thumbs-up'></i> Yes
                </Button>
                <Button variant='danger' onClick={() => setIsNew(false)}>
                  <i className='fa fa-thumbs-down'></i> No
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal show={isEdit} onHide={() => setIsEdit(false)}>
        <Modal.Header>
          <Modal.Title>Edit membership price</Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={validationSchema}
          onSubmit={onUpdate}
          initialValues={values}
          enableReinitialize
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className='mb-3'>
                  <Form.Label>Membership period</Form.Label>
                  <Form.Select
                    name='period'
                    onChange={handleChange}
                    value={values.period}
                    touched={touched}
                    isInvalid={!!errors.period}
                  >
                    {memberships.map((membership, idx) => (
                      <option key={idx} value={membership.period}>
                        {membership.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {errors.period}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Number of subjects</Form.Label>
                  <Form.Select
                    name='subject_nums'
                    onChange={handleChange}
                    value={values.subject_nums}
                    touched={touched}
                    isInvalid={!!errors.subject_nums}
                  >
                    <option value='1'>1 subject</option>
                    <option value='2'>2 subjects</option>
                    <option value='3'>3 subjects</option>
                  </Form.Select>
                  <Form.Control.Feedback type='invalid'>
                    {errors.subject_nums}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    name='price'
                    placeholder='0'
                    type='number'
                    min='0'
                    step='0.1'
                    onChange={handleChange}
                    value={values.price}
                    touched={touched}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='primary' type='submit'>
                  <i className='fa fa-thumbs-up'></i> Yes
                </Button>
                <Button variant='danger' onClick={() => setIsEdit(false)}>
                  <i className='fa fa-thumbs-down'></i> No
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <Modal show={isDel} onHide={() => setIsDel(false)}>
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleting is permanent and cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={onDelete}>
            <i className='fa fa-thumbs-up'></i> Yes
          </Button>
          <Button variant='danger' onClick={() => setIsDel(false)}>
            <i className='fa fa-thumbs-down'></i> No
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}

export default MembershipPricing
