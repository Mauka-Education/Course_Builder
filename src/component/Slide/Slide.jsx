import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { useRouter } from "next/router"
import { MdOutlineArrowBackIos } from "react-icons/md"
import { AiOutlinePlus } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Temp1, Temp10, Temp11, Temp12, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7, Temp8, Temp9 } from "../Template"
import { toast, ToastContainer } from "react-toast"
import { setLogicJump, setSlideData, setUpdateLogicSlide, setUpdateSlide, updateSlides, clearLogicJump, updateLogicJump } from "../../../redux/slices/util"
import { useGetLogicJumpSlideMutation, useGetSlideMutation } from "../../../redux/slices/slide"

const templateType = [
    {
        id: 0,
        name: "Text Only",
        slideno: 0,

    },
    {
        id: 1,
        name: "Short Answer Only",
        slideno: 1,

    },
    {
        id: 2,
        name: "SCQ Only",
        slideno: 2
    },
    {
        id: 3,
        name: "MCQ Only",
        slideno: 3
    },
    {
        id: 4,
        name: "Opinion Scale",
        slideno: 4
    },
    {
        id: 5,
        name: "Image Slider",
        slideno: 5
    },
    {
        id: 6,
        name: "Media + Heading",
        slideno: 6
    },
    {
        id: 7,
        name: "Media + Short Answer",
        slideno: 7
    },
    {
        id: 8,
        name: "Media + SCQ",
        slideno: 8
    },
    {
        id: 9,
        name: "Media + MCQ",
        slideno: 9
    },
    {
        id: 10,
        name: "Media + Text",
        slideno: 10
    },
    {
        id: 11,
        name: "Logic Jump",
        slideno: 11,
        // comp: <Temp12 />
    },
]

