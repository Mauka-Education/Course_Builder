import React, { useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useCreateSlideMutation, useUpdateSlideMutation, useAddSlideInLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'


const Temp5 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler, isLogicJump }) => {
    const { register, handleSubmit, watch } = useForm({ mode: "onChange" })


    const isUpdate = update?.is
    const [addSlide] = useCreateSlideMutation()
    const [updateSlide] = useUpdateSlideMutation()
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")

    const [addSlideInLogic] = useAddSlideInLogicMutation()
    const { logicJump, updateLogicSlide } = useSelector(state => state.util)

    // const [updateSlideInLogic] = useUpdateSlideInLogicMutation()

    const [logicJumpId, setLogicJumpId] = useState([])

    const onSubmitHandler = (data) => {

        if (!subText) {
            return toast.error("Please Add Paragraph")
        }

        if (isLogicJump.is === "true") {
            addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { heading: subText, type: 7, ...data, builderslideno: 4, order } }).unwrap().then((res) => {
                isLogicJump.handler(res.data)
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
            return
        }

        addSlide({ id: lessonId, data: { heading: subText, type: 7, ...data, builderslideno: 4, order } }).unwrap().then((res) => {
            onAddSlide({ ...res.data, slideno: 4 })
            toast.success("Slide Added")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }

    const onUpdateHandler = (data) => {
        if (updateLogicSlide.is) {
            updateSlide({ id: updateLogicSlide.logic_jump_id, data: { ...data, heading: subText } }).unwrap().then((res) => {
                isLogicJump.handler(res.data, true)
                toast.success("Slide updated")
            }).catch((err) => {
                console.log({ err })
            })

            return
        }

        updateSlide({ id: update?.id, data: { ...data, heading: subText } }).unwrap().then((res) => {
            onSlideUpdateHandler(update?.id, res.data)
            toast.success("Slide updated")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }

    const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

    const onMulSelectHandler = (data) => {
        if (logicJumpId.includes(data)) {
            setLogicJumpId(prev => prev.filter(item => item !== data))
        } else {
            setLogicJumpId(prev => [...prev, data])
        }
    }
    return (
        <>
            <form className="course__builder-temp1" onSubmit={handleSubmit(!isUpdate ? onSubmitHandler : onUpdateHandler)}>
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update?.data?.heading : null} />
                </div>
                <div className="multi">
                    <div className="item">
                        <p>Lower Limit Text</p>
                        <input type="text" {...register("lowLabel", { required: true })} placeholder={"Enter Lower Limit Text"} defaultValue={isUpdate ? update?.data?.lowLabel : null} />
                    </div>
                    <div className="item">
                        <p>Upper Limit Text</p>
                        <input type="text" {...register("highLabel", { required: true })} placeholder={"Enter Upper Limit Text"} defaultValue={isUpdate ? update?.data?.highLabel : null} />
                    </div>
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
            <Preview type={4} data={{ title: subText, lowLabel: watch("lowLabel"), highLabel: watch("highLabel") }} />
        </>
    )
}

export default Temp5
