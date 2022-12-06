import React, { useEffect, useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useCreateSlideMutation, useCreateTestSlideMutation, useUpdateSlideMutation, useUpdateTestSlideMutation, useAddSlideInLogicMutation, useAddSlideInTestLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'


const Temp2 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false, isLogicJump }) => {
  const [subText, setSubText] = useState(null)
  const [idealAns, setIdealAns] = useState(update?.data?.subtext ?? null)

  const [addSlide] = useCreateSlideMutation()
  const [addTestSlide] = useCreateTestSlideMutation()
  const [updateSlide] = useUpdateSlideMutation()
  const [updateTestSlide] = useUpdateTestSlideMutation()

  const [mark, setMark] = useState(0)

  const isUpdate = update?.is

  const [addSlideInLogic] = useAddSlideInLogicMutation()
  const [addSlideInTestLogic] = useAddSlideInTestLogicMutation()

  const { logicJump, updateLogicSlide, testLogicJump } = useSelector(state => state.util)

  const [logicJumpId, setLogicJumpId] = useState([])

  console.log({updateLogicSlide,update})

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

    if (isLogicJump?.is === "true") {

      if (!isTest) {

        addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { question: subText, type: 5, builderslideno: 1, order } }).unwrap().then((res) => {
          isLogicJump.handler(res.data)
          toast.success("Slide Added")
        }).catch((err) => {
          toast.error("Error Occured")
          console.log("Err", err)
        })
      } else {
        addSlideInTestLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { question: subText, type: 5, builderslideno: 1, order, mark, model_answer: idealAns } }).unwrap().then((res) => {
          isLogicJump.handler(res.data)
          toast.success("Slide Added")
        }).catch((err) => {
          toast.error("Error Occured")
          console.log("Err", err)
        })
      }

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


    if (!isTest) {
      if (updateLogicSlide.is) {
        updateSlide({ id: updateLogicSlide.logic_jump_id, data: { question: subText } }).unwrap().then((res) => {
          isLogicJump.handler(res.data, true)
          toast.success("Slide updated")
        }).catch((err) => {
          console.log({ err })
        })

        return
      }
      updateSlide({ id: update?.id, data: { question: subText } }).unwrap().then((res) => {
        onSlideUpdateHandler(update?.id, res.data)
        toast.success("Slide updated")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    } else {
      if (updateLogicSlide.is) {
        updateTestSlide({ id: updateLogicSlide.logic_jump_id, data: { question: subText,mark,model_answer:idealAns } }).unwrap().then((res) => {
          isLogicJump.handler(res.data, true)
          toast.success("Slide updated")
        }).catch((err) => {
          console.log({ err })
        })

        return
      }
      updateTestSlide({ id: update?.id, data: { question: subText, model_answer: idealAns, mark } }).unwrap().then((res) => {
        onSlideUpdateHandler(update?.id, res.data)
        toast.success("Slide updated")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })

    }
  }

  const isLogicJumpArr = !isTest ? logicJump.find((item) => item._id === isLogicJump.logicJumpId) : testLogicJump.find((item) => item._id === isLogicJump.logicJumpId)

  const onMulSelectHandler = (data) => {
    if (logicJumpId.includes(data)) {
      setLogicJumpId(prev => prev.filter(item => item !== data))
    } else {
      setLogicJumpId(prev => [...prev, data])
    }
  }

  return (
    <>
      <form className="course__builder-temp1" onSubmit={!isUpdate ? onSubmitHandler : onUpdateHandler}>
        <div className="item quil_small">
          <p>Question/Prompt</p>
          <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update.data.question : null} />
        </div>
        {
          isTest && (
            <>
              <div className="item">
                <p>Sample Answer</p>
                <RichTextEditor handler={setIdealAns} placeholder='Enter Ideal Answer for this Question' defaultValue={isUpdate ? update.data.model_answer : null} />
              </div>
              <div className="item mark">
                <p>Mark</p>
                <input type="number" onChange={(e) => setMark(e.target.value)} defaultValue={isUpdate ? update.data.mark : 1} />
              </div>
            </>
          )
        }
        {
          isLogicJump.is && (
            <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} />
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