const Slide = ({ title, id, no, lessonId }) => {
    const { course, slide, updateSlide, logicJump, updateLogicSlide } = useSelector(state => state.util)
    const [showOpt, setShowOpt] = useState(false)
    const [showTemplateOpt, setShowTemplateOpt] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({ id: null, name: null })

    const [showLogicOpt, setShowLogicOpt] = useState(false)
    const [currentLogicJump, setCurrentLogicJump] = useState({ id: null, name: null })

    const [totalSlideAdded, setTotalSlideAdded] = useState([])
    const dispatch = useDispatch()
    const router = useRouter()

    const [getSlides] = useGetSlideMutation()
    const { isLogicJump, logicJumpId } = router.query

    const [logicJumpArr, setLogicJumpArr] = useState([])

    const [getLogicJumpSlide] = useGetLogicJumpSlideMutation()


    useEffect(() => {
        if (slide.length !== 0) {
            setTotalSlideAdded(slide)
        }

        if (updateSlide?.is) {
            const name = templateType.find((item) => item.id === updateSlide.data.builderslideno).name
            setCurrentTemplate({ id: updateSlide.data.builderslideno, name })
        }
        if (logicJump.length !== 0) {
            setLogicJumpArr(logicJump)
            setCurrentLogicJump({ id: logicJump[0]._id, name: "Select Logic Jump" })
        }

        if (updateLogicSlide.is) {
            const name = templateType.find((item) => item.id === updateLogicSlide.data.builderslideno).name
            setCurrentTemplate({ id: updateLogicSlide.data.builderslideno, name })
        }
    }, [])


    useEffect(() => {
        if (logicJump.length !== 0) {
            setCurrentLogicJump({ id: logicJump[0]._id, name: "Select Logic Jump" })
        }

    }, [dispatch, logicJump])

    useEffect(() => {
        dispatch(setSlideData(totalSlideAdded))
    }, [totalSlideAdded])

    const onTempSelectHandler = (id, name) => {
        setCurrentTemplate({ id, name })
        setShowTemplateOpt(false)
    }

    const onAddSlide = (data, isLogicJump = false) => {
        setCurrentTemplate({ id: null, name: null })
        setTotalSlideAdded(item => [...item, { ...data }])
        if (isLogicJump) router.push(`/slide/lesson?no=${no}&title=${title}&key=${lessonId}&isLogicJump=${true}&logicJumpId=${data?._id}`)
    }

    const onSlideUpdateHandler = (id, data, isLogicJump) => {
        dispatch(updateSlides({ id, data }))
        dispatch(setUpdateSlide({ id: null, is: false, data: null }))
        if (isLogicJump) {
            console.log({ data })
            dispatch(setUpdateLogicSlide({ is: false, data: null, logic_jump_id: null, arrno: null }))
            setLogicJumpArr(prev => [...prev, data])
        }
        router.back()
    }

    const onPrevClick = () => {
        const lastSlide = slide[slide.length - 1]
        const findSlide = templateType.filter(item => item.id === lastSlide.slideno)[0]


        if (lastSlide) {
            setCurrentTemplate({ id: findSlide?.id, name: findSlide?.name, temp: findSlide?.comp })
        }
    }

    const onLogicJumpSLideAddHandler = (data, update = false) => {
        // dispatch(setLogicJumpSlides(data))
        dispatch(updateLogicJump({ id: data._id, data }))
        setTotalSlideAdded((prev) => prev.map((obj) => obj._id === data._id ? { ...obj, ...data } : obj))
        if (update) {
            dispatch(setUpdateLogicSlide({ is: false, data: null, logic_jump_id: null, arrno: null }))
            router.back()
        }

        setCurrentTemplate({ id: null, name: null })
    }

    function renderer(id) {
        const config = {
            lessonId: lessonId,
            toast: toast,
            onAddSlide: onAddSlide,
            order: slide.length,
            update: !updateSlide.is ? updateLogicSlide : updateSlide,
            onSlideUpdateHandler,
            isLogicJump: { is: isLogicJump ?? false, logicJumpId, handler: onLogicJumpSLideAddHandler }
        }

        switch (id) {
            case 0:
                return <Temp1 {...config} />
            case 1:
                return <Temp2 {...config} />
            case 2:
                return <Temp3 {...config} />
            case 3:
                return <Temp4 {...config} />
            case 4:
                return <Temp5 {...config} />
            case 5:
                return <Temp6 {...config} />
            case 6:
                return <Temp7 {...config} />
            case 7:
                return <Temp8 {...config} />
            case 8:
                return <Temp9 {...config} />
            case 9:
                return <Temp10 {...config} />
            case 10:
                return <Temp11 {...config} />
            case 11:
                return <Temp12 {...config} />
            default:
                return <Temp1 {...config} />
        }
    }

    const isLessonSlidesExists = slide ? slide.filter((item) => item.lesson === lessonId) : []



    const onSlideOptClickHandler = (item, index) => {
        getSlides(item.isSaved).unwrap().then(res => {
            setTotalSlideAdded(res.data)
            getLogicJumpSlide(item.isSaved).unwrap().then(res => {
                dispatch(clearLogicJump())
                dispatch(setLogicJump(res.data))
                setLogicJumpArr([res.data])
                if (res.inner.is) {
                    res.inner.arr.forEach(item => {
                        dispatch(setLogicJump(item))
                        setLogicJumpArr(prev => [...prev, item])
                    })
                }
                router.push(`/slide/lesson?no=${index}&title=${item?.name}&key=${item.isSaved}`)
            }).catch(err => {
                router.push(`/slide/lesson?no=${index}&title=${item?.name}&key=${item.isSaved}`)
            })
        }).catch(err => {
            dispatch(clearLogicJump())
            setTotalSlideAdded([])
            setLogicJumpArr([])
            router.push(`/slide/lesson?no=${index}&title=${item?.name}&key=${item.isSaved}`)
        })
    }

    return (
        <div className="course__builder-slide">
            <ToastContainer position="bottom-left" delay={3000} />

            <div className="upper">
                {
                    (updateLogicSlide.is || updateSlide.is) ? null : (
                        <>
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
                                                    <div className="option__item" onClick={() => onSlideOptClickHandler(item, i + 1)} key={item?.name}>
                                                        <h3 style={{ textTransform: "capitalize" }}>{id} {i + 1}: &nbsp;</h3>
                                                        <h3>{item.name}</h3>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="course__builder-slide__template">
                                <div className="left">
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
                                    logicJumpArr.length !== 0 && (
                                        <div className="right">
                                            <h3>Logic Jump</h3>
                                            <div className="button" onClick={() => setShowLogicOpt(!showLogicOpt)}>
                                                <h3 dangerouslySetInnerHTML={{ __html: currentLogicJump.name }}></h3>
                                                <BsChevronDown size={20} />
                                            </div>
                                            <AnimatePresence>
                                                {
                                                    showLogicOpt && (
                                                        <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                                            {
                                                                logicJumpArr.map((item, i) => (
                                                                    <Link href={`/slide/lesson?no=${no}&title=${title}&key=${lessonId}&isLogicJump=${true}&logicJumpId=${item?._id}`} key={item._id}>
                                                                        <div className="option__item" style={{ justifyContent: "space-between" }} key={item.id} onClick={() => {
                                                                            setCurrentLogicJump({ id: item._id, name: item.question.slice(0, 50) })
                                                                            setShowLogicOpt(false)
                                                                        }}>
                                                                            <b dangerouslySetInnerHTML={{ __html: `${item.question.slice(0, 50)}` }} ></b>
                                                                            {/* <span>#{item.id}</span> */}
                                                                        </div>
                                                                    </Link>
                                                                ))
                                                            }
                                                        </motion.div>
                                                    )
                                                }
                                            </AnimatePresence>
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    )
                }
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
                        isLessonSlidesExists.length !== 0 && (
                            <Link href={`/slide?key=${lessonId}&type=lesson`}>
                                <motion.div className="all" onClick={() => setUpdateSlide({ id: null, is: false, data: null })} whileTap={{ scale: .97 }}>
                                    <p>All Slides</p>
                                </motion.div>
                            </Link>
                        )
                    }
                </div>
                <div className="lesson__btn">
                    <motion.button className="previous" whileTap={{ scale: .97 }} onClick={onPrevClick} >
                        <p>Previous Slide</p>
                        <MdOutlineArrowBackIos size={20} />
                    </motion.button>
                    <motion.button className="add" whileTap={{ scale: .97 }} onClick={() => setCurrentTemplate({ id: null, name: null, temp: null })}>
                        <p>Add Slide</p>
                        <AiOutlinePlus size={20} />
                    </motion.button>
                    <motion.button className="done" whileTap={{ scale: .97 }} onClick={() => router.push("/addcourse")}>
                        Done
                    </motion.button>
                </div>
            </div>
        </div >
    )
}


export default Slide