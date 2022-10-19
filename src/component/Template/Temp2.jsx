import React, { useState } from 'react'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation, useCreateTestSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'

const QullEditor = dynamic(import("react-quill"), {
  ssr: false,
})

const Temp2 = ({ lessonId, toast, onAddSlide, isTest = false }) => {
  const [subText, setSubText] = useState(null)
  const [addSlide] = useCreateSlideMutation()
  const [addTestSlide] = useCreateTestSlideMutation()
  const [mark, setMark] = useState(0)


  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (!subText) {
      return toast.error("Please Add Paragraph")
    }
    if (!isTest) {
      addSlide({ id: lessonId, data: { question: subText, type: 5 } }).unwrap().then((res) => {
        onAddSlide({ ...res.data, slideno: 1 })
        toast.success("Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    } else {
      addTestSlide({ id: lessonId, data: { question: subText, type: 5, mark } }).unwrap().then((res) => {
        toast.success("Test Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    }
  }

  return (
    <>
      <form className="course__builder-temp1" onSubmit={onSubmitHandler}>
        <div className="item">
          <p>Question/Prompt</p>
          <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' />
        </div>
        <div className="item mark">
          <p>Mark</p>
          <input type="number" onChange={(e)=>setMark(e.target.value)} defaultValue={1} />
        </div>
        <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
          <h3>Save</h3>
        </motion.button>
      </form>
      <Preview type={1} data={{ question: subText }} />
    </>
  )
}

export default Temp2