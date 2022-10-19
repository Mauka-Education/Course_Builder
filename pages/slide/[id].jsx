import { useRouter } from 'next/router'
import React from 'react'
import { Slide as SlideComp,Test } from '../../src/component'

const Slide = () => {
  const router=useRouter()
  const {id,title,no,key}=router.query
  return  (
    <>
    {
      id==="lesson" ? (
        <SlideComp title={title} id={id} no={no} lessonId={key} />
      ):(
        <Test title={title} id={id} no={no} lessonId={key} />
      )
    }
    </>
  )
}

export default Slide