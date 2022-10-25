import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BsChevronDown } from "react-icons/bs"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Preview } from "../../shared"

import { RiDeleteBinLine } from "react-icons/ri"
import { useDeleteSlideMutation, useDeleteTestSlideMutation } from "../../../redux/slices/slide"
import { toast, ToastContainer } from "react-toast"
import { setSlideData, setTestData } from "../../../redux/slices/util"

const AllSlide = ({id:key,type}) => {
    const [showOpt, setShowOpt] = useState(false)
    const [showSlideOpt, setShowSlideOpt] = useState({ id: null, show: false })
    const [allSlides, setAllSlides] = useState([])
    const { course, slide,test } = useSelector(state => state.util)
    const [deleteSlide] = useDeleteSlideMutation()
    const [deleteTestSlide] = useDeleteTestSlideMutation()
    
    
    const dispatch = useDispatch()



    useEffect(() => {
        if (slide && type==="lesson") {
            console.log("fjfj")
            setAllSlides(slide)
        }else if(test && type==="test"){
            console.log("sjj")
            setAllSlides(test)
        }

    }, [])

    useEffect(() => {
        if(type==="lesson"){
            dispatch(setSlideData(allSlides))
        }else{
            console.log("tskkk")
            dispatch(setTestData(allSlides))
        }
    }, [allSlides])

    useEffect(() => {
    }, [dispatch])


    const lesson = course?.structure?.find(item => item?.isSaved === key)
    
    const lessonSlides = allSlides?.filter(item => item._id !== lesson?.isSaved)

    const Test=course?.test?.find((item)=>item?.id===key)


    // if (!lesson) return null

    function previewData(item, no) {
        switch (no) {
            case 0:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext }
            case 1:
                return { question: item?.question }
            case 2:
                return { question: item?.question, option: item?.options, correct: item?.correct_options[0] }
            case 3:
                return { question: item?.question, option: item?.options, correct: item?.correct_options }
            case 4:
                return { title: item?.subtext, lowLabel: item?.lowLabel, highLabel: item?.highLabel }
            case 5:
                return { images: item?.images }
            case 6:
                return { title: item?.heading, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null }
            case 7:
                return { question: item?.question, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null }
            case 8:
                return { question: item?.question, option: item?.options, correct: item?.correct_options[0], url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null }
            case 9:
                return { question: item?.question, option: item?.options, correct: item?.correct_options, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null }
            case 10:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext,url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null }
            default:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext }
        }
    }

    const deleteHandler = (id) => {

        if(type==="lesson"){
            deleteSlide(id).unwrap().then(() => {
                toast.success("Item Deleted")
                setAllSlides(item => item.filter((item) => item?._id !== id))
            }).catch((err) => {
                toast.error("Error Occured")
            })
        }else{
            deleteTestSlide(id).unwrap().then(() => {
                toast.success("Item Deleted")
                setAllSlides(item => item.filter((item) => item?._id !== id))
            }).catch((err) => {
                toast.error("Error Occured")
            })

        }
    }

    return (
        <div className="course__builder-slide preview">
            <ToastContainer position="bottom-left" delay={3000} />
            <div className="course__builder-slide__title" onClick={() => setShowOpt(!showOpt)}>
                <div className="left">
                    <h2 style={{ textTransform: "capitalize" }}>{type==="lesson" ? "Lesson" : "Test"}  : &nbsp;</h2>
                    <h2>{ type==="lesson" ? lesson?.name : Test?.heading}</h2>
                </div>
                <BsChevronDown size={30} />
                <AnimatePresence>
                    {
                        showOpt && type==="lesson" ?   (
                            <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                {course.structure.map((item, i) => (
                                    <Link href={`/slide?key=${item.isSaved}&type=lesson`} key={item?.name}>
                                        <div className="option__item">
                                            <h3 style={{ textTransform: "capitalize" }}>Lesson {i + 1}: &nbsp;</h3>
                                            <h3>{item.name}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        ): showOpt && (
                            <motion.div className="option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                {course.test.map((item, i) => (
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
                lessonSlides.length===0 && (
                    <div className="message" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <h1>No Slides Addded,Please Add Some Slide</h1>
                    </div>
                )
            }
            <div className="slides">
                {
                    lessonSlides.map((item, id) => (
                        <div className="slides__item" key={id}>
                            <div className="preview">
                                <Preview type={item?.slideno} data={{ ...previewData(item, item?.slideno), allSlide: true }} allSlide={true} />
                                {/* <Temp1   /> */}
                            </div>
                            <div className="edit">
                                <div className="edit__order">
                                    <p>Slide no</p>
                                    <div className="title">
                                        <p>1 </p>
                                        <BsChevronDown size={15} />
                                    </div>

                                    {
                                        (showSlideOpt.id === id && showSlideOpt.show) && (

                                            <div className="option">
                                                <div className="option__item">
                                                    <p>bjjjkb</p>
                                                </div>
                                            </div>
                                        )
                                    }
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