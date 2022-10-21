import { useRouter } from "next/router"
import { useState } from "react"
import { useSelector } from "react-redux"
import {BsChevronDown} from "react-icons/bs"
import { motion,AnimatePresence } from "framer-motion"
import Link from "next/link"

const Index = () => {
    const [showOpt, setShowOpt] = useState(false)
    const {course}=useSelector(state=>state.util)
    const router=useRouter()

    const {key}=router.query

    const lesson=course.structure.find(item=>item.isSaved===key)

    if(!lesson) return null

    return (
        <div className="">
            <div className="course__builder-slide__title" onClick={() => setShowOpt(!showOpt)}>
                <div className="left">
                    <h2 style={{ textTransform: "capitalize" }}>Lesson : &nbsp;</h2>
                    <h2>{lesson?.name}</h2>
                </div>
                <BsChevronDown size={30} />
                <AnimatePresence>
                    {
                        showOpt && (
                            <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                {course.structure.map((item, i) => (
                                    <Link href={`/slide/lesson?no=${i + 1}&title=${item?.name}&key=${item.isSaved}`} key={item?.name}>
                                        <div className="option__item">
                                            <h3 style={{ textTransform: "capitalize" }}>Lesson {i + 1}: &nbsp;</h3>
                                            <h3>{item.name}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Index