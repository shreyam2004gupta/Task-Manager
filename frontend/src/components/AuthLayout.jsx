import React from 'react'
import heroImg from '../assets/hero.png'

const AuthLayout = ({ children }) => {
  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='w-full md:w-1/ overflow-y-auto'>
        <div className='min-h-full flex flex-col px-12 pt-8 pb-12'>
          <div className='flex items-center justify-center'>{children}</div>
        </div>
      </div>

      <div className='hidden md:block w-1/2'>
        <img
          src="https://images.pexels.com/photos/586104/pexels-photo-586104.jpeg"
          alt='login background'
          className='h-full w-full object-cover'
        />
      </div>
    </div>
  )
}

export default AuthLayout

