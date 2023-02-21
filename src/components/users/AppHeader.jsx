import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUser } from '../../store/reducers/userReducer'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import LogoSvg from '../../assets/images/logo.svg'
import './AppHeader.css'
import { toast } from 'react-toastify'

const AppHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [navbarBgStatus, setNavbarBgStatus] = useState(0)
  const [isExpand, setIsExpand] = useState(true)

  const navbarType = 0
  const logout = () => {
    dispatch(deleteUser())
    toast.success('Logged out successfully.')
    navigate('/login')
  }
  useEffect(() => {
    const scrollObserver = e => {
      if (
        window.document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        setNavbarBgStatus(1)
      } else {
        setNavbarBgStatus(0)
      }
    }
    window.addEventListener('scroll', scrollObserver)
    return () => {
      window.removeEventListener('scroll', scrollObserver)
    }
  }, [])

  useEffect(() => {
    setIsExpand(false)
  }, [location])

  const normalNavItems = [
    {
      path: '/subjects',
      name: 'Subjects'
    },
    {
      path: '/about-us',
      name: 'About us'
    },
    {
      path: '/membership',
      name: 'Membership'
    },
    {
      path: '/signup',
      name: 'Sign up'
    },
    {
      path: '/login',
      name: 'Login'
    }
  ]
  const privateNavItems = [
    {
      path: '/invoices',
      name: 'Invoices',
      isHref: true
    },
    {
      path: '/subjects',
      name: 'Subjects',
      isHref: true
    },
    {
      path: '/private-membership',
      name: 'Membership'
    },
    {
      path: '/logout',
      name: 'Logout',
      isHref: false,
      onClick: logout
    }
  ]
  return (
    <div>
      {user.token ? (
        <Navbar
          expand='xl'
          style={{ backgroundColor: '#D6E4F1' }}
          className='logged-header'
          collapseOnSelect
        >
          <Container>
            <LinkContainer to='/'>
              <Nav.Link className='navbar-brand'>
                <LazyLoadImage src={LogoSvg} alt='logo' />
              </Nav.Link>
            </LinkContainer>
            <Navbar.Toggle aria-controls='navbar' />
            <Navbar.Collapse id='navbar'>
              <Nav className='ms-auto' activeKey={location.pathname}>
                {privateNavItems.map((navItem, idx) => {
                  if (navItem.onClick) {
                    return (
                      <Nav.Item
                        className='hide-item'
                        key={idx}
                        onClick={navItem.onClick}
                      >
                        <Nav.Link>{navItem.name}</Nav.Link>
                      </Nav.Item>
                    )
                  } else {
                    return (
                      <Nav.Item className='hide-item' key={idx}>
                        <LinkContainer to={navItem.path}>
                          <Nav.Link>{navItem.name}</Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                    )
                  }
                })}
                <NavDropdown
                  className='avatar-dropdown'
                  align='end'
                  title={
                    <span>
                      <Image
                        roundedCircle={true}
                        className='avatar me-2'
                        src={require('../../assets/images/avatar.png')}
                      />
                      <span>{user.user.firstName}</span>
                    </span>
                  }
                >
                  {user.user.role !== 0 && (
                    <NavDropdown.Item onClick={() => navigate('/admin')}>
                      {user.user.role === 1 ? 'Staff panel' : 'Admin panel'}
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item onClick={() => navigate('/profile')}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => logout()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : (
        <Navbar
          expand='lg'
          style={{
            backgroundColor: navbarType
              ? navbarBgStatus
                ? '#D6E4F1'
                : '#f4f7fa'
              : '#D6E4F1'
          }}
          collapseOnSelect
        >
          <Container>
            <LinkContainer to='/'>
              <Nav.Link className='navbar-brand'>
                <LazyLoadImage src={LogoSvg} alt='logo' />
              </Nav.Link>
            </LinkContainer>
            <Navbar.Toggle aria-controls='navbar' />
            <Navbar.Collapse id='navbar'>
              <Nav className='ms-auto' activeKey={location.pathname}>
                {normalNavItems.map((navItem, idx) => (
                  <Nav.Item key={idx}>
                    <LinkContainer to={navItem.path}>
                      <Nav.Link>{navItem.name}</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </div>
  )
}

export default AppHeader
