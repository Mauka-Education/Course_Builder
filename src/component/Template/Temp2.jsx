import React, { useEffect, useState } from 'react'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation, useCreateTestSlideMutation, useUpdateSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'

const QullEditor = dynamic(import("react-quill"), {
  ssr: false,
})

const Temp2 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false }) => {
  const [subText, setSubText] = useState(null)
  const [idealAns, setIdealAns] = useState(null)

  const [addSlide] = useCreateSlideMutation()
  const [addTestSlide] = useCreateTestSlideMutation()

  const [mark, setMark] = useState(0)

  const [updateSlide] = useUpdateSlideMutation()
  const isUpdate = update?.is

  useEffect(() => {

  }, [])


  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (!subText) {
      return toast.error("Please Add Paragraph")
    }
    if (!isTest) {
      addSlide({ id: lessonId, data: { question: subText, type: 5, builderslideno: 1, order } }).unwrap().then((res) => {
        onAddSlide({ ...res.data, slideno: 1 })
        toast.success("Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    } else {
      addTestSlide({ id: lessonId, data: { question: subText, type: 5, mark, model_answer: idealAns, builderslideno: 1, order } }).unwrap().then((res) => {
        onAddSlide({ ...res.data, slideno: 1, added: true })
        toast.success("Test Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    }
  }

  const onUpdateHandler = () => {
    updateSlide({ id: update?.id, data: { question: subText } }).unwrap().then((res) => {
      onSlideUpdateHandler(update?.id, res.data)
      toast.success("Slide updated")
    }).catch((err) => {
      toast.error("Error Occured")
      console.log("Err", err)
    })
  }


  return (
    <>
      <form className="course__builder-temp1" onSubmit={!isUpdate ? onSubmitHandler : onUpdateHandler}>
        <div className="item quil_small">
          <p>Question/Prompt</p>
          <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' defaultValue={update.is ? update.data.question : null} />
        </div>
        {
          isTest && (
            <>
              <div className="item">
                <p>Sample Answer</p>
                <QullEditor onChange={(data) => setIdealAns(data)} theme="snow" placeholder='Enter Ideal Answer for this Question' />
              </div>
              <div className="item mark">
                <p>Mark</p>
                <input type="number" onChange={(e) => setMark(e.target.value)} defaultValue={1} />
              </div>
            </>
          )
        }
        <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
          <h3>{isUpdate ? "Update" : "Save"}</h3>
        </motion.button>
      </form>
      <Preview type={1} data={{ question: subText }} />
    </>
  )
}

export default Temp2