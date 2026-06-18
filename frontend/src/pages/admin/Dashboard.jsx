import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DashBoardLayout from '../../components/DashBoardLayout'
import moment from "moment"

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [dashboardData,setDashboardData]= useState(null);
  const[pieChartData,setPieCharData]= useState(null);
  const[barchartData,setBarChartData] = useState(null);

  const getDashBoardData= async() =>{
    try{
   const response = await axiosInstance.get("/task/dashboard-data")
   if(response.data){
    setDashboardData(response.data)
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
      <div className="">
        <div className="">
          <div className="">
            <h2 className=''>{currentUser?.name}</h2>
            <p className="">{moment().format("dddd Do MMMM YYYY")}</p>
          </div>
        </div>
      </div>
    </DashBoardLayout>
  )
}

export default Dashboard

