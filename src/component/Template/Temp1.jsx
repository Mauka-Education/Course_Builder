import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Preview,RichTextEditor } from '../../shared'
import { useCreateSlideMutation, useUpdateSlideMutation, useAddSlideInLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'

const Temp1 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isLogicJump }) => {
  const { register, handleSubmit, watch } = useForm({ mode: "onChange" })
  const [subText, setSubText] = useState(update?.data?.subtext ?? null)
  const { logicJump, updateLogicSlide } = useSelector(state => state.util)

  const [logicJumpId, setLogicJumpId] = useState([])

  const [addSlide] = useCreateSlideMutation()
  const [updateSlide] = useUpdateSlideMutation()
  const [addSlideInLogic] = useAddSlideInLogicMutation()
  // const [updateSlideInLogic] = useUpdateSlideInLogicMutation()

  useEffect(() => {

  }, [])

  const isUpdate = update?.is

  const onSubmitHandler = (data) => {
    if (!subText) {
      return toast.error("Please Add Paragraph")
    }


    if (isLogicJump.is === "true") {
      addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { ...data, subtext: subText, type: 0, builderslideno: 0, order } }).unwrap().then((res) => {
        isLogicJump.handler(res.data)
        toast.success("Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })

    } else {
      addSlide({ id: lessonId, data: { ...data, subtext: subText, type: 0, builderslideno: 0, order } }).unwrap().then((res) => {
        onAddSlide({ ...res.data, slideno: 0 })
        toast.success("Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    }
  }

  const onUpdateHandler = (data) => {
    if (!updateLogicSlide.is) {
      updateSlide({ id: update?.id, data: { ...data, subtext: subText } }).unwrap().then((res) => {
        onSlideUpdateHandler(update?.id, res.data)
        toast.success("Slide updated")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", { err })
      })
    } else {
      updateSlide({ id: updateLogicSlide.logic_jump_id, data: { ...data, subtext: subText } }).unwrap().then((res) => {
        isLogicJump.handler(res.data,true)
        toast.success("Slide updated")
      }).catch((err) => {
        console.log({ err })
      })
    }
  }

  
  const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

  const onMulSelectHandler=(data)=>{
    if(logicJumpId.includes(data)){
      setLogicJumpId(prev=>prev.filter(item=>item!==data))
    }else{
      setLogicJumpId(prev=>[...prev,data])
    }
  }

  return (
    <>
      <form className="course__builder-temp1" onSubmit={handleSubmit(!isUpdate ? onSubmitHandler : onUpdateHandler)}>
        <div className="item">
          <p>Heading</p>
          <input type="text" {...register("heading", { required: true })} placeholder={"Enter your Heading"} defaultValue={update.is ? update.data.heading : null} />
        </div>
        <div className="item">
          <p>Sub Heading</p>
          <input type="text" {...register("subheading", { required: true })} placeholder={"Enter your SubHeading"} defaultValue={update.is ? update.data.subheading : null} />
        </div>
        <div className="item">
          <p>Paragraph</p>
          <RichTextEditor handler={setSubText}  defaultValue={update.is ? update.data.subtext : null} />
        </div>

        {
          isLogicJump.is && (
            <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} />            
          )
        }

        <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
          <h3>{isUpdate ? "Update" : "Save"}</h3>
        </motion.button>
      </form>
      <Preview type={0} data={{ title: watch("heading"), subheading: watch("subheading"), para: subText }} />
    </>
  )
}

export default Temp1