
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BsChevronDown } from "react-icons/bs"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Preview } from "../../shared"

import { RiDeleteBinLine,RiEditCircleFill } from "react-icons/ri"
import {IoMdArrowBack} from "react-icons/io"

import { useChangeSlideOrderMutation, useChangeTestSlideOrderMutation, useDeleteSlideMutation, useDeleteTestSlideMutation } from "../../../redux/slices/slide"
import { toast, ToastContainer } from "react-toast"
import { setSlideData, setTestData,setUpdateSlide } from "../../../redux/slices/util"
import { useRouter } from "next/router"

const AllSlide = ({ id: key, type }) => {
    const [showOpt, setShowOpt] = useState(false)
    const [showSlideOpt, setShowSlideOpt] = useState({ id: null, show: false })
    const [allSlides, setAllSlides] = useState([])
    const { course, slide, test } = useSelector(state => state.util)


    const router=useRouter()
    const [deleteSlide] = useDeleteSlideMutation()
    const [deleteTestSlide] = useDeleteTestSlideMutation()

    const [changeSlideOrder] = useChangeSlideOrderMutation()
    const [changeTestSlideOrder] = useChangeTestSlideOrderMutation()

    

    const dispatch = useDispatch()

    useEffect(() => {
        if (slide && type === "lesson") {
            setAllSlides(slide)
        } else if (test && type === "test") {
            setAllSlides(test)
        }
    }, [])



    useEffect(() => {
        if (type === "lesson") {
            dispatch(setSlideData(allSlides))
        } else {
            dispatch(setTestData(allSlides))
        }
    }, [allSlides])

    useEffect(() => {
    }, [dispatch,slide])


    const lesson = course?.structure?.find(item => item?.isSaved === key)

    const lessonSlides = allSlides?.filter(item => item._id !== lesson?.isSaved)

    const Test = course?.test?.find((item) => item?.id === key)
    // if (!lesson) return null


    function previewData(item, no) {
        switch (no) {
            case 0:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 1:
                return { question: item?.question, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 2:
                return { question: item?.question, option: item?.options, correct: item?.correct_options[0], isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 3:
                return { question: item?.question, option: item?.options, correct: item?.correct_options, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 4:
                return { title: item?.heading, lowLabel: item?.lowLabel, highLabel: item?.highLabel, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 5:
                return { images: item?.images, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 6:
                return { title: item?.heading, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 7:
                return { question: item?.question, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 8:
                return { question: item?.question, option: item?.options, correct: item?.correct_options[0], url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 9:
                return { question: item?.question, option: item?.options, correct: item?.correct_options, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            case 10:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: type === "lesson" ? false : true, slideno: item?.builderslideno }
            default:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext }
        }
    }

    const deleteHandler = (id) => {

        if (type === "lesson") {
            deleteSlide(id).unwrap().then(() => {
                toast.success("Item Deleted")
                setAllSlides(item => item.filter((item) => item?._id !== id))
            }).catch((err) => {
                toast.error("Error Occured")
            })
        } else {
            deleteTestSlide(id).unwrap().then(() => {
                toast.success("Item Deleted")
                setAllSlides(item => item.filter((item) => item?._id !== id))
            }).catch((err) => {
                toast.error("Error Occured")
            })

        }
    }

    function orderArr() {
        let arr = []
        const item = type === "lesson" ? slide : test
        for (let i = 0; i < item.length; i++) {
            console.log({ idl: item[i] })
            arr.push(item[i]?.order)
        }

        return arr
    }
    // const orderArr = Array.from(Array( type==="lesson" ?  slide.length : test.length).keys())

    const onOrderSelectHandler = ({ id, order }) => {
        if (type === "lesson") {
            const toId = slide.filter((item) => item.order === order)

            changeSlideOrder({ id1: id, id2: toId[0]?._id, order }).unwrap().then((res) => {
                setAllSlides(res.data)
                toast.success("Order Changed")
            }).catch((err) => {
                toast.success("Error Occured")
                console.log({ err })
            })
        } else {
            const toId = test.filter((item) => item.order === order)

            changeTestSlideOrder({ id1: id, id2: toId[0]?._id, order }).unwrap().then((res) => {
                setAllSlides(res.data)
                toast.success("Order Changed")
            }).catch((err) => {
                toast.success("Error Occured")
                console.log({ err })
            })
        }
        setShowSlideOpt({ id: null, show: false })
    }
    
    console.log({Test,lesson})
    const editSlide=(item)=>{
        dispatch(setUpdateSlide({is:true,data:item,id:item._id}))
        if(type==="test"){
            router.push(`/slide/test?title=${Test.heading}&key=${Test.id}`)

        }else{
            router.push(`/slide/lesson?title=${lesson.name}&key=${lesson.isSaved}`)

        }
    }
    
    const onBackHandler=()=>{
        dispatch(setUpdateSlide({is:false,data:null,id:null}))
        router.push("/addcourse")
    }

    
    return (
        <div className="course__builder-slide preview">
            <ToastContainer position="bottom-left" delay={3000} />
            <motion.div className="nav" whileTap={{scale:.97}} onClick={onBackHandler}>
                <IoMdArrowBack size={20} />
                <p>Back to Lessons</p>
            </motion.div>
            <div className="course__builder-slide__title" onClick={() => setShowOpt(!showOpt)}>
                <div className="left">
                    <h2 style={{ textTransform: "capitalize" }}>{type === "lesson" ? "Lesson" : "Test"}  : &nbsp;</h2>
                    <h2>{type === "lesson" ? lesson?.name : Test?.heading}</h2>
                </div>
                <BsChevronDown size={30} />
                
                <AnimatePresence>
                    {
                        showOpt && type === "lesson" ? (
                            <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                {course?.structure?.map((item, i) => (
                                    <Link href={`/slide?key=${item.isSaved}&type=lesson`} key={item?.name}>
                                        <div className="option__item">
                                            <h3 style={{ textTransform: "capitalize" }}>Lesson {i + 1}: &nbsp;</h3>
                                            <h3>{item.name}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        ) : showOpt && (
                            <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                {course?.test?.map((item, i) => (
                                    <Link href={`/slide?key=${item.id}&type=test`} key={item?.name}>
                                        <div className="option__item">
                                            <h3 style={{ textTransform: "capitalize" }}>Test {i + 1}: &nbsp;</h3>
                                            <h3>{item.heading}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
            {
                lessonSlides.length === 0 && (
                    <div className="message" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h1>No Slides Addded,Please Add Some Slide</h1>
                    </div>
                )
            }
            <div className="slides">

                {
                    lessonSlides?.sort((a, b) => a.order - b.order)?.map((item, id) => (
                        <div className="slides__item" key={id}>
                            <motion.div className="update" whileTap={{scale:.97}} onClick={()=>editSlide(item)}>
                                <RiEditCircleFill size={40} cursor="pointer" />
                            </motion.div>
                            <div className="preview">
                                <Preview type={item?.builderslideno} data={{ ...previewData(item, item?.builderslideno), allSlide: true }} allSlide={true} />
                            </div>
                            <div className="edit">
                                <div className="edit__order">
                                    <p>Slide no</p>
                                    <div className="title" onClick={() => setShowSlideOpt(item => ({ id: id, show: item.id === id ? !item.show : true }))}>
                                        <p>{item?.order} </p>
                                        {/* <p>{id}</p> */}
                                        <BsChevronDown size={15} />
                                    </div>

                                    <AnimatePresence>
                                        {
                                            (showSlideOpt.id === id && showSlideOpt.show) && (
                                                <motion.div className="option" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} >
                                                    {
                                                        orderArr()?.map((order) => order !== item.order && (
                                                            <div className="option__item" onClick={() => onOrderSelectHandler({ id: item._id, order })} key={order}>
                                                                <p>{order}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </motion.div>
                                            )
                                        }
                                    </AnimatePresence>
                                </div>
                                <motion.div className="edit__delete" onClick={() => deleteHandler(item?._id)} whileTap={{ scale: .98 }}>
                                    <RiDeleteBinLine size={25} />
                                </motion.div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AllSlide