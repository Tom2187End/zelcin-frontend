import React, { Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppSidebar from './AppSidebar'
import './AppContent.css'
const Home = React.lazy(() => import('../../pages/users/Home'))
const Subjects = React.lazy(() => import('../../pages/users/Subjects'))
const Topics = React.lazy(() => import('../../pages/users/Topics'))
const SubTopics = React.lazy(() => import('../../pages/users/SubTopics'))
const Lecture = React.lazy(() => import('../../pages/users/Lecture'))
const AboutUs = React.lazy(() => import('../../pages/users/AboutUs'))
const PremiumMembership = React.lazy(() =>
  import('../../pages/users/PremiumMembership')
)
const SignUp = React.lazy(() => import('../../pages/users/SignUp'))
const Login = React.lazy(() => import('../../pages/users/Login'))
const ForgotPassword = React.lazy(() =>
  import('../../pages/users/ForgotPassword')
)
const ResetPassword = React.lazy(() =>
  import('../../pages/users/ResetPassword')
)
const Faqs = React.lazy(() => import('../../pages/users/Faqs'))
const ContactUs = React.lazy(() => import('../../pages/users/ContactUs'))
const PrivacyPolicy = React.lazy(() =>
  import('../../pages/users/PrivacyPolicy')
)
const TermsAndConditions = React.lazy(() =>
  import('../../pages/users/TermsAndConditions')
)
const ConfirmEmail = React.lazy(() => import('../../pages/users/ConfirmEmail'));
const ConfirmContact = React.lazy(() => import('../../pages/users/ConfirmContact'));
const VerifyEmail = React.lazy(() => import('../../pages/users/VerifyEmail'))
const VerifyChangedEmail = React.lazy(() => import('../../pages/users/VerifyChangedEmail'));
const Profile = React.lazy(() => import('../../pages/users/Profile'))
const Invoices = React.lazy(() => import('../../pages/users/Invoices'))
const Invoice = React.lazy(() => import('../../pages/users/Invoice'))
const Membership = React.lazy(() => import('../../pages/users/Membership'))
const PremiumSignUp = React.lazy(() =>
  import('../../pages/users/PremiumSignUp')
)
const PrivateMembership = React.lazy(() =>
  import('../../pages/users/PrivateMembership')
)
const BillingSuccess = React.lazy(() =>
  import('../../pages/users/BillingSuccess')
)
const BillingCancel = React.lazy(() =>
  import('../../pages/users/BillingCancel')
)
const PrivateBillingSuccess = React.lazy(() =>
  import('../../pages/users/PrivateBillingSuccess')
)
const PrivateBillingCancel = React.lazy(() =>
  import('../../pages/users/PrivateBillingCancel')
)

const UserRoute = ({ user, redirectPath = '/login', children }) => {
  if (user && user.status === true) {
    return children
  }
  return <Navigate to={redirectPath} replace />
}

const AppContent = () => {
  const user = useSelector(state => state.user)

  const routes = [
    {
      path: '/',
      exact: true,
      name: 'Home',
      element: Home,
      private: false
    },
    {
      path: '/subjects',
      exact: true,
      name: 'Subjects',
      element: Subjects,
      private: false
    },
    {
      path: '/about-us',
      exact: true,
      name: 'About us',
      element: AboutUs,
      private: false
    },
    {
      path: '/premium-membership',
      exact: true,
      name: 'Premium membership',
      element: PremiumMembership,
      private: false
    },
    {
      path: '/membership',
      exact: true,
      name: 'Membership',
      element: Membership,
      private: false
    },
    {
      path: '/premium-signup',
      exact: true,
      name: 'Premium sign up',
      element: PremiumSignUp,
      private: false
    },
    {
      path: '/billing/:gateway/return',
      exact: true,
      name: 'Billing success',
      element: BillingSuccess,
      private: false
    },
    {
      path: '/billing/:gateway/cancel',
      exact: true,
      name: 'Billing cancel',
      element: BillingCancel,
      private: false
    },
    {
      path: '/signup',
      exact: true,
      name: 'Sign up',
      element: SignUp,
      private: false
    },
    {
      path: '/confirm-email',
      exact: true,
      name: 'Confirm email',
      element: ConfirmEmail,
      private: false
    },
    {
      path: '/confirm-contact',
      exact: true,
      name: 'Confirm Contact',
      element: ConfirmContact,
      private: false
    },
    {
      path: '/login',
      exact: true,
      name: 'Login',
      element: Login,
      private: false
    },
    {
      path: '/forgot-password',
      exact: true,
      name: 'Forgot password',
      element: ForgotPassword,
      private: false
    },
    {
      path: '/reset-password/:token',
      exact: true,
      name: 'Reset password',
      element: ResetPassword,
      private: false
    },
    {
      path: '/faq',
      exact: true,
      name: 'Faq',
      element: Faqs,
      private: false
    },
    {
      path: '/contact-us',
      exact: true,
      name: 'Contact us',
      element: ContactUs,
      private: false
    },
    {
      path: '/privacy-policy',
      exact: true,
      name: 'Privacy policy',
      element: PrivacyPolicy,
      private: false
    },
    {
      path: '/terms-conditions',
      exact: true,
      name: 'Terms & Conditions',
      element: TermsAndConditions,
      private: false
    },
    {
      path: '/verify-email/:token',
      exact: false,
      name: 'Verify email',
      element: VerifyEmail,
      private: false
    },
    {
      path: 'verify-changed-email/:token',
      exact: false,
      name: 'Verify changed email',
      element: VerifyChangedEmail,
      private: false
    },
    {
      path: '/profile',
      exact: true,
      name: 'Profile',
      element: Profile,
      private: true
    },
    {
      path: '/private-membership',
      exact: true,
      name: 'Private membership',
      element: PrivateMembership,
      private: true
    },
    {
      path: '/private-billing/:gateway/return',
      exact: true,
      name: 'Private Billing Success',
      element: PrivateBillingSuccess,
      private: true
    },
    {
      path: '/private-billing/:gateway/cancel',
      exact: true,
      name: 'Private Billing Cancel',
      element: PrivateBillingCancel,
      private: true
    },
    {
      path: '/invoices',
      exact: true,
      name: 'Invocies',
      element: Invoices,
      private: true
    },
    {
      path: '/invoices/:id',
      exact: true,
      name: 'Invoice',
      element: Invoice,
      private: true
    },
    {
      path: '/:year/:subject',
      exact: true,
      name: 'Topics',
      element: Topics,
      private: false
    },
    {
      path: '/:year/:subject/:topic',
      exact: true,
      name: 'Sub topics',
      element: SubTopics,
      private: false
    },
    {
      path: '/:year/:subject/:topic/:subtopic',
      exact: true,
      name: 'Lecture',
      element: Lecture,
      private: false
    }
  ]

  return (
    <div
      className={
        'page-container ' + (user.token ? 'logged-page-container' : '')
      }
    >
      {user.token && <AppSidebar />}
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
                    route.private ? (
                      <UserRoute user={user.user}>
                        <route.element />
                      </UserRoute>
                    ) : (
                      <route.element />
                    )
                  }
                />
              )
            )
          })}
          <Route path='/*' element={<Navigate to='/' />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default AppContent
