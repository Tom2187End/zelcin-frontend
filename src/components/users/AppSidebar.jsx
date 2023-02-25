import { useLocation, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateSidebar } from "../../store/reducers/userReducer";
import collapseIcon from "../../assets/images/collapse_icon.svg"
import DashboardIcon from "../../assets/images/invoice_icon.svg";
import DashboardActiveIcon from "../../assets/images/invoice_active_icon.svg";
import CourseIcon from "../../assets/images/subjects_icon.svg";
import CourseActiveIcon from "../../assets/images/subjects_active_icon.svg";
import MembershipIcon from "../../assets/images/membership_icon.svg";
import LogoutIcon from "../../assets/images/logout_icon.svg";
import "./AppSidebar.css";
const AppSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const expandSidebar = useSelector(store => store.user.expandSidebar);

    const logout = () => {
        dispatch(deleteUser());
        navigate("/login");
    }
    return (
        <div className={`app-sidebar ${expandSidebar ? 'expanded' : ''}`}>
            <Nav className="flex-column" activeKey={location.pathname}>
                <Nav.Item onClick={() => dispatch(updateSidebar(!expandSidebar))}>
                    <Nav.Link>
                        <span className="sidebar-icon sidebar-toggler-btn">
                            <img src={collapseIcon} alt="collapse"/>
                        </span>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <LinkContainer to="/invoices">
                        <Nav.Link>
                            <span className="sidebar-icon">
                                <img src={location.pathname === "/invoices" ? DashboardActiveIcon : DashboardIcon} alt="dashboard icon"/>
                            </span>
                            <span>Invoices</span>
                        </Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <LinkContainer to="/subjects">
                        <Nav.Link>
                            <span className="sidebar-icon">
                                <img src={location.pathname === "/subjects" ? CourseActiveIcon : CourseIcon} alt="course icon"/>
                            </span>
                            <span>Subjects</span>
                        </Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <LinkContainer to="/private-membership">
                        <Nav.Link>
                            <span className="sidebar-icon">
                                <img src={MembershipIcon} width="23" alt="membership icon"/>
                            </span>
                            <span>Memberships</span>
                        </Nav.Link>
                    </LinkContainer>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={logout}>
                        <span className="sidebar-icon">
                            <img src={LogoutIcon} alt="logout icon"/>
                        </span>
                        <span>Logout</span>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
}

export default AppSidebar;