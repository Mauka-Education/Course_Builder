import React, { useEffect, useState } from 'react'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation, useCreateTestSlideMutation, useUpdateSlideMutation, useUpdateTestSlideMutation,useAddSlideInLogicMutation, useUpdateSlideInLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

const QullEditor = dynamic(import("react-quill"), {
  ssr: false,
})

const Temp2 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false,isLogicJump }) => {
  const [subText, setSubText] = useState(null)
  const [idealAns, setIdealAns] = useState( update?.data?.subtext ?? null)

  const [addSlide] = useCreateSlideMutation()
  const [addTestSlide] = useCreateTestSlideMutation()
  const [updateSlide] = useUpdateSlideMutation()
  const [updateTestSlide] = useUpdateTestSlideMutation()

  const [mark, setMark] = useState(0)

  const isUpdate = update?.is

  const [addSlideInLogic] = useAddSlideInLogicMutation()
  const { logicJump,updateLogicSlide } = useSelector(state => state.util)

  const [logicJumpId, setLogicJumpId] = useState(null)
  const [updateSlideInLogic] = useUpdateSlideInLogicMutation()

  useEffect(() => {
    if (isTest && isUpdate) {
      setIdealAns(update?.data?.model_answer)
      setSubText(update?.data?.question)
      setMark(update?.data?.mark)
    }
  }, [])


  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (!subText) {
      return toast.error("Please Add Paragraph")
    }

    if(isLogicJump?.is==="true"){
      addSlideInLogic({ id: isLogicJump.logicJumpId,logicId: logicJumpId, data: { question: subText, type: 5, builderslideno: 1, order } }).unwrap().then((res) => {
        isLogicJump.handler(res.data)
        toast.success("Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })

      return
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

  const onUpdateHandler = (e) => {
    e.preventDefault()

    if(updateLogicSlide.is){
      updateSlideInLogic({ id: updateLogicSlide.id, data: { question: subText }, logic_jump_id: updateLogicSlide.logic_jump_id, arrno: updateLogicSlide.arrno }).unwrap().then((res) => {
        isLogicJump.handler(res.data,true)
        toast.success("Slide updated")
      }).catch((err) => {
        console.log({ err })
      })

      return
    }

    if (!isTest) {
      updateSlide({ id: update?.id, data: { question: subText } }).unwrap().then((res) => {
        onSlideUpdateHandler(update?.id, res.data)
        toast.success("Slide updated")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    } else {
      updateTestSlide({ id: update?.id, data: { question: subText, model_answer: idealAns, mark } }).unwrap().then((res) => {
        onSlideUpdateHandler(update?.id, res.data)
        toast.success("Slide updated")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })

    }
  }

  const isLogicJumpArr = !isTest && logicJump.find((item) => item._id === isLogicJump.logicJumpId)

  return (
    <>
      <form className="course__builder-temp1" onSubmit={!isUpdate ? onSubmitHandler : onUpdateHandler}>
        <div className="item quil_small">
          <p>Question/Prompt</p>
          <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' defaultValue={isUpdate ? update.data.question : null} />
        </div>
        {
          isTest && (
            <>
              <div className="item">
                <p>Sample Answer</p>
                <QullEditor onChange={(data) => setIdealAns(data)} theme="snow" placeholder='Enter Ideal Answer for this Question' defaultValue={isUpdate ? update.data.model_answer : null} />
              </div>
              <div className="item mark">
                <p>Mark</p>
                <input type="number" onChange={(e) => setMark(e.target.value)} defaultValue={isUpdate ? update.data.mark : 1} />
              </div>
            </>
          )
        }
        {
          isLogicJump?.is && (
            <div className="item logic_jump">
              <p>Select where to add this slide in Logic Jump Option </p>
              <div className="logic_jump-option">
                {isLogicJumpArr?.logic_jump.arr.map((item) => (
                  <h3 key={item._id} onClick={() => setLogicJumpId(item._id)} className={item._id === logicJumpId ? "corr" : ""} >{item.val}</h3>
                ))}
              </div>
            </div>
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