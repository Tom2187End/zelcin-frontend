import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LinkContainer } from "react-router-bootstrap";
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CNavItem } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from "../../assets/images/footer-logo.svg";
import smallLogo from "../../assets/images/small-logo.svg";
import CIcon from '@coreui/icons-react'
import { cilUserPlus, cilVoiceOverRecord, cilLibrary, cilBook, cilLayers, cilEnvelopeLetter, cilChart, cilCash } from '@coreui/icons';
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { setSidebarUnfoldable } from '../../store/reducers/adminReducer';
import { setSidebar } from "../../store/reducers/adminReducer";


const navigation = [{
    component: CNavItem,
    name: "Users",
    to: "/admin/users",
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon"/>,
    role: 1
}, {
  component: CNavItem,
  name: "Staff",
  to: "/admin/staffs",
  icon: <CIcon icon={cilVoiceOverRecord} customClassName="nav-icon"/>,
  role: 2
}, {
  component: CNavItem,
  name: "Years",
  to: "/admin/years",
  icon: <CIcon icon={cilLibrary} customClassName="nav-icon"/>,
  role: 1
}, {
  component: CNavItem,
  name: "Subjects",
  to: "/admin/subjects",
  icon: <CIcon icon={cilBook} customClassName="nav-icon"/>,
  role: 1
}, {
  component: CNavItem,
  name: "Topics",
  to: "/admin/topics",
  icon: <CIcon icon={cilLayers} customClassName="nav-icon"/>,
  role: 1
}, {
  component: CNavItem,
  name: "Subtopics",
  to: "/admin/sub-topics",
  icon: <CIcon icon={cilLayers} customClassName="nav-icon"/>,
  role: 1
}, {
  component: CNavItem,
  name: "Membership pricing",
  to: "/admin/membership-pricing",
  icon: <CIcon icon={cilCash} customClassName="nav-icon"/>,
  role: 2
}, {
    component: CNavItem,
    name: "Sales",
    to: "/admin/sales",
    icon: <CIcon icon={cilChart} customClassName="nav-icon"/>,
    role: 1
}];

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.admin.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.admin.sidebarShow)
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={visible => dispatch(setSidebar(visible))}
    >
      <LinkContainer to="/">
        <CSidebarBrand className="d-none d-md-flex">
          <img className="sidebar-brand-full" src={logo} height={35} alt="Logo" style={{marginLeft: -20}}/>
          <img className="sidebar-brand-narrow" src={smallLogo} height={35} alt="Logo"/>
        </CSidebarBrand>
      </LinkContainer>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(setSidebarUnfoldable(!unfoldable))}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)