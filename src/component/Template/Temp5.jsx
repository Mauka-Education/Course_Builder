import React, { useEffect, useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'
import { useInitateSlide } from '../../../hooks'


const Temp5 = ({ lessonId, onAddSlide, order, update, isLogicJump, autoSaveHandler }) => {
    const { register, handleSubmit, watch } = useForm({ mode: "onChange" })


    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")

    const { logicJump } = useSelector(state => state.util)


    const BUILDER_SLIDE_NO = 4
    const SLIDE_TYPE = 7
    const { mainId, slide } = useInitateSlide(isLogicJump?.is ? isLogicJump?.logicJumpId : lessonId, SLIDE_TYPE, BUILDER_SLIDE_NO, isUpdate, order)

    const [logicJumpId, setLogicJumpId] = useState([])

    useEffect(() => {
        if (mainId) {
            onAddSlide(slide)
        }
    }, [mainId])

    useEffect(() => {
        if (subText) {
            autoSaveHandler(mainId, { heading: subText })
        }
    }, [subText])

    useEffect(() => {
        if (logicJumpId.length !== 0) {
            isLogicJump.handler(mainId, logicJumpId)
        }
    }, [logicJumpId])

    const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

    const onMulSelectHandler = (data) => {
        if (logicJumpId.includes(data)) {
            setLogicJumpId(prev => prev.filter(item => item !== data))
        } else {
            setLogicJumpId(prev => [...prev, data])
        }
    }

    const onChangeHandler = (data) => {
        autoSaveHandler(mainId, { ...data })
    }
    return (
        <>
            <form className="course__builder-temp1" onChange={handleSubmit(onChangeHandler)}>
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
            </form>
            <Preview type={4} data={{ title: subText, lowLabel: watch("lowLabel"), highLabel: watch("highLabel") }} />
        </>
    )
}

export default Temp5