import React, { useEffect, useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useSelector } from 'react-redux'
import MCQ from "./util/MCQ"
import LogicJump from './util/LogicJump'
import { useInitateSlide } from '../../../hooks'

const Temp4 = ({ lessonId, onAddSlide, order, update, isTest = false, isLogicJump, autoSaveHandler }) => {

    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")

    const [mark, setMark] = useState(0)

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])


    const { logicJump, testLogicJump } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState([])

    const BUILDER_SLIDE_NO = 3
    const SLIDE_TYPE = 4
    const { mainId, slide } = useInitateSlide(isLogicJump?.is ? isLogicJump?.logicJumpId : lessonId, SLIDE_TYPE, BUILDER_SLIDE_NO, isUpdate, order,isTest)

    useEffect(() => {
        if (correctOpt.length !== 0) {
            autoSaveHandler(mainId, { correct_options: correctOpt.filter(item => item !== undefined) })
        }
    }, [correctOpt])

    useEffect(() => {
        if (logicJumpId.length !== 0) {
            isLogicJump.handler(mainId, logicJumpId)
        }
    }, [logicJumpId])

    useEffect(() => {
        if (mainId) {
            onAddSlide(slide)
        }
    }, [mainId])

    useEffect(() => {
        if (subText) {
            autoSaveHandler(mainId, { question: subText, mcq_type: "checkbox" })
        }
    }, [subText])

    useEffect(()=>{
        if(mark){
          autoSaveHandler(mainId,{mark})
        }
      },[mark])

    const isLogicJumpArr = !isTest ? logicJump.find((item) => item._id === isLogicJump.logicJumpId) : testLogicJump.find((item) => item._id === isLogicJump.logicJumpId)
    const onMulSelectHandler = (data) => {
        if (logicJumpId.includes(data)) {
            setLogicJumpId(prev => prev.filter(item => item !== data))
        } else {
            setLogicJumpId(prev => [...prev, data])
        }
    }

    const onMarkAutoSave = (mark) => {
        setMark(mark)
        autoSaveHandler(mainId, { mark })
    }

    const onOptAutoSave = (opt) => {
        setOption(opt)
        autoSaveHandler(mainId, { options: opt })
    }
    return (
        <>
            <form className="course__builder-temp1" >
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={true} setQuestion={onOptAutoSave} setAnswer={setCorrectOpt} setMark={onMarkAutoSave} isTest={isTest} update={update} />
                </div>
                {
                    isLogicJump.is && (
                        <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} />
                    )
                }
            </form>
            <Preview type={3} data={{ question: subText, option, correct: correctOpt.filter((item) => item !== undefined), isTest }} />
        </>
    )
}

export default Temp4