import React, { useState } from 'react'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation, useCreateTestSlideMutation, useUpdateSlideMutation, useUpdateTestSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import MCQ from "./util/MCQ"
import { useEffect } from 'react'
import { setLogicJump } from '../../../redux/slices/util'
import { useDispatch, useSelector } from 'react-redux'

const QullEditor = dynamic(import("react-quill"), {
    ssr: false,
})

const Temp12 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false }) => {

    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")
    const [addSlide] = useCreateSlideMutation()
    const [addTestSlide] = useCreateTestSlideMutation()

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])
    const [mark, setMark] = useState(0)

    const [updateSlide] = useUpdateSlideMutation()
    const [updateTestSlide] = useUpdateTestSlideMutation()
    const dispatch = useDispatch()



    useEffect(() => {
        if (isTest && isUpdate) {
            setMark(update?.data?.mark)
            setSubText(update?.data?.question)
        }
    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        const isAllOption = option.filter((item) => item.val === "")

        if (!subText) {
            return toast.error("Please Add Paragraph")
        } else if (isAllOption?.length !== 0) {
            return toast.error("Please Add All Option")
        }

        addSlide({ id: lessonId, data: { question: subText, type: 9, logic_jump: option, mcq_type: "radio", builderslideno: 11, order } }).unwrap().then(async (res) => {
            dispatch(setLogicJump(res.data))
            toast.success("Slide Added")
            onAddSlide({ ...res.data, slideno: 11 }, true)
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
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

    return (
        <>
            <form className="course__builder-temp1" onSubmit={!isUpdate ? onSubmitHandler : onUpdateHandler}>
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={false} setQuestion={setOption} setAnswer={setCorrectOpt} setMark={setMark} isTest={isTest} update={update} isLogicJump={true} />
                </div>
                <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
                    <h3>{isUpdate ? "Update" : "Save"}</h3>
                </motion.button>
            </form>
            <Preview type={2} data={{ question: subText, option: option.filter((item) => item.val !== ""), correct: correctOpt.filter((item) => item !== undefined)[0], isTest }} />
        </>
    )
}

export default Temp12