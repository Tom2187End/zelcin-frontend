import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux";
import { CContainer } from '@coreui/react'
import routes from './routes';
const AdminRoute = ({
  user,
  role,
  redirectPath = "/login",
  children
}) => {
  if (user && user.role >= role) {
    return children ? children : <Outlet />;
  } else if (user && user.role > 0 && user.role < role) {
    return <Navigate to="/admin/subjects" replace/>
  }
  return <Navigate to={redirectPath} replace />;
}

const AppContent = () => {
  const user = useSelector(state => state.user.user);
  return (
    <CContainer fluid>
      <Suspense>
        <Routes>
          {routes.map((route, idx) => {
              return (
                route.element && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={
                      route.private ?
                      <AdminRoute user={user} role={route.role}>
                        <route.element/>
                      </AdminRoute> :
                      <route.element/>
                    }
                  />
                )
              )
          })}
          <Route path="/" element={<Navigate to="/admin/users"/>}/>
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default AppContent
