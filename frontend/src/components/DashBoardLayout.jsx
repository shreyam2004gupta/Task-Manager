import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashBoardLayout = ({children,activeMenu}) => {
    const {currentUser} = useSelector((state)=>state.user)
  return (
    <div>
        <Navbar activeMenu={activeMenu}/>
        {currentUser && (
            <div className="flex">
                <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className="grow mx-5">
                  {children}
                </div>
            </div>
        )}
    </div>
  
  )
}

export default DashBoardLayout
