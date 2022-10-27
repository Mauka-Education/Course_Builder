import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'

const QullEditor = dynamic(import("react-quill"), {
  ssr: false,
})

const Temp1 = ({ lessonId,toast,onAddSlide,order }) => {
  const { register, handleSubmit, watch } = useForm({ mode: "onChange" })
  const [subText, setSubText] = useState(null)
  const [addSlide] = useCreateSlideMutation()
  

  const onSubmitHandler = (data) => {
    if(!subText){
      return toast.error("Please Add Paragraph")
    }
    addSlide({ id: lessonId, data: { ...data, subtext: subText, type: 0,builderslideno:0,order } }).unwrap().then((res) => {
      onAddSlide({...res.data,slideno: 0})
      
      toast.success("Slide Added")
    }).catch((err) => {
      toast.error("Error Occured")
      console.log("Err", err)
    })
    
  } 
  
  

  return (
    <>
      <form className="course__builder-temp1" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="item">
          <p>Heading</p>
          <input type="text" {...register("heading", { required: true })} placeholder={"Enter your Heading"} />
        </div>
        <div className="item">
          <p>Sub Heading</p>
          <input type="text" {...register("subheading", { required: true })} placeholder={"Enter your SubHeading"} />
        </div>
        <div className="item">
          <p>Paragraph</p>
          <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Paragraph' />
        </div>
        <motion.button className="save__btn" type='submit' whileTap={{scale:.97}}>
          <h3>Save</h3>
        </motion.button>
      </form>
      <Preview type={0} data={{ title: watch("heading"), subheading: watch("subheading"), para: subText }} />
    </>
  )
}

export default Temp1