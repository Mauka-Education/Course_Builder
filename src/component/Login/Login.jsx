import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toast'
import { setAdmin } from '../../../redux/slices/util'
import { useDispatch } from 'react-redux'
import axios from 'axios'

const initialUser={
  email:"admin@maukaeducation.com",
  password:"Mauka@Education1234"
}

const Login = () => {
  const {register,handleSubmit}=useForm()
  const dispatch=useDispatch()


  useEffect(()=>{

  },[dispatch])
  
  const onSubmitHandler=async(data)=>{
    
    if(data.email===initialUser.email && data.password===initialUser.password ){
      dispatch(setAdmin({email:data.email,password: data.password}))
      toast.success("Admin LoggedIn")
      
    }else{
      toast.error("Wrong Email/Password")
    }
  }
  return (
    <div className="course__builder-login" >
      <ToastContainer delay={3000} position="top-right" />
      <form className="modal" onSubmit={handleSubmit(onSubmitHandler)}>
        <h2>Login to Continue</h2>

        <div className="modal__item">
          <span>Email</span>
          <input type="email"  {...register("email",{required:true})}  placeholder={"Email Address"} />
        </div>
        <div className="modal__item">
          <span>Password</span>
          <input type="text" {...register("password",{required:true})}  placeholder={"Password"} />
        </div>

        <motion.button type="submit" className="modal__submit" whileTap={{scale:.98}}>
          <h3>Save</h3>
        </motion.button>
        
      </form>

    </div>
  )
}

export default Login