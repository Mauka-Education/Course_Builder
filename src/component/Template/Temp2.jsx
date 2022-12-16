import React, { useEffect, useState } from 'react'
import { Preview, RichTextEditor } from '../../shared'
import { useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'
import { useInitateSlide } from '../../../hooks'


const Temp2 = ({ lessonId, onAddSlide, order, update, isTest = false, isLogicJump,autoSaveHandler }) => {
  
  const [subText, setSubText] = useState(null)
  const [idealAns, setIdealAns] = useState(update?.data?.subtext ?? null)
  

  const [mark, setMark] = useState(0)

  const isUpdate = update?.is

  const BUILDER_SLIDE_NO=1
  const SLIDE_TYPE=5
  const { mainId,slide } = useInitateSlide( isLogicJump?.is ? isLogicJump?.logicJumpId : lessonId,SLIDE_TYPE,BUILDER_SLIDE_NO,isUpdate,order,isTest)

  const { logicJump, testLogicJump } = useSelector(state => state.util)

  const [logicJumpId, setLogicJumpId] = useState([])


  useEffect(() => {
    if (isTest && isUpdate) {
      setIdealAns(update?.data?.model_answer)
      setSubText(update?.data?.question)
      setMark(update?.data?.mark)
    }
  }, [])
  
  useEffect(()=>{
    if(logicJumpId.length!==0){
      isLogicJump.handler(mainId,logicJumpId)
    }
  },[logicJumpId])
  
  useEffect(() => {
    if(mainId){
      onAddSlide(slide)
    }
  }, [mainId])

  useEffect(()=>{
    if(subText){
      autoSaveHandler(mainId,{question:subText})
    }
  },[subText])
  
  useEffect(()=>{
    if(idealAns){
      autoSaveHandler(mainId,{model_answer:idealAns})
    }
  },[idealAns])
  useEffect(()=>{
    if(mark){
      autoSaveHandler(mainId,{mark})
    }
  },[mark])


  // question: subText, type: 5, builderslideno: 1, order, mark, model_answer: idealAns

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
      <form className="course__builder-temp1" >
        <div className="item quil_small">
          <p>Question/Prompt</p>
          <RichTextEditor handler={setSubText} defaultValue={isUpdate ? update.data.question : null} />
        </div>
        {
          isTest && (
            <>
              <div className="item">
                <p>Sample Answer</p>
                <RichTextEditor handler={setIdealAns} placeholder='Enter Ideal Answer for this Question' defaultValue={isUpdate ? update.data.model_answer : null} />
              </div>
              <div className="item mark">
                <p>Mark</p>
                <input type="number" onChange={(e) => setMark(e.target.value)} defaultValue={isUpdate ? update.data.mark : 1} />
              </div>
            </>
          )
        }
        {
          isLogicJump.is && (
            <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} />
          )
        }
      </form>
      <Preview type={1} data={{ question: subText }} />
    </>
  )
}

export default Temp2