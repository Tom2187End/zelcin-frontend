import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Container } from "react-bootstrap"
import {
  Banner,
  TryForFree,
  IntroList,
  CategoryList
} from "../../components/users/Home"
import "./Home.css"

const Home = () => {
  const { token } = useSelector(state => state.user)
  useEffect(() => {
    document.title = "AnswerSheet - HSC made easy"
  }, []);

  return (
    <div className="home-container">
      <Banner
        title="High quality HSC study guides"
        content="Everything you need to get a Band 6"
      />
      {!token ? (
        <TryForFree
          title="Try us for free"
          content="Sign up for a free account and start studying"
        />
      ) : null}
      <div className="category-container">
        <Container>
          <IntroList title="Use AnswerSheet - Get a band 6" />
          <CategoryList />
        </Container>
      </div>
    </div>
  )
}

export default Home
