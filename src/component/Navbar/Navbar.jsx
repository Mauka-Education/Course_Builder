import React from 'react'
import { motion } from 'framer-motion'
import { clearCourse } from '../../../redux/slices/util'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Navbar = () => {
  const router=useRouter()
  const dispatch=useDispatch()
  const onCompleteHandler=()=>{
    dispatch(clearCourse())
    router.push("/")
  }
  const navItem=[
    {
      id:0,
      name:"Home",
      link:"/"
    },
    {
      id:1,
      name:"Course Structure",
      link:"/addcourse"
    },
  ]
  return (
    <div className="mauka__builder-nav">
        
        <div className="nav">
          {
            navItem.map(item=>(
              <Link href={item.link} >
              <div className="nav__item" key={item.name}>
                <h3>{item.name}</h3>
              </div>
              </Link>
            ))
          }
        </div>
        <motion.div className="complete" whileTap={{scale:.97}} onClick={onCompleteHandler}>
          <h3>Complete Course</h3>
        </motion.div>
    </div>
  )
}

export default Navbar