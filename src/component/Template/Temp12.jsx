import React, { useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useCreateSlideMutation, useAddSlideInLogicMutation, useUpdateSlideMutation, useCreateTestSlideMutation, useUpdateTestSlideMutation, useAddSlideInTestLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import MCQ from "./util/MCQ"
import { useEffect } from 'react'
import { setLogicJump, setTestLogicJump, updateLogicJump, updateTestLogicJump } from '../../../redux/slices/util'
import { useDispatch, useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'


const Temp12 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isTest = false, isLogicJump }) => {

    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")
    const [addSlide] = useCreateSlideMutation()
    const [addTestSlide] = useCreateTestSlideMutation()
    const [mark, setMark] = useState(1)

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])


    const [updateSlide] = useUpdateSlideMutation()
    const [updateTestSlide] = useUpdateTestSlideMutation()

    const dispatch = useDispatch()

    const [addSlideInLogic] = useAddSlideInLogicMutation()
    const [addSlideInTestLogic] = useAddSlideInTestLogicMutation()

    const { logicJump, updateLogicSlide, testLogicJump,user } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState(null)

    useEffect(() => {

    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        const isAllOption = option.filter((item) => item.val === "")

        if (!subText) {
            return toast.error("Please Add Paragraph")
        } else if (isAllOption?.length !== 0) {
            return toast.error("Please Add All Option")
        }

        if (isLogicJump.is === "true") {
            const mainId = logicJump.find((item) => parseInt(item.logic_jump.level) === 1)
            // if (!mainId) {
            //     toast.error("One Logic Jump Exist, You can't Another")
            //     return
            // }
            addSlideInLogic({ id: isLogicJump.logicJumpId, level: { is: true, lesson: mainId._id }, logicId: [logicJumpId], data: { question: subText, type: 9, logic_jump: { arr: option }, mcq_type: "radio", builderslideno: 11, order } }).unwrap().then((res) => {
                dispatch(setLogicJump(res.slide))
                dispatch(updateLogicJump({ data: res.data, id: res.data._id }))
                onAddSlide({ ...res.slide, slideno: 11 }, true)
                isLogicJump.handler(res.data)
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
            return
        }
        
        addSlide({ id: lessonId, data: { question: subText, type: 9, logic_jump: { arr: option, level: 1 }, mcq_type: "radio", builderslideno: 11, order } }).unwrap().then(async (res) => {
            dispatch(setLogicJump(res.data))
            toast.success("Slide Added")
            onAddSlide({ ...res.data, slideno: 11 }, true)
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })


    }

    const onTestSubmitHandler = (e) => {
        e.preventDefault()
        const isAllOption = option.filter((item) => item.val === "")
        
        if (!subText) {
            return toast.error("Please Add Paragraph")
        } else if (isAllOption?.length !== 0) {
            return toast.error("Please Add All Option")
        }
        
        if (isLogicJump.is === "true") {
            const mainId = testLogicJump.find((item) => parseInt(item.logic_jump.level) === 1)
            addSlideInTestLogic({ id: isLogicJump.logicJumpId, level: { is: true, lesson: mainId._id }, logicId: [logicJumpId], data: { mark,question: subText, type: 9, logic_jump: { arr: option }, mcq_type: "radio", builderslideno: 11, order } }).unwrap().then((res) => {
                dispatch(setTestLogicJump(res.slide))
                dispatch(updateTestLogicJump({ data: res.data, id: res.data._id }))
                onAddSlide({ ...res.slide, slideno: 11 }, true)
                isLogicJump.handler(res.data)
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
            return
        }

        addTestSlide({ id: lessonId, data: { question: subText, type: 9, logic_jump: { arr: option, level: 1 }, mcq_type: "radio", builderslideno: 11, order, mark } }).unwrap().then((res) => {
            dispatch(setTestLogicJump(res.data))
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

            updateSlide({ id: updateLogicSlide.is ? updateLogicSlide.logic_jump_id : update?.id, data: { question: subText, logic_jump: { arr: option, level: update.data.logic_jump.level }, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                dispatch(updateTestLogicJump({ id: update?.id, data: res.data }))
                onSlideUpdateHandler(update?.id, res.data, true)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {

            updateTestSlide({ id: updateLogicSlide.is ? updateLogicSlide.logic_jump_id : update?.id, data: { question: subText, logic_jump: { arr: option, level: update.data.logic_jump.level }, correct_options: correctOpt.filter(item => item !== undefined) } }).unwrap().then((res) => {
                dispatch(updateTestLogicJump({ id: update?.id, data: res.data }))
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        }

    }
    const isLogicJumpArr = !isTest ? logicJump.find((item) => item._id === isLogicJump.logicJumpId) : testLogicJump.find((item) => item._id === isLogicJump.logicJumpId)

    const normalSubmit = !isUpdate ? onSubmitHandler : onUpdateHandler
    const testSubmit = !isUpdate ? onTestSubmitHandler : onUpdateHandler

    return (
        <>
            <form className="course__builder-temp1" onSubmit={!isTest ? normalSubmit : testSubmit}>
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={false} setQuestion={setOption} setAnswer={setCorrectOpt} isTest={isTest} update={update} isLogicJump={true} />
                </div>
                {
                    isLogicJump.is && (
                        <LogicJump handler={setLogicJumpId} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} multi={false} />
                    )
                }
                {isTest && (
                    <div className="item mark">
                        <p>Mark</p>
                        <input type="number" onChange={(e) => setMark(e.target.value)} defaultValue={isUpdate ? update?.data?.mark : 1} />
                    </div>

                )
                }
                <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
                    <h3>{isUpdate ? "Update" : "Save"}</h3>
                </motion.button>
            </form>
            <Preview type={11} data={{ question: subText, option: option.filter((item) => item.val !== ""), correct: correctOpt.filter((item) => item !== undefined)[0], isTest }} />
        </>
    )
}

export default Temp12