import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading } from '../../store/reducers/userReducer'
import Http from '../../services/Http'
import { toast } from 'react-toastify'
import './Lecture.css'
const Lecture = () => {
  const mathRef = useRef(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [subTopic, setSubTopic] = useState({ name: '', content: '' })
  const user = useSelector(store => store.user.user)
  const params = useParams()

  useEffect(() => {
    document.title = "AnswerSheet - HSC made easy"
    const getLecture = async () => {
      dispatch(setLoading(true));
      let { year, subject, topic, subtopic } = params;
      let { data } = await Http.get("sub-topics/get-subtopic-by-slug", {
        params: {
          year_slug: year,
          subject_slug: subject,
          topic_slug: topic,
          subtopic_slug: subtopic
        }
      });
      if (data.success) {
        let { permission, subject } = data.data
        if (Number(permission) === 0) {
          setSubTopic(data.data);
        } else if (Number(permission) === 1) {
          if (user._id) setSubTopic(data.data);
          else {
            toast.info("Sign up to view this for free.");
            // navigate("/login");
          }
        } else if (Number(permission) === 2) {
          if (user._id) {
            if (checkMembership(subject)) {
              setSubTopic(data.data);
            } else {
              toast.info('Premium membership access only.');
            }
          } else {
            toast.info('Sign up to view.')
            // navigate("/login");
          }
        }
        setTimeout(() => dispatch(setLoading(false)), 1500)
      } else {
        toast.error(data.msg)
        navigate(`/subjects`)
      }
    }
    getLecture()
  }, [])

  const checkMembership = async subject => {
    await Http.get('check-membership', {
      params: {
        user: user._id,
        subject: subject
      }
    })
    return false
  }

  useEffect(() => {
    window.com.wiris.js.JsPluginViewer.parseElement(
      mathRef.current,
      true,
      function () {}
    )
  }, [subTopic])

  return (
    <div className='lecture-container'>
      <Container>
        <Card className='mb-4'>
          <Card.Body className='pt-5 px-5 pb-4'>
            <h2 className='lecture-title'>{subTopic.name}</h2>
            <div
              ref={mathRef}
              className='mt-3 lecture-content'
              dangerouslySetInnerHTML={{ __html: subTopic.content }}
            ></div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default Lecture
