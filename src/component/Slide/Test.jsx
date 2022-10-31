import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { MdOutlineArrowBackIos } from "react-icons/md"
import { AiOutlinePlus } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Temp10, Temp2, Temp3, Temp4, Temp8, Temp9 } from "../Template"
import { toast, ToastContainer } from "react-toast"
import { setTestData, setUpdateSlide, updateTestSlides } from "../../../redux/slices/util"
import { useGetTestSlideMutation } from "../../../redux/slices/slide"
import { useRouter } from "next/router"

const templateType = [

    {
        id: 0,
        name: "Short Answer Only",
        slideno: 1
    },
    {
        id: 1,
        name: "SCQ Only",
        slideno: 2
    },
    {
        id: 2,
        name: "MCQ Only",
        slideno: 3
    },

    {
        id: 3,
        name: "Media + Short Answer",
        slideno: 7
    },
    {
        id: 4,
        name: "Media + SCQ",
        slideno: 8
    },
    {
        id: 5,
        name: "Media + MCQ",
        slideno: 9
    }
]
const Test = ({ title, id, no, lessonId }) => {
    const { course, test,updateSlide } = useSelector(state => state.util)
    const [showOpt, setShowOpt] = useState(false)
    const [showTemplateOpt, setShowTemplateOpt] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({ id: null, name: null })

    const [totalSlideAdded, setTotalSlideAdded] = useState([])
    const dispatch = useDispatch()
    const [getTestSlide] = useGetTestSlideMutation()
    const router=useRouter()

    useEffect(() => {
        if (test) {
            setTotalSlideAdded(test)
        }

        if (test.length === 0) {
            getTestSlide(lessonId).unwrap().then((res) => {
                setTestData(res.data)
                setTotalSlideAdded(res.data)
            }).catch((err) => {
                console.log("Error Occured", err)
            })
        }
        if (updateSlide?.is) {
            const temp = templateType.find((item) => item.slideno=== updateSlide.data.builderslideno)
            setCurrentTemplate({ id: temp.id, name:temp.name })
        }
    }, [])



    useEffect(() => {

    }, [dispatch,test])

    useEffect(() => {
        dispatch(setTestData(totalSlideAdded))
    }, [totalSlideAdded])


    const onTempSelectHandler = (id,name) => {
        setCurrentTemplate({ id, name })
        setShowTemplateOpt(false)
    }

    const onAddSlide = (data) => {
        setCurrentTemplate({id:null,name:null})
        setTotalSlideAdded(item => [...item, { ...data }])
    }

    const onSlideUpdateHandler = (id, data) => {
        dispatch(updateTestSlides({id,data}))
        dispatch(setUpdateSlide({id:null,is:false,data:null}))
        router.back()
    }


    const onPrevClick = () => {
        const lastSlide = test[test.length - 1]
        const findSlide = templateType.filter(item => item.slideno === lastSlide.slideno)[0]


        if (lastSlide) {
            setCurrentTemplate({ id: findSlide?.id, name: findSlide?.name, temp: findSlide?.comp })
        }

    }

    function renderer(id) {
        const config = {
            lessonId,
            toast,
            onAddSlide,
            order: test.length,
            isTest: true,
            update: updateSlide,
            onSlideUpdateHandler
        }

        switch (id) {
            case 0:
                return <Temp2 {...config} />
            case 1:
                return <Temp3 {...config} />
            case 2:
                return <Temp4 {...config} />
            case 3:
                return <Temp8 {...config} />
            case 4:
                return <Temp9 {...config} />
            case 5:
                return <Temp10 {...config} />
            default:
                return <Temp2 {...config} />
        }
    }


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
                                    {course.test.map((item, i) => (
                                        <Link href={`/slide/test?no=${i + 1}&title=${item?.heading}&key=${lessonId}`} key={item?.heading}>
                                            <div className="option__item">
                                                {console.log({ item })}
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
                                            <div className="option__item" key={item.id} onClick={() => onTempSelectHandler(item.id, item.name)}>
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
                    currentTemplate.name && (
                        <div className="course__builder-slide__form">
                            {renderer(currentTemplate.id)}
                        </div>
                    )
                }
            </div>
            <div className="course__builder-slide__navigation">
                <div className="main__btn">
                    {
                        test.length !== 0 && (
                            <Link href={`/slide?key=${lessonId}&type=test`}>
                                <motion.div className="all" whileTap={{scale:.97}}>
                                    <p>All Slides</p>
                                </motion.div>
                            </Link>
                        )
                    }
                </div>
                <div className="lesson__btn">
                    {
                        test?.length !== 0 && (
                            <motion.button className="previous" whileTap={{ scale: .97 }} onClick={onPrevClick} >
                                <p>Previous Slide</p>
                                <MdOutlineArrowBackIos size={20} />
                            </motion.button>
                        )
                    }
                    <motion.button className="add" whileTap={{ scale: .97 }} onClick={() => setCurrentTemplate({ id: null, name: null, temp: null })}>
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