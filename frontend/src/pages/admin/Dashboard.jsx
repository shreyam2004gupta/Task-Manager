import React from 'react'
import { useSelector } from 'react-redux'
import DashBoardLayout from '../../components/DashBoardLayout'

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <DashBoardLayout activeMenu={"Dashboard"}>Dashboard</DashBoardLayout>
  )
}

export default Dashboard

