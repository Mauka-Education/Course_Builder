import React from 'react'
import { Layout, Slide as SlideComp, Test } from '../../src/component'

const Slide = ({ id, title, no, lessonId }) => {
  
  return (
    <Layout>
      {
        id === "lesson" ? (
          <>
            <SlideComp title={title} id={id} no={no} lessonId={lessonId} />
          </>
        ) : (
          <>
            <Test title={title} id={id} no={no} lessonId={key} />
          </>
        )
      }
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id, title, no, key } = context.query

  return {
    props: {
      id, title, no, lessonId:key
    }
  }
}

export default Slide