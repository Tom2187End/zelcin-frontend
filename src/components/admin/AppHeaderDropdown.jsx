import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useNavigate  } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { deleteUser } from "../../store/reducers/userReducer";
import {
  cilLockLocked,
  cilUser,
  cilSquare
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar from '../../assets/images/avatar.png'
import { toast } from 'react-toastify';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout =  () => {
    dispatch(deleteUser());
    toast.success("Logged out successfully.");
    navigate("/login");
  }
  const user = useSelector(state => state.user)
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar} size="md" />
        <span className="ms-1">{user.user.firstName}</span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          <CIcon icon={cilSquare} className="me-2" />
          Main site
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={() => navigate("/profile")} style={{cursor: 'pointer'}}>
        {/* <CDropdownItem onClick={() => navigate("/admin/profile")}> */}
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={() => logout()} style={{cursor: 'pointer'}}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
