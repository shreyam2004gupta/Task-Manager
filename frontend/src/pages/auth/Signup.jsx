import { FaPeopleGroup } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import React, { useState } from 'react';
import AuthLayout from '../../components/AuthLayout.jsx'
import {Link} from "react-router-dom"
import { validateEmail } from "../../utils/helper.js";
import ProfilePhotoSelector from "../../components/ProfilePhotoSelector.jsx";

const Signup = () => {
  const [email,setEmail]=useState("")
  const[fullName, setFullName]=useState("")
  const[password ,setPassword]=useState("")
  const[showPassword,setShowPassword]=useState(false)
  const[error,setError]=useState(null)
  const [profilePic,setProfilePic]= useState(null)
  const [adminInviteToken,setAdminInviteToken]=useState("")
  const [showAdminInviteToken,setShowAdminInviteToken]=useState(false)
  const handleSubmit =(e)=>{
    e.preventDefault()
     if(!fullName){
      setError("Enter full name")
      return
     }
    if(!validateEmail(email)){
      setError("Enter a valid email address")
      return
    }
    if(!password){
      setError("Enter Password")
      return
    }
    setError(null)

  }
  return (
    <AuthLayout>
      <div className='w-full max-w-md'>
        <div className='bg-white round-xl shadow-2xl overflow-hidden'>
          <div className='h-2 bg-linear-to-r from-blue-600 to-blue-400'></div>
          <div className='p-8'>
            <div className='text-center mb-8'>
              <div className='flex justify-center'>
                <div className='bg-blue-100 p-3 rounded-full'>
                  <FaPeopleGroup className="text-4xl text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mt-4 uppercase">Joint Project Flow</h1>
              <p className="text-gray-600 mt-1">Start managing your project</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
               <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input id="text" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent"
                placeholder="Full Name"
                required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent"
                placeholder="your@email.com"
                required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent"
                placeholder="******"
                required
                />

                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                
                </div>
              </div>
               <div>
                <label  className="block text-sm font-medium text-gray-700 mb-1">Admin Invite Token</label>
                <div className="relative">
                <input id="adminInviteToken" type={showAdminInviteToken ? "text" : "password"} value={adminInviteToken} onChange={(e) => setAdminInviteToken(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent"
                placeholder="******"
                required
                />

                <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowAdminInviteToken(!showAdminInviteToken)}>
                  {showAdminInviteToken ? <FaEyeSlash /> : <FaEye />}
                </button>
                
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm 
                text-sm font-medium text-white bg-blue-600 hover:bg-gray-500 focus:outline-none focus:ring-offset-0 cursor-pointer uppercase
                ">Sign up</button>
              </div>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
               Already have an account? 
                <Link to={"/login"} className="font-medium text-blue-500">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Signup