import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/auth/Login"
import Signup from './pages/auth/Signup'
import Dashboard from "./pages/admin/Dashboard"
import ManageTask from "./pages/admin/ManageTask"
import ManageUsers from "./pages/admin/ManageUsers"
import CreateTask from './pages/admin/CreateTask'
import PrivateRoute from './routes/PrivateRoute'
import Mytasks from './pages/users/Mytasks'
import UserDashboard from './pages/users/UserDashboard'
import TaskDetails from './pages/users/TaskDetails'
import { useSelector } from 'react-redux'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>

          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path='/admin/dashboard' element={<Dashboard/>}/>
            <Route path='/admin/tasks' element={<ManageTask/>}/>
            <Route path='/admin/users' element={<ManageUsers/>}/>
            <Route path='/admin/create-task' element={<CreateTask/>}/>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard/>}/>
            <Route path="/user/tasks" element={<Mytasks/>}/>
            <Route path="/user/task-details/:id" element={<TaskDetails/>}/>
          </Route>
          <Route path='/' element={<Root/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

const Root = () => {
  const { currentUser } = useSelector((state) => state.user)

  if (!currentUser) {
    return <Navigate to={"/login"}/>
  }
  return currentUser.role === "admin" ? (
    <Navigate to={"/admin/dashboard"}/>
  ) : (
    <Navigate to={"/user/dashboard"}/>
  )
}