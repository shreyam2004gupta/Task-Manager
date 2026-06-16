import { MdManageHistory } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { IoMdPeople } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";

export const SIDE_MENU_DATA = [
    {
        id:1,
        label:"Dashboard",
        icon: MdDashboardCustomize,
        path:"/admin/dasboard",
    },
    {
        id:2,
        label:"Manage Task",
        icon: MdManageHistory ,
        path:"/admin/managetask",
    },
    {
        id:3,
        label:"Create Task",
        icon: IoMdCreate  ,
        path:"/admin/createtask",
    },
     {
        id:4,
        label:"Team Members",
        icon: IoMdPeople  ,
        path:"/admin/teammembers",
    },
    {
        id:5,
        label:"LogOut",
        icon: IoIosLogOut   ,
        path:"/admin/logout",
    },
]

export const USER_SIDE_MENU_DATA =[
    {
        id:1,
        label:"Dashboard",
        icon: MdDashboardCustomize,
        path:"/user/dasboard",
    },
    {
        id:2,
        label:"My Task",
        icon: MdManageHistory ,
        path:"/user/tasks",
    },
    {
        id:3,
        label:"LogOut",
        icon: IoIosLogOut   ,
        path:"logout",
    }
]

export const PRIORITY_DATA =[
    {
        label:"Low",
        value:"low",
    },
    {
        label:"Medium",
        value:"medium",
    },
    {
        label:"High",
        value:"high",
    },
]

export const STATUS_DATA =[
    {label:"Pending",value:"Pending"},
    {label:"In Progress",value:"In Progress"},
    {label:"Completed",value:"Completed"},
]