import { useState, useEffect } from 'react'
import {
  Container,
  Button,
  Modal,
  Table,
  Form,
  Card,
  Accordion
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../store/reducers/userReducer'
import Http from '../../services/Http'
import { toast } from 'react-toastify'
import './PrivateMembership.css'
import moment from 'moment'

const PrivateMembership = () => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [years, setYears] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [memberships, setMemberships] = useState([])
  const [membership, setMembership] = useState({ name: '' })
  const [purchasedMemberships, setPurchasedMemberships] = useState([])
  const [step, setStep] = useState(1)
  const [paymentType, setPaymentType] = useState('stripe')
  useEffect(() => {
    document.title = 'Join AnswerSheet - affordable HSC support'
    const getMemberships = async () => {
      let { data } = await Http.get('memberships')
      setMemberships(data.memberships)
    }
    getMemberships()
  }, [])
  useEffect(() => {
    const getPurchasedMemberships = async () => {
      let { data } = await Http.get('my-memberships')
      setPurchasedMemberships(data)
    }
    getPurchasedMemberships()
  }, [])

  useEffect(() => {
    const getYears = async () => {
      let { data } = await Http.get('years')
      if (data.success) {
        setYears(data.data)
      } else {
        toast.error(data.msg)
      }
    }
    getYears()
  }, [])

  const chooseMembershipType = membership => {
    setMembership(membership)
    setIsOpen(true)
  }

  const selectSubject = (subject, year) => {
    let subjects = [...selectedSubjects]
    let find = subjects.indexOf(subject)
    if (find > -1) {
      console.log("FIRST===>", subjects)
      subjects.splice(find, 1)
    } else {
      subject.year_name = year.name;
      subjects.push(subject)
      console.log("SECOND====>", subjects)
    }
    setSelectedSubjects(subjects)
  }
  const isAlreadyPurchased = _subject => {
    let status = false
    for (let membership of purchasedMemberships) {
      let subject = membership.subjects.find((subject, idx) => subject === _subject)
      if (subject) {
        status = true
        break
      }
    }
    return status
  }
  const isSelectedSubject = _subject => {
    if (selectedSubjects.findIndex(subject => subject === _subject) === -1) {
      return false
    } else {
      return true
    }
  }
  const getTotalPrice = () => {
    if (selectedSubjects.length === 1) {
      let item = membership.items.find(item => Number(item.subject_nums) === 1)
      return Number(item.price)
    } else if (selectedSubjects.length === 2) {
      let item = membership.items.find(item => Number(item.subject_nums) === 2)
      return Number(item.price)
    } else if (selectedSubjects.length === 3) {
      let item = membership.items.find(item => Number(item.subject_nums) === 3)
      return Number(item.price)
    } else if (selectedSubjects.length > 3) {
      let item = membership.items.find(item => Number(item.subject_nums) === 3)
      return Number(item.price) + (selectedSubjects.length - 3) * 15
    } else {
      return 0
    }
  }

  const upgradeMembership = async () => {
    let description = `${membership.name} - ${selectedSubjects.length} ${selectedSubjects.length > 1 ? 'subjects' : 'subject'} - `;
    selectedSubjects.forEach((subject, idx) => {
      if (idx === 0) description += `${subject.year_name} - ${subject.name} `;
      else description += `, ${subject.year_name} - ${subject.name}`;
    });
    let membershipToPurchase = {
      name: membership.name,
      description: description,
      period: Number(membership.items[0].period),
      subjects: selectedSubjects,
      price: getTotalPrice()
    }
    let { data } = await Http.post(`private-billing/${paymentType}`, {
      membership: membershipToPurchase
    })
    if (data.success) {
      dispatch(setLoading(false))
      window.location.href = data.redirect_url
    } else {
      dispatch(setLoading(false))
      toast.error(data.msg)
    }
  }
  return (
    <div className='private-membership-container'>
      <Container>
        <div className='page-content d-flex flex-column'>
          <h2 className='page-title mb-3 mb-md-4 text-center'>Premium membership</h2>
          <div className='membership-items'>
            {memberships.map((membership, idx) => (
              <div className='membership-item' key={idx}>
                <div
                  className={
                    'membership-item-header ' +
                    (membership.slug === 'unlimited-membership'
                      ? 'membership-item-unlimited-header'
                      : '')
                  }
                >
                  <h4 className='mb-0 text-light'>{membership.label}</h4>
                  {membership.slug === 'unlimited-membership' && (
                    <p className='mb-0'>(opening special)</p>
                  )}
                </div>
                <div className='membership-item-content'>
                  <ul>
                    {membership.items.map((item, idx) => (
                      <li key={idx}>
                        <i className='fa fa-circle'></i>
                        <span>
                          ${item.price} for{' '}
                          {Number(item.subject_nums) === 1
                            ? 'one subject'
                            : Number(item.subject_nums) === 2
                            ? 'two subjects'
                            : 'three subjects'}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className='d-grid mt-3'>
                    <Button
                      variant='primary'
                      onClick={() => chooseMembershipType(membership)}
                    >
                      Buy now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {purchasedMemberships.length ? (
            <Card className='mt-3 mb-4'>
              <Card.Header style={{ background: '#005492' }}>
                <Card.Title className='mb-0 text-light'>
                  Premium memberships
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Table
                  className='my-membership-tbl'
                  bsPrefix='table table-bordered text-center'
                >
                  <thead
                    style={{ backgroundColor: '#005492', color: '#fafafa' }}
                  >
                    <tr>
                      <th>Subjects</th>
                      <th>End date</th>
                    </tr>
                  </thead>
                  <tbody className='text-center'>
                    {purchasedMemberships.map((membership, idx) => (
                      <tr key={idx}>
                        <td>
                          <ul className='mb-0'>
                            {membership.subjects.map((subject, idx) => (
                              <li key={idx}>
                                {subject.year.name} - {subject.name}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          {Number(membership.period) === -1
                            ? '-'
                            : moment(membership.expiredDate).format(
                                'YYYY.MM.DD HH:mm:ss'
                              )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ) : null}
        </div>
        <Modal
          show={isOpen}
          onHide={() => setIsOpen(false)}
          centered
          size='lg'
          className='private-membership-modal'
        >
          <Modal.Body className='p-4'>
            <Modal.Title as='h3' className='mb-2'>
              {membership.label} AnswerSheet premium
            </Modal.Title>
            {step === 1 ? (
              <div className='step-1'>
                <div>
                  <p className='fs-5 fw-400 mb-1'>Choose your subject(s)</p>
                  <Accordion defaultActiveKey={-1}>
                    {years.map((year, idx) => (
                      <Accordion.Item key={idx} eventKey={idx}>
                        <Accordion.Header>{year.name}</Accordion.Header>
                        <Accordion.Body>
                          <ul className='mb-0 nav flex-column'>
                            {year.subjects.map((subject, idx) => {
                              let disabled = isAlreadyPurchased(subject)
                              return (
                                <li
                                  key={idx}
                                  className='py-2'
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => selectSubject(subject, year)}
                                >
                                  <span
                                    style={{
                                      color: disabled ? '#808080' : '#005492'
                                    }}
                                  >
                                    {subject.name}
                                  </span>
                                  <Form.Check
                                    inline
                                    checked={
                                      isSelectedSubject(subject)
                                        ? true
                                        : false
                                    }
                                    disabled={disabled ? true : false}
                                    name='subjects'
                                    className='float-end'
                                    value={subject}
                                    onChange={ev =>
                                      selectSubject(ev.target.value, year)
                                    }
                                  />
                                </li>
                              )
                            })}
                          </ul>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
                <div className='d-flex justify-content-between align-items-center pt-2'>
                  <div>
                    <h5 className='mb-1 ps-1'>
                      Total: ${getTotalPrice()}{' '}
                      {selectedSubjects.length
                        ? `for ${selectedSubjects.length} ${selectedSubjects.length == 1 ? 'subject' : 'subjects'}`
                        : ''}
                    </h5>
                    <h6 className='mb-0'>Only $15 for one more subject.</h6>
                  </div>
                  <Button
                    variant='primary'
                    className='float-end'
                    disabled={getTotalPrice() === 0}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className='step-2'>
                <Table bsPrefix='bg-white table table-bordered'>
                  <thead
                    style={{ backgroundColor: '#005492', color: '#fafafa' }}
                  >
                    <tr>
                      <th>Membership</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div>{membership.name} - {selectedSubjects.length} {selectedSubjects.length > 1 ? "subjects" : "subject"}</div>
                        <ul className="mb-0">
                          {
                            selectedSubjects.map((subject, idx) => <li key={idx}>{subject.year_name} - {subject.name}</li>)
                          }
                        </ul>
                      </td>
                      <td>${getTotalPrice()}</td>
                    </tr>
                    <tr>
                      <td className='fw-bolder'>Total payment</td>
                      <td>${getTotalPrice()}</td>
                    </tr>
                  </tbody>
                </Table>
                <Form.Group className='mb-3'>
                  <Form.Check
                    inline
                    id='stripe'
                    type='radio'
                    name='paymentType'
                    value='stripe'
                    className='mr-3 mb-3'
                    label={
                      <>
                        <img
                          src={require('../../assets/images/visa.png')}
                          alt='visa'
                          height='20'
                          className='mx-1'
                        />
                        <img
                          src={require('../../assets/images/mastercard.png')}
                          alt='mastercard'
                          height='20'
                          className='mx-1'
                        />
                        <img
                          src={require('../../assets/images/applepay.png')}
                          alt='applepay'
                          height='18'
                          className='mx-1'
                        />
                        <img
                          src={require('../../assets/images/googlepay.png')}
                          alt='googlepay'
                          height='20'
                          className='mx-1'
                        />
                      </>
                    }
                    checked={paymentType === 'stripe'}
                    onChange={() => setPaymentType('stripe')}
                  />
                  <Form.Check
                    inline
                    id='paypal'
                    type='radio'
                    name='paymentType'
                    value='paypal'
                    label={
                      <img
                        src={require('../../assets/images/paypal.png')}
                        height='20'
                        alt='paypal'
                        className='ms-1'
                      />
                    }
                    checked={paymentType === 'paypal'}
                    onChange={() => setPaymentType('paypal')}
                  />
                </Form.Group>
                <hr />
                <div className='form-actions'>
                  <Button variant='danger' onClick={() => setStep(1)}>
                    <i className='fa fa-undo'></i> Previous
                  </Button>
                  <Button
                    variant='primary'
                    onClick={upgradeMembership}
                    className='float-end'
                  >
                    <i className='fa fa-shopping-cart'></i> Purchase
                  </Button>
                </div>
              </div>
            )}
            <button
              className='btn-close'
              onClick={() => {
                setIsOpen(false)
                setStep(1)
              }}
            ></button>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}

export default PrivateMembership
