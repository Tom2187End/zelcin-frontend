import { useSelector, useDispatch } from 'react-redux'
import { CContainer, CHeader, CHeaderBrand, CHeaderNav, CHeaderToggler } from '@coreui/react'
import { LinkContainer } from "react-router-bootstrap";
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import logo from "../../assets/images/logo.svg";
import { AppHeaderDropdown } from './index'
import { setSidebar } from "../../store/reducers/adminReducer";

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.admin.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch(setSidebar(!sidebarShow))}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <LinkContainer to="/">
          <CHeaderBrand className="mx-auto d-md-none">
              <img src={logo} height={48} alt="Logo" />
          </CHeaderBrand>
        </LinkContainer>
        <CHeaderNav className="d-none d-md-flex me-auto">
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown/>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
