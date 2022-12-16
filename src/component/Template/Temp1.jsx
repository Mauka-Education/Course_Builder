import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Preview, RichTextEditor } from '../../shared'
import { useSelector } from 'react-redux'
import LogicJump from './util/LogicJump'
import { useInitateSlide } from '../../../hooks'

const Temp1 = ({ lessonId, onAddSlide, order, update, isLogicJump,autoSaveHandler }) => {
  const [logicJumpId, setLogicJumpId] = useState([])
  const [subText, setSubText] = useState(update?.data?.subtext ?? null)

  const isUpdate = update?.is
  const BUILDER_SLIDE_NO=0
  const { mainId,slide } = useInitateSlide( isLogicJump?.is ? isLogicJump?.logicJumpId : lessonId,0,BUILDER_SLIDE_NO,isUpdate,order)

  const { register, handleSubmit, watch } = useForm({ mode: "onChange" })
  const { logicJump } = useSelector(state => state.util)

  useEffect(() => {
    if(mainId){
      onAddSlide(slide)
    }
  }, [mainId])

  useEffect(()=>{
    if(subText){
      autoSaveHandler(mainId,{subtext:subText})
    }
  },[subText])

  useEffect(()=>{
    if(logicJumpId.length!==0){
      isLogicJump.handler(mainId,logicJumpId)
    }
  },[logicJumpId])

  const onChangeHandler = (data) => {
    autoSaveHandler(mainId,{...data})
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
      <form className="course__builder-temp1"  onChange={handleSubmit(onChangeHandler)}>
        <div className="item">
          <p>Heading</p>
          <input type="text" {...register("heading", { required: true })} placeholder={"Enter your Heading"} defaultValue={update.is ? update.data.heading : null} />
        </div>
        <div className="item">
          <p>Sub Heading</p>
          <input type="text" {...register("subheading", { required: true })} placeholder={"Enter your SubHeading"} defaultValue={update.is ? update.data.subheading : null} />
        </div>
        <div className="item">
          <p>Paragraph</p>
          <RichTextEditor handler={setSubText} defaultValue={update.is ? update.data.subtext : null} />
        </div>
        {
          isLogicJump.is && (
            <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} slideId={mainId} logicJumpId={isLogicJump.logicJumpId}  />
          )
        }
      </form>
      <Preview type={0} data={{ title: watch("heading"), subheading: watch("subheading"), para: subText }} />
    </>
  )
}

export default Temp1