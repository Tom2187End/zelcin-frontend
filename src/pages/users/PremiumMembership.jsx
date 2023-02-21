import { useState, useEffect } from 'react'
import { Container, Modal, Button, Accordion, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Http from '../../services/Http'
import { toast } from 'react-toastify'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import WalletSvg from '../../assets/images/Wallet.svg'
import PerfectAccessSvg from '../../assets/images/Perfect_Access.svg'
import SummarySvg from '../../assets/images/Summary.svg'
import RealAccessSvg from '../../assets/images/Real_Access.svg'
import OnlineAccessSvg from '../../assets/images/Online_Access.svg'
import './PremiumMembership.css'

const PremiumMembership = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [years, setYears] = useState([])
  const [memberships, setMemberships] = useState([])
  const [membership, setMembership] = useState({})
  const [selectedSubjects, setSelectedSubjects] = useState([])

  useEffect(() => {
    document.title = 'Join AnswerSheet - affordable HSC support'
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
  useEffect(() => {
    const getMemberships = async () => {
      let { data } = await Http.get('memberships')
      setMemberships(data.memberships)
    }
    getMemberships()
  }, [])

  const chooseMembershipType = membership => {
    setMembership(membership)
    setIsOpen(true)
  }

  const selectSubject = (subject, year) => {
    let subjects = [...selectedSubjects]
    let find = subjects.indexOf(subject)
    if (find > -1) {
      subjects.splice(find, 1)
    } else {
      subject.year_name = year.name;
      subjects.push(subject)
    }
    setSelectedSubjects(subjects)
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
  const purchaseMembership = () => {
    let membershipToPurchase = {
      name: membership.name,
      description: membership.description,
      period: Number(membership.items[0].period),
      subjects: selectedSubjects,
      price: getTotalPrice()
    }
    window.localStorage.setItem(
      'membership',
      JSON.stringify(membershipToPurchase)
    )
    navigate('/premium-signup')
  }
  return (
    <div className='premium-membership-container'>
      <Container>
        <div className='page-content'>
          <h2 className='page-title mb-3 mb-md-4 text-center'>
            Premium membership
          </h2>
          <div className='membership-items mb-5'>
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
                    <p className='mb-0'>(opending special)</p>
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
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h2 className='page-title mb-4 text-center'>Why AnswerSheet?</h2>
          <ul className='why-answersheet-nav mb-4 mb-md-5'>
            <li>
              <LazyLoadImage src={WalletSvg} alt='wallet' />
              <p>One payment - no subscription - no lock in</p>
            </li>
            <li>
              <LazyLoadImage src={PerfectAccessSvg} alt='perfect_access' />
              <p>Access 100's of exam - style questions sorted by topic</p>
            </li>
            <li>
              <LazyLoadImage src={SummarySvg} alt='summaries' />
              <p>
                Full course summaries - everything you need for a band 6 and
                nothing extra
              </p>
            </li>
            <li>
              <LazyLoadImage src={RealAccessSvg} alt='real_access' />
              <p>
                Access our practice exams to get you ready for the real thing
              </p>
            </li>
            <li>
              <LazyLoadImage src={OnlineAccessSvg} alt='online_access' />
              <p>Access online support from our team of tutors</p>
            </li>
          </ul>
        </div>
        <Modal
          show={isOpen}
          onHide={() => setIsOpen(false)}
          centered
          size='lg'
          className='premium-membership-modal'
        >
          <Modal.Body className='p-4'>
            <Modal.Title as='h3' className='mb-2'>
              {membership.label} AnswerSheet premium
            </Modal.Title>
            <div>
              <p className='fs-5 fw-400 mb-1'>Choose your subject(s)</p>
              <Accordion defaultActiveKey={-1}>
                {years.map((year, idx) => (
                  <Accordion.Item key={idx} eventKey={idx}>
                    <Accordion.Header>{year.name}</Accordion.Header>
                    <Accordion.Body>
                      <ul className='mb-0 nav flex-column'>
                        {year.subjects.map((subject, idx) => (
                          <li
                            key={idx}
                            className='py-2'
                            onClick={() => selectSubject(subject, year)}
                            style={{ cursor: 'pointer' }}
                          >
                            {subject.name}
                            <Form.Check
                              inline
                              name='subjects'
                              className='float-end'
                              checked={
                                isSelectedSubject(subject) ? true : false
                              }
                              value={subject}
                              onChange={ev => selectSubject(ev.target.value, year)}
                            />
                          </li>
                        ))}
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
                    ? `for ${selectedSubjects.length} subjects`
                    : ''}
                </h5>
                {selectedSubjects.length !== 0 && (
                  <h6 className='mb-0 ps-1'>Only $15 for one more subject.</h6>
                )}
              </div>
              <Button
                variant='primary'
                className='float-end'
                disabled={getTotalPrice() === 0}
                onClick={purchaseMembership}
              >
                Continue
              </Button>
            </div>
            <button
              className='btn-close'
              onClick={() => setIsOpen(false)}
            ></button>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}

export default PremiumMembership
