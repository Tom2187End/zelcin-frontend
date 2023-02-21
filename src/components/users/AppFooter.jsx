import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import FooterLogoSvg from "../../assets/images/footer-logo.svg";
import "./AppFooter.css";

const AppFooter = () => {
    const location = useLocation();
    const user = useSelector(state => state.user);

    const navItems = [{
        path: "/faq",
        name: "FAQs"
    }, {
        path: "/contact-us",
        name: "Contact us"
    }, {
        path: "/privacy-policy",
        name: "Privacy policy"
    }, {
        path: "/terms-conditions",
        name: "Terms & Conditions"
    }]
    return (
        <div className={'footer ' + (user.token ? 'logged-footer' : '')}>
            <Nav className="footer-logo">
                <Nav.Item>
                    <LinkContainer to="/">
                        <Nav.Link>
                            <LazyLoadImage src={FooterLogoSvg} alt="logo"/>
                        </Nav.Link>
                    </LinkContainer>
                </Nav.Item>
            </Nav>
            <Nav activeKey={location.pathname}>
                {
                    navItems.map((navItem, idx) => (
                        <Nav.Item key={idx}>
                            <LinkContainer to={navItem.path}>
                                <Nav.Link>{navItem.name}</Nav.Link>
                            </LinkContainer>
                        </Nav.Item>
                    ))
                }
            </Nav>
        </div>
    )
}

export default AppFooter;