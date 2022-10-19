import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BsArrowLeft, BsArrowRight, BsChevronDown } from "react-icons/bs"
import { MdOutlineArrowBackIos } from "react-icons/md"
import { AiOutlinePlus } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Temp1, Temp10, Temp11, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7, Temp8, Temp9 } from "../Template"
import { toast, ToastContainer } from "react-toast"
import { setSlideData } from "../../../redux/slices/util"


const Test = ({ title, id, no, lessonId }) => {
    const { course, slide } = useSelector(state => state.util)
    const [showOpt, setShowOpt] = useState(false)
    const [showTemplateOpt, setShowTemplateOpt] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({ id: null, name: null, temp: null })

    const [totalSlideAdded, setTotalSlideAdded] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        if (slide) {
            setTotalSlideAdded(slide)
        }
    }, [])
    useEffect(() => {

    }, [dispatch])

    useEffect(() => {
        dispatch(setSlideData(totalSlideAdded))
    }, [totalSlideAdded])


    const onTempSelectHandler = (id, name, temp) => {
        setCurrentTemplate({ id: id, name: name, temp })
        setShowTemplateOpt(false)
    }
    console.log({ slide })

    const onAddSlide = (data) => {
        setTotalSlideAdded(item => [...item, { ...data }])
    }
    const templateType = [
        
        {
            id: 0,
            name: "Short Answer Only",
            slideno: 0,
            comp: <Temp2 isTest={true} lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 1,
            name: "SCQ Only",
            slideno: 0,
            comp: <Temp3 isTest={true} lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 2,
            name: "MCQ Only",
            slideno: 0,
            comp: <Temp4 isTest={true} lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        
        {
            id: 3,
            name: "Media + Short Answer",
            slideno: 0,
            comp: <Temp8 isTest={true} lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 4,
            name: "Media + SCQ",
            slideno: 0,
            comp: <Temp9 isTest={true} lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        },
        {
            id: 5,
            name: "Media + MCQ",
            slideno: 0,
            comp: <Temp10 isTest={true} lessonId={lessonId} toast={toast} onAddSlide={onAddSlide} />
        }
    ]

    const onPrevClick = () => {
        const lastSlide = slide[slide.length - 1]
        const findSlide = templateType.filter(item => item.id === lastSlide.slideno)[0]

        console.log(lastSlide, findSlide)
        if (lastSlide) {
            setCurrentTemplate({ id: findSlide?.id, name: findSlide?.name, temp: findSlide?.comp })
        }
    }


    return (
        <div className="course__builder-slide">
            <ToastContainer position="top-right" delay={3000} />
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
                                    {course.test.map((item, i) => (
                                        <Link href={`/slide/test?no=${i + 1}&title=${item?.heading}&key=${lessonId}`} key={item?.heading}>
                                            <div className="option__item">
                                            {console.log({item})}
                                                <h3 style={{ textTransform: "capitalize" }}>{id} {i + 1}: &nbsp;</h3>
                                                <h3>{item.heading}</h3>
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
                    {/* <motion.button className="prev" whileTap={{ scale: .97 }} onClick={() => dispatch(setActiveStep(activeStep - 1))} type="button">
                        <BsArrowLeft size={20} />
                        <p>Previous</p>
                    </motion.button>
                    <motion.button className="next" whileTap={{ scale: .97 }} type="submit">
                        <p>Next</p>
                        <BsArrowRight size={20} />
                    </motion.button> */}
                </div>
                <div className="lesson__btn">
                    <motion.button className="previous" whileTap={{ scale: .97 }} onClick={onPrevClick} >
                        <p>Previous Slide</p>
                        <MdOutlineArrowBackIos size={20} />
                    </motion.button>
                    <motion.button className="add" whileTap={{ scale: .97 }} >
                        <p>Add Slide</p>
                        <AiOutlinePlus size={20} />
                    </motion.button>
                    <motion.button className="done" whileTap={{ scale: .97 }} >
                        Done
                    </motion.button>
                </div>
            </div>
        </div >
    )
}




export default Test