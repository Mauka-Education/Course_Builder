import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { AiOutlinePlus } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Temp10, Temp12, Temp2, Temp3, Temp4, Temp8, Temp9 } from "../Template"
import { toast, ToastContainer } from "react-toast"
import { setTestData, setUpdateSlide, updateTestLogicJump } from "../../../redux/slices/util"
import { useAutoSaveMediaMutation, useAutosaveslideinlogicMutation, useAutoSaveSlideMutation } from "../../../redux/slices/slide"
import { useRouter } from "next/router"
import { RemoveHtmlFromString } from "../../util/RemoveHtmlFromString"

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
    },
    {
        id: 6,
        name: "Logic Jump",
        slideno: 11
    },
]
const Test = ({ title, id, no, lessonId }) => {
    const { course, test, updateSlide, testLogicJump, updateLogicSlide } = useSelector(state => state.util)
    const [showOpt, setShowOpt] = useState(false)
    const [showTemplateOpt, setShowTemplateOpt] = useState(false)
    const [currentTemplate, setCurrentTemplate] = useState({ id: null, name: null })

    const [totalSlideAdded, setTotalSlideAdded] = useState([])
    const dispatch = useDispatch()
    // const [getTestSlide] = useGetTestSlideMutation()
    const router = useRouter()

    const { isLogicJump, logicJumpId } = router.query
    const [logicJumpArr, setLogicJumpArr] = useState([])
    const [showLogicOpt, setShowLogicOpt] = useState(false)
    const [currentLogicJump, setCurrentLogicJump] = useState({ id: null, name: null })

    const [autoSave] = useAutoSaveSlideMutation()
    const [autoSaveMedia] = useAutoSaveMediaMutation()
    const [autoSaveInLogic] = useAutosaveslideinlogicMutation()

    useEffect(() => {
        if (test.length !== 0) {
            setTotalSlideAdded(test)
        }

        if (router.query?.update !== "true") {
            dispatch(setUpdateSlide({ id: null, is: false, data: null }))
        } else {
            if (updateSlide?.is) {
                const temp = templateType.find((item) => item.slideno === updateSlide.data.builderslideno)
                setCurrentTemplate({ id: temp.id, name: temp.name })
            }
        }

        if (testLogicJump.length !== 0) {
            setLogicJumpArr(testLogicJump)
            setCurrentLogicJump({ id: testLogicJump[0]._id, name: "Select Logic Jump" })
        }else{
            router.push(`/slide/test?no=${no}&title=${title}&key=${lessonId}`)
        }
    }, [])

    useEffect(() => {

    }, [dispatch, test])

    useEffect(() => {
        if (testLogicJump.length !== 0) {
            if (logicJumpId && isLogicJump === "true") {
                const logicSlide = testLogicJump.find(item => item._id === logicJumpId)
                setCurrentLogicJump({ id: logicJumpId, name: logicSlide.question })
            } else {
                setCurrentLogicJump({ id: testLogicJump[0]._id, name: "Select Logic Jump" })

            }
        }

    }, [testLogicJump])

    useEffect(() => {
        dispatch(setTestData(totalSlideAdded))
    }, [totalSlideAdded])


    const onTempSelectHandler = (id, name) => {
        setCurrentTemplate({ id, name })
        setShowTemplateOpt(false)
    }

    const onAddSlide = (data) => {
        if (logicJumpId) {
            return
        }
        setTotalSlideAdded(item => [...item, { ...data }])
        toast.success("Slide  Created")
    }

    const autoSaveHandler = (id, data, media = false, isLogicJump) => {
        const modifiedId = updateSlide.is ? updateSlide.id : id

        setTimeout(() => {
            if (!media) {
                autoSave({ id: modifiedId, data, isTest: true }).unwrap().then(res => {
                    setTotalSlideAdded((prev) => prev.map(obj => obj._id === modifiedId ? { ...res.data } : obj))

                    if (isLogicJump) {
                        dispatch(updateLogicJump({ id: modifiedId, data: res.data }))
                    }
                }).catch(err => {
                })

            } else {
                autoSaveMedia({ id: modifiedId, data, isTest: true }).unwrap().then(res => {
                    setTotalSlideAdded((prev) => prev.map(obj => obj._id === modifiedId ? { ...res.data } : obj))

                    if (isLogicJump) {
                        dispatch(updateLogicJump({ id: modifiedId, data: res.data }))
                    }
                }).catch(err => {
                })
            }
        }, 1000)
    }

    const onLogicJumpAutoSave = (slide_id, logic_id) => {
        autoSaveInLogic({ id: logicJumpId, slide_id, logic_id, isTest: true }).then((res) => {
            setTotalSlideAdded(prev => prev.map(obj => obj._id === logicJumpId ? { ...res.data.data } : obj))
            dispatch(updateTestLogicJump({ id: logicJumpId, data: res.data.data }))
        }).catch(err => {
            console.log({ err })
        })
    }
    // console.log({log})

    function renderer(id) {
        const config = {
            lessonId,
            toast,
            onAddSlide,
            order: test.length,
            isTest: true,
            update: updateSlide,
            isLogicJump: { is: isLogicJump ?? false, logicJumpId, handler: onLogicJumpAutoSave },
            autoSaveHandler
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
            case 6:
                return <Temp12 {...config} />
            default:
                return <Temp2 {...config} />
        }
    }




    return (
        <div className="course__builder-slide">
            <ToastContainer position="bottom-left" delay={3000} />
            <div className="upper">

                {
                    (updateSlide.is || updateLogicSlide.is) ? null : (
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
                                                {course.test.map((item, i) => (
                                                    <Link href={`/slide/test?no=${i + 1}&title=${item?.heading}&key=${lessonId}`} key={item?.heading}>
                                                        <div className="option__item">
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
                                                <h3>{RemoveHtmlFromString(currentLogicJump.name)?.slice(0, 30) ?? "No Heading"}</h3>
                                                <BsChevronDown size={20} />
                                            </div>
                                            <AnimatePresence>
                                                {
                                                    showLogicOpt && (
                                                        <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                                            {
                                                                logicJumpArr.map((item, i) => (
                                                                    <Link href={`/slide/test?no=${no}&title=${title}&key=${lessonId}&isLogicJump=${true}&logicJumpId=${item?._id}`} key={item._id}>
                                                                        <div className="option__item" style={{ justifyContent: "space-between" }} key={item.id} onClick={() => {
                                                                            setCurrentLogicJump({ id: item._id, name: RemoveHtmlFromString(item.question).slice(0, 15) })
                                                                            setShowLogicOpt(false)
                                                                        }}>
                                                                            <b>{RemoveHtmlFromString(item.question)?.slice(0, 30) ?? "No Heading"}</b>
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
                        test.length !== 0 && (
                            <Link href={`/slide?key=${lessonId}&type=test`}>
                                <motion.div className="all" whileTap={{ scale: .97 }}>
                                    <p>All Slides</p>
                                </motion.div>
                            </Link>
                        )
                    }
                </div>

                {
                    !updateSlide?.is && (
                        <div className="lesson__btn">
                            <motion.button className="add" whileTap={{ scale: .97 }} onClick={() => setCurrentTemplate({ id: null, name: null, temp: null })}>
                                <p>Add Slide</p>
                                <AiOutlinePlus size={20} />
                            </motion.button>
                        </div>
                    )
                }
            </div>
        </div >
    )
}




export default Test