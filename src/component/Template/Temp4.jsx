import React, { useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useSelector } from 'react-redux'
import { useCreateSlideMutation, useCreateTestSlideMutation, useAddSlideInLogicMutation, useUpdateSlideMutation, useUpdateTestSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import MCQ from "./util/MCQ"
import LogicJump from './util/LogicJump'

const Temp4 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false, isLogicJump }) => {

    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")

    const [addSlide] = useCreateSlideMutation()
    const [addTestSlide] = useCreateTestSlideMutation()
    const [mark, setMark] = useState(0)

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])

    const [updateSlide] = useUpdateSlideMutation()
    const [updateTestSlide] = useUpdateTestSlideMutation()

    const [addSlideInLogic] = useAddSlideInLogicMutation()
    const { logicJump, updateLogicSlide } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState([])

    const onSubmitHandler = (e) => {
        e.preventDefault()

        const removeUndifined = correctOpt.filter((item) => item !== undefined)
        const isAllOption = option.filter((item) => item.val === "")

        if (!subText) {
            return toast.error("Please Add Paragraph")
        } else if (isAllOption?.length !== 0) {
            return toast.error("Please Add All Option")
        } else if (removeUndifined?.length === 0) {
            return toast.error("Please Select Correct Option")
        }

        if (isLogicJump?.is === "true") {
            addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { question: subText, type: 4, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio", mark, builderslideno: 3, order } }).unwrap().then((res) => {
                isLogicJump.handler(res.data)
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
            return
        }

        if (!isTest) {

            addSlide({ id: lessonId, data: { question: subText, type: 4, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "checkbox", builderslideno: 3, order } }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 3 })
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            addTestSlide({ id: lessonId, data: { question: subText, type: 4, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio", mark, builderslideno: 3, order } }).unwrap().then(res => {
                onAddSlide({ ...res.data, slideno: 3, added: true })
                toast.success("Test Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        }
    }


    const onUpdateHandler = (e) => {
        e.preventDefault()

        if (updateLogicSlide.is) {
            updateSlide({ id: updateLogicSlide.logic_jump_id, data: { question: subText, options: option, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                isLogicJump.handler(res.data, true)
                toast.success("Slide updated")
            }).catch((err) => {
                console.log({ err })
            })

            return
        }

        if (!isTest) {
            updateSlide({ id: update?.id, data: { question: subText, options: option, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            updateTestSlide({ id: update?.id, data: { question: subText, mark, options: option, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        }
    }
    const isLogicJumpArr = !isTest && logicJump.find((item) => item._id === isLogicJump?.logicJumpId)
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
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={true} setQuestion={setOption} setAnswer={setCorrectOpt} setMark={setMark} isTest={isTest} update={update} />
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
            <Preview type={3} data={{ question: subText, option, correct: correctOpt.filter((item) => item !== undefined), isTest }} />
        </>
    )
}

export default Temp4