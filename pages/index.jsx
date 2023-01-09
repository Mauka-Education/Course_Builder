import { Home, Login } from "../src/component"
import { useGetCoursesQuery } from "../redux/slices/course"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useRouter } from "next/router"

const Index = () => {
  const {data,refetch}=useGetCoursesQuery()
  const router=useRouter()
  
  useEffect(()=>{
    refetch()
  },[router])

  const {user}=useSelector(state=>state.util)

  if(!user?.data?.email || !user?.token ){
    return <Login />
  }
  
  return (
    <div className="mauka__builder">
      <Home data={data} refetch={refetch} />
    </div>
  )
}



export default Index