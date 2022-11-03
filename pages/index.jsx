import { Home, Login } from "../src/component"
import { useGetCoursesQuery } from "../redux/slices/course"
import { useSelector } from "react-redux"

const Index = () => {
  const {data}=useGetCoursesQuery()
  
  const {user}=useSelector(state=>state.util)

  if(!user?.data?.email || !user?.token ){
    return <Login />
  }
  
  return (
    <div className="mauka__builder">
      <Home data={data} />
    </div>
  )
}



export default Index