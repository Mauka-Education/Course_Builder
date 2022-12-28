import React, { useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useSelector } from 'react-redux'
import MCQ from "./util/MCQ"
import { useEffect } from 'react'
import LogicJump from './util/LogicJump'
import { useInitateSlide } from '../../../hooks'

const Temp3 = ({ lessonId, onAddSlide, order, update, isTest = false, isLogicJump, autoSaveHandler }) => {

    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])
    const [mark, setMark] = useState(0)

    const BUILDER_SLIDE_NO = 2
    const SLIDE_TYPE = 4
    const { mainId, slide } = useInitateSlide(isLogicJump?.is ? isLogicJump?.logicJumpId : lessonId, SLIDE_TYPE, BUILDER_SLIDE_NO, isUpdate, order,isTest)

    const { logicJump, testLogicJump } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState([])

    useEffect(() => {
        if (isTest && isUpdate) {
            setMark(update?.data?.mark)
            setSubText(update?.data?.question)
        }
    }, [])

    useEffect(() => {
        if (logicJumpId.length !== 0) {
            isLogicJump.handler(mainId, logicJumpId)
        }
    }, [logicJumpId])

    useEffect(() => {
        if (correctOpt.length !== 0) {
            autoSaveHandler(mainId, { correct_options: correctOpt.filter(item => item !== undefined) })
        }
    }, [correctOpt])

    useEffect(() => {
        if (mainId) {
            onAddSlide(slide)
        }
    }, [mainId])

    useEffect(() => {
        if (subText) {
            autoSaveHandler(mainId, { question: subText })
        }
    }, [subText])
    useEffect(()=>{
        if(mark){
          autoSaveHandler(mainId,{mark})
        }
      },[mark])
    // question: subText, mark, options: option, correct_options: correctOpt.filter(item => item !== undefined) 


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
        autoSaveHandler(mainId, { options: opt,mcq_type:"radio" })
    }
    return (
        <>
            <form className="course__builder-temp1" >
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={false} setQuestion={onOptAutoSave} setAnswer={setCorrectOpt} setMark={onMarkAutoSave} isTest={isTest} update={update} />
                </div>
                {
                    isLogicJump.is && (
                        <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} />
                    )
                }
            </form>
            <Preview type={2} data={{ question: subText, option: option.filter((item) => item.val !== ""), correct: correctOpt.filter((item) => item !== undefined)[0], isTest }} />
        </>
    )
}

export default Temp3