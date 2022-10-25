import {AllSlide} from "../../src/component"

const Index = ({id,type}) => {
  return (
    <AllSlide id={id} type={type} />
  )
}

export async function getServerSideProps(context){
  const {key,type}=context.query 

  return {
    props:{
      id:key,
      type
    }
  }
}

export default Index