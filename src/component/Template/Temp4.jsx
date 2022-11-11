import React, { useState } from 'react'
import { Preview } from '../../shared'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation, useCreateTestSlideMutation,useAddSlideInLogicMutation, useUpdateSlideMutation, useUpdateTestSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import MCQ from "./util/MCQ"

const QullEditor = dynamic(import("react-quill"), {
    ssr: false,
})

const Temp4 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false,isLogicJump }) => {

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
    const { logicJump } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState(null)

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

        if (isLogicJump.is === "true") {
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
    const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

    return (
        <>
            <form className="course__builder-temp1" onSubmit={!isUpdate ? onSubmitHandler : onUpdateHandler}>
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={true} setQuestion={setOption} setAnswer={setCorrectOpt} setMark={setMark} isTest={isTest} update={update} />
                </div>
                {
                    isLogicJump.is && (
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
            <Preview type={3} data={{ question: subText, option, correct: correctOpt.filter((item) => item !== undefined), isTest }} />
        </>
    )
}

export default Temp4