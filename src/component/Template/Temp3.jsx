import React, { useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useSelector } from 'react-redux'
import { useCreateSlideMutation, useCreateTestSlideMutation, useUpdateSlideMutation, useUpdateTestSlideMutation, useAddSlideInLogicMutation, useAddSlideInTestLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import MCQ from "./util/MCQ"
import { useEffect } from 'react'
import LogicJump from './util/LogicJump'

const Temp3 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false, isLogicJump }) => {

    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")
    const [addSlide] = useCreateSlideMutation()
    const [addTestSlide] = useCreateTestSlideMutation()

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])
    const [mark, setMark] = useState(0)

    const [updateSlide] = useUpdateSlideMutation()
    const [updateTestSlide] = useUpdateTestSlideMutation()

    const [addSlideInLogic] = useAddSlideInLogicMutation()
    const [addSlideInTestLogic] = useAddSlideInTestLogicMutation()

    const { logicJump, updateLogicSlide, testLogicJump } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState([])

    useEffect(() => {
        if (isTest && isUpdate) {
            setMark(update?.data?.mark)
            setSubText(update?.data?.question)
        }
    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        const removeUndifined = correctOpt.filter((item) => item !== undefined)
        const isAllOption = option.filter((item) => item.val !== "")


        if (!subText) {
            return toast.error("Please Add Paragraph")
        } else if (isAllOption.length === 0) {
            return toast.error("Please Add All Option")
        } else if (removeUndifined.length === 0) {
            return toast.error("Please Select Correct Option")
        }

        if (isLogicJump?.is === "true") {
            if (!isTest) {

                addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { question: subText, type: 4, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio", mark, builderslideno: 2, order } }).unwrap().then((res) => {
                    isLogicJump.handler(res.data)
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })
            } else {
                addSlideInTestLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { question: subText, type: 4, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio", mark, builderslideno: 2, order,mark } }).unwrap().then((res) => {
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

            addSlide({ id: lessonId, data: { question: subText, type: 4, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio", builderslideno: 2, order } }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 2 })
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            addTestSlide({ id: lessonId, data: { question: subText, type: 4, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio", mark, builderslideno: 2, order } }).unwrap().then(res => {
                onAddSlide({ ...res.data, slideno: 2, added: true })
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
                updateSlide({ id: updateLogicSlide.logic_jump_id, data: { question: subText, options: option, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                    isLogicJump.handler(res.data, true)
                    toast.success("Slide updated")
                }).catch((err) => {
                    console.log({ err })
                })
    
                return
            }
            updateSlide({ id: update?.id, data: { question: subText, options: option, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            if (updateLogicSlide.is) {
                console.log("rjkjk")
                updateTestSlide({ id: updateLogicSlide.logic_jump_id, data: { question: subText, mark,options: option, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                    isLogicJump.handler(res.data, true)
                    toast.success("Slide updated")
                }).catch((err) => {
                    console.log({ err })
                })
    
                return
            }
            updateTestSlide({ id: update?.id, data: { question: subText, mark, options: option, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
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
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={false} setQuestion={setOption} setAnswer={setCorrectOpt} setMark={setMark} isTest={isTest} update={update} />
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
            <Preview type={2} data={{ question: subText, option: option.filter((item) => item.val !== ""), correct: correctOpt.filter((item) => item !== undefined)[0], isTest }} />
        </>
    )
}

export default Temp3