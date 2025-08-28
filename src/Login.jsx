import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='h-screen bg-black'>
      <h1 className='text-white italic text-[50px] pl-[610px] pb-15 pt-25 font-bold font-[cursive]'>
        Instagram
      </h1>

      <div className='flex flex-col items-center justify-center gap-4'>
        <input className='text-white border-white' placeholder="Phone number, username, or email" />
        <input className='text-white' placeholder='Password' />
        <button className='text-white bg-blue-500 hover:bg-blue-600 cursor-pointer w-40'>Log in</button>

        <div className='flex items-center gap-2'>
          <div className='flex-grow h-px w-24 bg-white'></div>
          <p className='text-white'>OR</p>
          <div className='flex-grow h-px w-24 bg-white'></div>
        </div> 

        <div className='flex gap-2'>
          <img className='h-8 w-8' src='https://cdn-icons-png.flaticon.com/128/5968/5968764.png' alt="fb-icon" />
          <a className='text-blue-500 cursor-pointer'>Log in with Facebook</a>
        </div>

        <a href='' className='text-white pb-11'>Forget password?</a>

        <div>
          <p className='text-white'>
            Don't have an account?
            <Link to="/signup" className='text-blue-700'> SignUp</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
