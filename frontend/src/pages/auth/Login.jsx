import { FaPeopleGroup } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import React, { useState } from 'react'
import AuthLayout from '../../components/AuthLayout.jsx'
import {Link} from "react-router-dom"
import { validateEmail } from "../../utils/helper.js";

const Login = () => {
  const [email,setEmail]=useState("")
  const[password ,setPassword]=useState("")
  const[showPassword,setShowPassword]=useState(false)
  const[error,setError]=useState(null)
  const handleSubmit =(e)=>{
    e.preventDefault()

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
              <h1 className="text-2xl font-bold text-gray-800 mt-4 uppercase">Task Manager</h1>
              <p className="text-gray-600 mt-1">Manage your projects efficiently</p>
            </div>
            <form onSubmit={handleSubmit} classNmae="space-y-6">
              <div>
                <label html="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent"
                placeholder="your@email.com"
                required
                />
              </div>
              <div>
                <label html="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                <input id="password" type={showPassword ? "text":"password"}value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-transparent"
                placeholder="******"
                required
                />

                <botton type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={()=>setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash />:<FaEye/>}
                </botton>{" "}
                
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm 
                text-sm font-medium text-white bg-blue-600 hover:bg-gray-500 focus:outline-none focus:ring-offset-0 cursor-pointer
                ">Login</button>
              </div>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account? 
                <Link to={"/signup"} className="font-medium text-blue-500">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login

