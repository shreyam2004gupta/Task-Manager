import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DashBoardLayout from '../../components/DashBoardLayout'
import moment from "moment"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import RecentTasks from '../../components/RecentTasks'
import CustomPieCharts from '../../components/CustomPieCharts'

const COLORS = ["#FF6384","#36A2EB","FFCE56"]
const Dashboard = () => {

  const navigate =useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [dashboardData,setDashboardData]= useState(null);
  const[pieChartData,setPieCharData]= useState(null);
  const[barchartData,setBarChartData] = useState(null);

  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || {}
    const taskPriorityLevels = data?.taskPriorityLevel || {}

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ]

    setPieChartData(taskDistributionData)

    const priorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ]

    setBarChartData(priorityLevelData)
  }

  const getDashBoardData= async() =>{
    try{
   const response = await axiosInstance.get("/task/dashboard-data")
   if(response.data){
    setDashboardData(response.data)
    prepareChartData(response.data?.charts || null)
   }
    }catch(error){
      console.log("Error fetching DashBoard Data")
    }
  }
  useEffect(()=>{
    getDashBoardData()
    return()=>{}
  },[])
  return (
    <DashBoardLayout activeMenu={"Dashboard"}>
      <div className="p-6 space-y-6">
        <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
            <h2 className='text-2xl md:text-3xl font-bold'>Welcome! {currentUser?.name}</h2>
            <p className>{moment().format("dddd Do MMMM YYYY")}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2
              rounded-lg font-medium transition-all duration-200 shadow-md" onClick={()=>navigate("/admin/create-task")}>Create New Task</button>
            </div>
          </div>
        </div>
        {dashboardData && ( 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4  border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">
                 Toatl Task 

              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.charts?.taskDistribution?.All || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4  border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">
                 Pending Task 
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.charts?.taskDistribution?.Pending || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4  border-green-500">
              <h3 className="text-gray-500 text-sm font-medium">
                 In Progress Task 
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.charts?.taskDistribution?.InProgress || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4  border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium">
                 Completed Task 
              </h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {dashboardData?.charts?.taskDistribution?.Completed || 0}
              </p>
            </div>
          </div>)}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4"> Task Management</h3>
              <div className="h-64">
                  <CustomPieCharts data={pieChartData} label="Total balance" colors={COLORS} />
              </div>
            </div>
          </div>
          <RecentTasks tasks={dashboardData?.RecentTasks} />


      </div>
    </DashBoardLayout>
  )
}

export default Dashboard

