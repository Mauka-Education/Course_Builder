import React from 'react'
import { Layout, Slide as SlideComp, Test } from '../../src/component'

const Slide = ({ id, title,no , lessonId }) => {
  
  return (
    <Layout>
      {
        id === "lesson" ? (
          <>
            <SlideComp title={title} no={no} id={id}  lessonId={lessonId} />
          </>
        ) : (
          <>
            <Test title={title} id={id}  lessonId={lessonId} />
          </>
        )
      }
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id, title, key,no } = context.query
  const itemno=no ?no : 1
  return {
    props: {
      id, title, lessonId:key,no:itemno
    }
  }
}

export default Slide