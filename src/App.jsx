import "./App.css"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {Routes, Route} from "react-router-dom";
import OpenRoute from "./components/core/Auth/OpenRoute";
import HomePage from "./pages/HomePage";
import Navbar from "./components/common/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";  
import PageLoader from "./components/common/PageLoader";  
import ConfirmationModal from "./components/common/ConfirmationModal";
import Cart from "./components/core/DashBorad/Cart";
import EnrolledCourses from "./components/core/DashBorad/EnrolledCourses";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import MyProfile from "./components/core/DashBorad/MyProfile";
import Settings from "./components/core/DashBorad/Settings/index"
import { getUserDetails } from "./services/operations/profileAPIs";
import Error from "./components/common/Error";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/DashBorad/AddCourse";
import MyCourses from "./components/core/DashBorad/MyCourses";
import EditCourse from "./components/core/DashBorad/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage";
import Instructor from "./components/core/DashBorad/Instructor";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
// import Instructor from "./components/core/DashBorad/InstructorDashboard/InstructorChart"

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector( (state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
       const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Navbar/>
       <Routes>
         <Route path="/"  element={ <HomePage/> }/>
         <Route path="/about-us" element={<AboutUsPage />} />
         <Route path="/contact-us" element={<ContactUsPage />} />
         <Route path="courses/:courseId" element={<CourseDetails />} />
         <Route path="courses-category/:catalogName" element={<Catalog />} />

        {/* Open Route - for Only Non Logged in User */}

        <Route
          path="login"
          element={
            <OpenRoute>
              <LoginPage />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPasswordPage />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePasswordPage />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <SignupPage />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmailPage />
            </OpenRoute>
          }
        />

        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} /> 
          {/* Route only for Instructors */}
           {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse/>} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
          {/* Route only for Students */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
              <Route path="/dashboard/purchase-history" element={<PurchaseHistoryPage />} />
            </>
          )}
          <Route path="dashboard/settings" element={<Settings />} />
        </Route>
       
        <Route
          element={
            <PrivateRoute>
              <ViewCourse/>
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails/>}
              />
            </>
          )}
        </Route> 
      
       {/* 404 Page */}
       <Route path="*" element={<Error />} />        

       </Routes>
    </div>
  );
}

export default App;
