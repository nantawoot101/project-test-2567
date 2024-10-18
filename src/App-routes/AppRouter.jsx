import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from "../Auth/login";
import Register from "../Auth/Register";
import Home from "../Display/Home";
import Profile from '../Auth/Profile';
import Header from '../Header/Header';
import HeaderAdmin from '../Header/Header-admin';
import NewProject from '../Display/newProject';
import ProjectDetail from '../Display/Project-detail';
import ManageProject from '../Display/ManageProject';
import Dashboard from '../Admin/Dash-Board';
import StudentData from '../Admin/Student-Data';
import LecturerData from '../Admin/Lecturer-Data';
import EditUser from '../Admin/Edit-User';
import EditProject from '../Display/Edit-Project';
import ManageProjectAdmin from '../Admin/ManageProjectAdmin';
import EditDataProject from '../Admin/Edit-Data-Project';
import ProjectAdmin from '../Admin/Project-Admin';
import NewProjectAdmin from '../Admin/NewProjectAdmin';
import Footer from '../Footer/Footer';
import Report from '../Admin/Report';
import Expert from '../Admin/Expert';
import EditExpert from '../Admin/Edit-Expert';
import NewExpert from '../Admin/NewExpert';
import EditAdmin from '../Admin/Edit-Admin';
import NewPassword from '../Auth/NewPassword';
import NewPasswordUser from '../Admin/NewPasswordUser';
import NewPasswordAdmin from '../Admin/NewPasswordAdmin';
import Advisor from '../Admin/Advisor';
import NewChairman from '../Admin/NewChairman';
import Chairman from '../Admin/Chairman';
import NewAdvisor from '../Admin/NweAdvisor';
import EditAdvisor from '../Admin/Edit-Advisor';
import EditChairman from '../Admin/Edit-Chairman';

// Router configuration for guests
const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
      <Footer/>

    </>,
    children: [
      { index: true, element: <Home /> },
      { path: '/home', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/profile/:member_id', element: <Profile /> },
      { path: '/new-project', element: <NewProject /> },
      { path: '/project/:id_project', element: <ProjectDetail /> },
      { path: '/manage-project/:member_id', element: <ManageProject /> },
      { path: '/home-admin', element: <Dashboard /> },
      { path: '/student', element: <StudentData /> },
      { path: '/lecturer', element: <LecturerData /> },
      { path: '/edit-user/:member_id', element: <EditUser /> },
      { path: '/edit-project/:id_project', element: <EditProject /> },
      { path: '/manage-project-admin', element: <ManageProjectAdmin /> },
      { path: '/project-admin/:id_project', element: <ProjectAdmin /> },
      { path: '/new-project-admin', element: <NewProjectAdmin /> },
      { path: '/report', element: <Report /> },
      { path: '/edit-admin/:admin_id', element: <EditAdmin /> },
      { path: '/expert', element: <Expert /> },
      { path: '/new-expert', element: <NewExpert /> },
      { path: '/edit-expert/:id_expert', element: <EditExpert />},
      { path: '/new-password', element: <NewPassword />},
      { path: '/new-password-user/:member_id', element: <NewPasswordUser />},
      {path: '/new-password-admin/:admin_id', element: <NewPasswordAdmin />},
      { path: '/advisor', element: <Advisor />},
      { path: '/chairman', element: <Chairman />},
      { path: '/new-advisor', element: <NewAdvisor />},
      { path: '/new-chairman', element: <NewChairman />},
      { path: '/edit-advisor/:id_advisor', element: <EditAdvisor />},
      { path: '/edit-chairman/:id_chairman', element: <EditChairman />},
    ],
  },
]);

// Router configuration for regular users
const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
      <Footer/>
    </>,
    children: [
      { index: true, element: <Home /> },
      { path: '/home', element: <Home /> },
      { path: '/profile/:member_id', element: <Profile /> },
      { path: '/new-project', element: <NewProject /> },
      { path: '/project/:id_project', element: <ProjectDetail /> },
      { path: '/manage-project/:member_id', element: <ManageProject /> },
      { path: '/edit-project/:id_project', element: <EditProject /> },
      { path: '/new-password', element: <NewPassword />},
      
      
      
    ],
  },
]);

// Router configuration for admin users
const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <HeaderAdmin />
      <Outlet />
    </>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: '/home-admin', element: <Dashboard /> },
      { path: '/student', element: <StudentData /> },
      { path: '/lecturer', element: <LecturerData /> },
      { path: '/', element: <Profile /> },
      { path: '/edit-user/:member_id', element: <EditUser /> },
      { path: '/manage-project-admin', element: <ManageProjectAdmin /> },
      { path: '/edit-project-data/:id_project', element: <EditDataProject/> },
      { path: '/project-admin/:id_project', element: <ProjectAdmin /> },
      { path: '/new-project-admin', element: <NewProjectAdmin /> },
      { path: '/report', element: <Report /> },
      { path: '/edit-admin/:admin_id', element: <EditAdmin /> },
      { path: '/expert', element: <Expert /> },
      { path: '/new-expert', element: <NewExpert /> },
      { path: '/edit-expert/:id_expert', element: <EditExpert />},
      { path: '/new-password-user/:member_id', element: <NewPasswordUser />},
      { path: '/new-password-admin/:admin_id', element: <NewPasswordAdmin />},
      { path: '/advisor', element: <Advisor />},
      { path: '/chairman', element: <Chairman />},
      { path: '/new-advisor', element: <NewAdvisor />},
      { path: '/new-chairman', element: <NewChairman />},
      { path: '/edit-advisor/:id_advisor', element: <EditAdvisor />},
      { path: '/edit-chairman/:id_chairman', element: <EditChairman />},
      
    ],
  },
]);

export default function AppRouter() {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isAuthenticated = !!user.member_id || !!user.admin_id; // Check if either user or admin ID exists
  const isAdmin = !!user.admin_id; // Determine if user is an admin

  if (isAuthenticated) {
    return <RouterProvider router={isAdmin ? adminRouter : userRouter} />;
  } else {
    return <RouterProvider router={guestRouter} />;
  }
}
