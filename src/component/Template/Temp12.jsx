import React, { useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import MCQ from "./util/MCQ"
import { useEffect } from 'react'
import { setLogicJump, setTestLogicJump } from '../../../redux/slices/util'
import { useDispatch, useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'
import { useInitateSlide } from '../../../hooks'


const Temp12 = ({ lessonId, onAddSlide, order, update, isTest = false, isLogicJump, autoSaveHandler }) => {

    const isUpdate = update?.is
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")
    const [mark, setMark] = useState(1)

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])


    const dispatch = useDispatch()


    const { logicJump, testLogicJump } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState(null)

    const BUILDER_SLIDE_NO = 11
    const SLIDE_TYPE = 9
    const { mainId, slide } = useInitateSlide(isLogicJump?.is ? isLogicJump?.logicJumpId : lessonId, SLIDE_TYPE, BUILDER_SLIDE_NO, isUpdate, order,isTest)

    useEffect(() => {
        if (mainId) {
            onAddSlide(slide)
            if(!isTest){
                dispatch(setLogicJump(slide))
            }else{
                dispatch(setTestLogicJump(slide))
            }
        }
    }, [mainId])

    useEffect(() => {
        if (logicJumpId) {
            isLogicJump.handler(mainId, [logicJumpId])
        }
    }, [logicJumpId])


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

    const isLogicJumpArr = !isTest ? logicJump.find((item) => item._id === isLogicJump.logicJumpId) : testLogicJump.find((item) => item._id === isLogicJump.logicJumpId)

    const onOptAutoSave = (opt) => {
        setOption(opt)
        autoSaveHandler(mainId, { logic_jump: { arr: opt, level: 1 } }, false, true)
    }

    return (
        <>
            <form className="course__builder-temp1">
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update?.data?.question : null} />
                </div>
                <div className="item">
                    <MCQ isMulti={false} setQuestion={onOptAutoSave} setAnswer={setCorrectOpt} isTest={isTest} update={update} isLogicJump={true} />
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
            </form>
            <Preview type={11} data={{ question: subText, option: option.filter((item) => item.val !== ""), correct: correctOpt.filter((item) => item !== undefined)[0], isTest }} />
        </>
    )
}

export default Temp12