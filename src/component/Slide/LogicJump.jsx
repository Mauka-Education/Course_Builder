import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { IoMdArrowBack } from 'react-icons/io'
import { setUpdateSlide, setUpdateLogicSlide } from '../../../redux/slices/util'
import { useRouter } from 'next/router'
import { RiDeleteBinLine, RiEditCircleFill } from 'react-icons/ri'
import { Preview } from '../../shared'
import { BsChevronDown } from 'react-icons/bs'
import { FaListAlt } from 'react-icons/fa'
import { useGetSlideMutation, useDeleteSlideInLogicMutation } from '../../../redux/slices/slide'
import { toast, ToastContainer } from 'react-toast'

const LogicJump = ({ id }) => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [allLogicJumpSlides, setAllLogicJumpSlides] = useState([])

    useEffect(() => {

    }, [dispatch])

    const { slide } = useSelector(state => state.util)
    const [getSlide] = useGetSlideMutation()
    const [deleteSlide] = useDeleteSlideInLogicMutation()

    const logicJumpSlide = slide.find((obj) => obj.builderslideno === 11)
    // const AllLogicJumpSlides = [...mainSlide.logic_jump.arr[0].next, ...mainSlide.logic_jump.arr[1].next, ...mainSlide.logic_jump.arr[2].next, ...mainSlide.logic_jump.arr[3].next]

    useEffect(() => {
        if (id) {
            getSlide(id).unwrap().then(res => {
                setAllLogicJumpSlides(res.data)
            }).catch((err) => {
                console.log({ err })
            })
        }
    }, [])

    console.log({ allLogicJumpSlides })

    const onBackHandler = () => {
        dispatch(setUpdateSlide({ is: false, data: null, id: null }))
        router.back()
    }

    function previewData(item, no) {
        switch (no) {
            case 0:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext, isTest: false, slideno: item?.builderslideno }
            case 1:
                return { question: item?.question, isTest: false, slideno: item?.builderslideno }
            case 2:
                return { question: item?.question, option: item?.options, correct: item?.correct_options[0], isTest: false, slideno: item?.builderslideno }
            case 3:
                return { question: item?.question, option: item?.options, correct: item?.correct_options, isTest: false, slideno: item?.builderslideno }
            case 4:
                return { title: item?.heading, lowLabel: item?.lowLabel, highLabel: item?.highLabel, isTest: false, slideno: item?.builderslideno }
            case 5:
                return { images: item?.images, isTest: false, slideno: item?.builderslideno }
            case 6:
                return { title: item?.heading, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: false, slideno: item?.builderslideno }
            case 7:
                return { question: item?.question, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: false, slideno: item?.builderslideno }
            case 8:
                return { question: item?.question, option: item?.options, correct: item?.correct_options[0], url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: false, slideno: item?.builderslideno }
            case 9:
                return { question: item?.question, option: item?.options, correct: item?.correct_options, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: false, slideno: item?.builderslideno }
            case 10:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext, url: item?.video_url ? item?.video_url : null, image_url: item?.image_url ? item?.image_url : null, isTest: false, slideno: item?.builderslideno }
            case 11:
                return { question: item?.question, option: item?.logic_jump.arr, isTest: false, slideno: item?.builderslideno }
            default:
                return { title: item?.heading, subheading: item?.subheading, para: item?.subtext }
        }
    }


    const editSlide = (item) => {
        const MainLogicSlide = slide.find(obj => obj._id === id)
        let arrno = null
        for (let i = 0; i < 4; i++) {
            const index = MainLogicSlide.logic_jump.arr[i]?.next?.findIndex(obj => obj.id === item._id)
            arrno = i
            if (index > -1) break
        }
        dispatch(setUpdateSlide({ is: false, data: null, id: null }))
        dispatch(setUpdateLogicSlide({ is: true, data: item, id, arrno, logic_jump_id: item._id }))
        router.push(`/slide/lesson?title=${item.heading}&key=${id}`)
    }

    const onSlideDeleteHandler = (item) => {
        const MainLogicSlide = slide.find(obj => obj._id === id)
        let arrno = null
        for (let i = 0; i < 4; i++) {
            const index = MainLogicSlide.logic_jump.arr[i]?.next?.findIndex(obj => obj.id === item._id)
            arrno = i
            if (index > -1) break
        }
        deleteSlide({ id, arrno, logic_jump_id: item._id }).unwrap().then(() => {
            toast.success("Slide Deleted")
            setAllLogicJumpSlides(prev => prev.filter(obj => obj._id !== item._id))
            console.log("Success")
        }).catch((err) => {
            console.log({ err })
        })
    }


    return (
        <>
            <ToastContainer position="top-right" delay={3000} />
            <div className="course__builder-slide preview">
                <motion.div className="nav" whileTap={{ scale: .97 }} onClick={onBackHandler}>
                    <IoMdArrowBack size={20} />
                    <p>Back to All Slides</p>
                </motion.div>

                <div className="slides">
                    {
                        allLogicJumpSlides?.map((item, id) => (
                            <div className="slides__item" key={id}>
                                <motion.div className="update" whileTap={{ scale: .97 }} onClick={() => editSlide(item)} >
                                    <RiEditCircleFill size={40} cursor="pointer" />
                                </motion.div>
                                <div className="preview">
                                    <Preview type={item?.builderslideno} data={{ ...previewData(item, item?.builderslideno), allSlide: true }} allSlide={true} />
                                </div>
                                <div className="edit">
                                    <div className="edit__order">
                                        {
                                            !item?.logic_jump?.level ? (
                                                <>
                                                    <p>Slide no</p>
                                                    <div className="title">
                                                        <p>{item?.order} </p>
                                                        <BsChevronDown size={15} />
                                                    </div>
                                                </>

                                            ) : (
                                                <>
                                                    <motion.div className="title logic_jump" whileTap={{ scale: .98 }}>
                                                        <FaListAlt size={20} cursor="pointer" />
                                                        <p>All Slides</p>
                                                    </motion.div>
                                                </>
                                            )
                                        }

                                        {/* <AnimatePresence>
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
                            </AnimatePresence> */}
                                    </div>
                                    <motion.div className="edit__delete" onClick={() => onSlideDeleteHandler(item)} whileTap={{ scale: .98 }}>
                                        <RiDeleteBinLine size={25} />
                                    </motion.div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default LogicJump