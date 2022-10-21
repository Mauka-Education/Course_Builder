import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import {  BsChevronDown } from "react-icons/bs"
import { useRouter } from "next/router"
import { MdOutlineArrowBackIos } from "react-icons/md"
import { AiOutlinePlus } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Temp1, Temp10, Temp11, Temp2, Temp3 ,Temp4, Temp5, Temp6, Temp7, Temp8, Temp9} from "../Template"
import { toast, ToastContainer } from "react-toast"
import { setSlideData } from "../../../redux/slices/util"



const Slide = ({ title, id, no,lessonId }) => {
    const { course,slide } = useSelector(state => state.util)
    const [showOpt, setShowOpt] = useState(false)
    const [showTemplateOpt, setShowTemplateOpt] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({ id: null, name: null, temp: null })

    const [totalSlideAdded, setTotalSlideAdded] = useState([])
    const dispatch=useDispatch()
    const router=useRouter()

    useEffect(()=>{
        if(slide){
            setTotalSlideAdded(slide)
        }
    },[])
    useEffect(()=>{

    },[dispatch])

    useEffect(()=>{
        dispatch(setSlideData(totalSlideAdded))
    },[totalSlideAdded])
3

    const onTempSelectHandler = (id, name, temp) => {
        setCurrentTemplate({ id: id, name: name, temp })
        setShowTemplateOpt(false)
    }
    
    const onAddSlide=(data)=>{
        setTotalSlideAdded(item=>[...item,{...data}])
    }
    
    
    const templateType = [
        {
            id: 0,
            name: "Text Only",
            slideno: 0,
            comp: <Temp1 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 1,
            name: "Short Answer Only",
            slideno: 1,
            comp: <Temp2 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 2,
            name: "SCQ Only",
            slideno: 2,
            comp: <Temp3 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 3,
            name: "MCQ Only",
            slideno: 3,
            comp: <Temp4 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 4,
            name: "Opinion Scale",
            slideno: 4,
            comp: <Temp5 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 5,
            name: "Image Slider",
            slideno: 5,
            comp: <Temp6 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 6,
            name: "Media + Heading",
            slideno: 6,
            comp: <Temp7 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 7,
            name: "Media + Short Answer",
            slideno: 7,
            comp: <Temp8 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 8,
            name: "Media + SCQ",
            slideno: 8,
            comp: <Temp9 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 9,
            name: "Media + MCQ",
            slideno: 9,
            comp: <Temp10 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 10,
            name: "Media + Text",
            slideno: 10,
            comp: <Temp11 lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        // {
        //     id: 11,
        //     name: "Media + Short Answer + Text",
        //     slideno: 0,
        //     comp: <Temp1 />
        // },
    ]

    const onPrevClick=()=>{
        const lastSlide=slide[slide.length-1]
        const findSlide=templateType.filter(item=>item.id===lastSlide.slideno)[0]

        console.log(lastSlide,findSlide)
        if(lastSlide){
            setCurrentTemplate({id: findSlide?.id,name: findSlide?.name,temp: findSlide?.comp})
        }
    }

    console.log({course})

    return (
        <div className="course__builder-slide">
            <ToastContainer position="bottom-left" delay={3000} />
            <div className="upper">
                <div className="course__builder-slide__title" onClick={() => setShowOpt(!showOpt)}>
                    <div className="left">
                        <h2 style={{ textTransform: "capitalize" }}>{id} {no}: &nbsp;</h2>
                        <h2>{title}</h2>
                    </div>
                    <BsChevronDown size={30} />
                    <AnimatePresence>
                        {
                            showOpt && (
                                <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                    {course.structure.map((item, i) => (
                                        <Link href={`/slide/lesson?no=${i + 1}&title=${item?.name}&key=${item.isSaved}`} key={item?.name}>
                                            <div className="option__item">
                                                <h3 style={{ textTransform: "capitalize" }}>{id} {i + 1}: &nbsp;</h3>
                                                <h3>{item.name}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
                </div>
                <div className="course__builder-slide__template">
                    <h3>Template</h3>
                    <div className="button" onClick={() => setShowTemplateOpt(!showTemplateOpt)}>
                        <h3>{currentTemplate.name ?? "Choose A Template"}</h3>
                        <BsChevronDown size={20} />
                    </div>
                    <AnimatePresence>
                        {
                            showTemplateOpt && (
                                <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                    {
                                        templateType.map(item => (
                                            <div className="option__item" key={item.id} onClick={() => onTempSelectHandler(item.id, item.name, item.comp)}>
                                                <p>{item.name}</p>
                                            </div>
                                        ))
                                    }
                                </motion.div>
                            )
                        }
                    </AnimatePresence>
                </div>
                {
                    currentTemplate.temp && (
                        <div className="course__builder-slide__form">
                            {currentTemplate.temp}
                        </div>
                    )
                }
            </div>

            {/* <div className="course__builder-slide__preview">

            </div> */}
            <div className="course__builder-slide__navigation">
                <div className="main__btn">
                    
                </div>
                <div className="lesson__btn">
                    <motion.button className="previous" whileTap={{ scale: .97 }} onClick={onPrevClick} >
                        <p>Previous Slide</p>
                        <MdOutlineArrowBackIos size={20} />
                    </motion.button>
                    <motion.button className="add" whileTap={{ scale: .97 }}  onClick={()=>setCurrentTemplate({id: null, name: null, temp: null})}>
                        <p>Add Slide</p>
                        <AiOutlinePlus size={20} />
                    </motion.button>
                    <motion.button className="done" whileTap={{ scale: .97 }} onClick={()=>router.push("/addcourse")}>
                        Done
                    </motion.button>
                </div>
            </div>
        </div >
    )
}




export default Slide