import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toast'
import { setAdmin } from '../../../redux/slices/util'
import { useDispatch } from 'react-redux'
import axios from 'axios'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()

  useEffect(() => {

  }, [dispatch])

  const onSubmitHandler = async (data) => {
    axios.post(process.env.NODE_ENV === "development" ? "http://localhost:3000/api/admin/login" : "https://lms.maukaeducation.com/api/admin/login", { email: data.email, password: data.password }).then((res) => {
      console.log({ res })
      toast.success("Admin LoggedIn")
      dispatch(setAdmin({ ...res.data }))
    }).catch((err) => {
      console.log({ err })
      toast.error("Sign in Failed")
    })
  }
  return (
    <div className="course__builder-login" >
      <ToastContainer delay={3000} position="top-right" />
      <form className="modal" onSubmit={handleSubmit(onSubmitHandler)}>
        <h2>Login to Continue</h2>

        <div className="modal__item">
          <span>Email</span>
          <input type="email"  {...register("email", { required: true })} placeholder={"Email Address"} />
        </div>
        <div className="modal__item">
          <span>Password</span>
          <input type="password" {...register("password", { required: true })} placeholder={"Password"} />
        </div>

        <motion.button type="submit" className="modal__submit" whileTap={{ scale: .98 }}>
          <h3>Save</h3>
        </motion.button>

      </form>

    </div>
  )
}

export default Login