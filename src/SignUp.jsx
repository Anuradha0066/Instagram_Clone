import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div>
      <form className='h-screen bg-black flex flex-col items-center  '>
<fieldset className="text-white border-1 border-gray-500 h-[49rem] w-96 mt-8 flex flex-col items-center gap-4  ">
 
 <h1 className='text-white italic text-[50px]  font-bold font-[cursive]'>
        Instagram
      </h1>
      <p className='text-white text-[20px] font-[cursive]'>Sign up to see photos and videos from your friends.</p>
      <button className='bg-blue-500 text-white font-bold w-80 h-10 rounded-lg cursor-pointer'>Log in with Facebook</button>
      <div className='flex items-center w-80 gap-2'>
      <hr className='w-32 border-gray-500'/>
      <p className='text-white text-[14px] font-[cursive]'>OR</p>
      <hr className='w-32 border-gray-500'/>    
</div>
      <input className='bg-gray-800 text-white w-80 h-10 rounded-lg pl-2' type="text" placeholder='Mobile Number or Email'/>
      <input className='bg-gray-800 text-white w-80 h-10 rounded-lg pl-2' type="text" placeholder='Full Name'/>
      <input className='bg-gray-800 text-white w-80 h-10 rounded-lg pl-2' type="text" placeholder='Username'/>
      <input className='bg-gray-800 text-white w-80 h-10 rounded-lg pl-2' type="password" placeholder='Password'/>
      <p className='text-white text-[12px] w-80 text-center'> People who use our service may have uploaded your contact information to Instagram. <span className='text-blue-500'>Learn More</span></p>
      <p className='text-white text-[12px] w-80 text-center'> By signing up, you agree to our <span className='text-blue-500 cursor-pointer'>Terms</span>, <span className='text-blue-500 cursor-pointer'>Privacy Policy</span> and <span className='text-blue-500 cursor-pointer'>Cookies Policy</span>.</p>
      <button className='bg-blue-500 text-white font-bold w-80 h-10 rounded-lg cursor-pointer'>Sign Up</button>    

        </fieldset >

        <fieldset className='text-white border-1 border-gray-500 h-20 w-96 mt-3 mb-2 flex items-center justify-center gap-2 '>
          <p className='text-white text-[14px]'>Have an account?</p>
          <Link to='/login'>
          <button className='text-blue-500 font-bold cursor-pointer'>Log in</button></Link>
          </fieldset>
      </form> 
    </div>
  )
}

export default SignUp
