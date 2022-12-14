import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { IoMdArrowBack } from 'react-icons/io'
import { setUpdateSlide, deleteLogicJumpSlides, updateSlides, updateLogicJump, updateTestLogicJump } from '../../../redux/slices/util'
import { useRouter } from 'next/router'
import { RiDeleteBinLine, RiEditCircleFill } from 'react-icons/ri'
import { Preview } from '../../shared'
import { BsChevronDown } from 'react-icons/bs'
import { FaListAlt } from 'react-icons/fa'
import { useDeleteSlideInLogicMutation, useGetSlideByArrMutation, useChangeSlideOrderInLogicJumpMutation, useGetTestSlideByArrMutation, useDeleteTestSlideInLogicMutation, useChangeSlideOrderInTestLogicJumpMutation } from '../../../redux/slices/slide'
import { toast, ToastContainer } from 'react-toast'

const LogicJump = ({ id, isTest }) => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [allLogicJumpSlides, setAllLogicJumpSlides] = useState([])
    const [showSlideOpt, setShowSlideOpt] = useState({ id: null, show: false,row:null })

    const { slide, logicJump, testLogicJump, test } = useSelector(state => state.util)
    const [getSlideByArr] = useGetSlideByArrMutation()
    const [getTestSlideByArr] = useGetTestSlideByArrMutation()
    const [deleteSlide] = useDeleteSlideInLogicMutation()
    const [deleteTestSlide] = useDeleteTestSlideInLogicMutation()
    const [changeSlideOrderInLogicJump] = useChangeSlideOrderInLogicJumpMutation()
    const [changeSlideOrderInTestLogicJump] = useChangeSlideOrderInTestLogicJumpMutation()

    const logicJumpArr = !isTest ? logicJump : testLogicJump

    const [logicJumpSlide, setLogicJumpSlide] = useState(logicJumpArr.find((obj) => obj._id === id) ?? null)
    // const logicJumpSlide=slide.find((obj) => obj._id === id)
    const slidesFetcher = !isTest ? getSlideByArr : getTestSlideByArr


    const getLogicJumpSlides = (refetch, newLogicJumpSlide) => {
        if (refetch) {
            setLogicJumpSlide(newLogicJumpSlide)
            setAllLogicJumpSlides([])
            return
        }


        logicJumpSlide.logic_jump.arr.forEach((item) => {
            slidesFetcher(item.next).unwrap().then(res => {
                setAllLogicJumpSlides(prev => [...prev, { val: item.val, arr: res.data, id: item._id }])
            }).catch((err) => {
                setAllLogicJumpSlides(prev => [...prev, { val: item.val, arr: [], id: item._id }])
            })
        })

    }

    function uniqByKeepLast(data, key) {
        return [
            ...new Map(data.map(x => [key(x), x])).values()
        ]
    } // this function used to remove old slides and add new slide in allLogicJumpslide

    useEffect(() => {
        if (allLogicJumpSlides.length > 4) {
            setAllLogicJumpSlides(prev => uniqByKeepLast(prev, it => it.id))
        }
    }, [allLogicJumpSlides])

    useEffect(() => {
        if (logicJumpSlide) {
            getLogicJumpSlides()
        }
    }, [id, logicJumpSlide])

    useEffect(() => {
        if (logicJumpSlide) {
            getLogicJumpSlides()
        }
    }, [dispatch, router.query.id])


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
        // const MainLogicSlide = !isTest ? logicJump.find(obj => obj._id === id) : testLogicJump.find(obj => obj._id === id)

        // let arrno = null
        // for (let i = 0; i < 4; i++) {
        //     const index = MainLogicSlide.logic_jump.arr[i]?.next?.findIndex(obj => obj.id === item._id)
        //     arrno = i
        //     if (index > -1) break
        // }
        // // dispatch(setUpdateSlide({ is: false, data: null, id: null }))
        // dispatch(setUpdateLogicSlide({ is: true, data: item, id, arrno, logic_jump_id: item._id }))
        // if (!isTest) {
        //     router.push(`/slide/lesson?title=${item.heading}&key=${id}`)
        // } else {
        //     router.push(`/slide/test?title=${item.heading}&key=${id}`)
        // }


        dispatch(setUpdateSlide({ is: true, data: item, id: item._id }))
        if (isTest) {
            router.push(`/slide/test?title=$Test&key=0&update=true`)
        } else {
            router.push(`/slide/lesson?title=Lesson&key=0&update=true`)
        }
    }

    const onSlideDeleteHandler = (item, mainSlideVal) => {
        let arrno

        const index = logicJumpSlide.logic_jump.arr.findIndex(obj => obj.val === mainSlideVal)

        if (index > -1) arrno = index

        if (!isTest) {
            deleteSlide({ id, arrno, logic_jump_id: item._id, logic_jump: item.builderslideno === 11 ? true : false }).unwrap().then((res) => {
                toast.success("Slide Deleted")
                getLogicJumpSlides(true, res.data)
                dispatch(updateSlides({ id: res.data._id, data: res.data }))
                dispatch(updateLogicJump({ id: res.data._id, data: res.data }))
                if (item.builderslideno === 11) {
                    dispatch(deleteLogicJumpSlides({ id: item._id }))
                }
                setAllLogicJumpSlides(prev => prev.filter(obj => obj._id !== item._id))
            }).catch((err) => {
                console.log({ err })
            })
        } else {
            deleteTestSlide({ id, arrno, logic_jump_id: item._id, logic_jump: item.builderslideno === 11 ? true : false }).unwrap().then((res) => {
                toast.success("Slide Deleted")
                getLogicJumpSlides(true, res.data)
                dispatch(updateSlides({ id: res.data._id, data: res.data }))
                dispatch(updateLogicJump({ id: res.data._id, data: res.data }))
                if (item.builderslideno === 11) {
                    dispatch(deleteLogicJumpSlides({ id: item._id }))
                }
                setAllLogicJumpSlides(prev => prev.filter(obj => obj._id !== item._id))
            }).catch((err) => {
                console.log({ err })
            })

        }
    }

    const onAllLogicSlideShowHandler = ({ id, data }) => {
        // dispatch(setUpdateSlide({ is: true, data, id }))
        router.replace(`/slide/logic?id=${id}&isTest=${isTest}`).then(()=>router.reload())
        // router.push(`/slide/logic?id=${id}&isTest=${isTest}`)
        // router.reload()
    }

    const onOrderSelectHandler = ({ id, from, to, logic_jump_id }) => {
        if(!isTest){
            changeSlideOrderInLogicJump({ id, from, to, logic_jump_id }).unwrap().then((res) => {
                setShowSlideOpt({ id: null, show: null ,row:null})
                setLogicJumpSlide(res.data)
                dispatch(updateLogicJump({ id: res.data._id, data: res.data }))
            }).catch(err => {
                console.log({ err })
            })
        }else{
            changeSlideOrderInTestLogicJump({ id, from, to, logic_jump_id }).unwrap().then((res) => {
                setShowSlideOpt({ id: null, show: null,row:null })
                setLogicJumpSlide(res.data)
                dispatch(updateTestLogicJump({ id: res.data._id, data: res.data }))
            }).catch(err => {
                console.log({ err })
            })

        }
    }
    return (
        <>
            <ToastContainer position="top-right" delay={3000} />
            <div className="course__builder-slide preview">
                <motion.div className="nav" whileTap={{ scale: .97 }} onClick={onBackHandler}>
                    <IoMdArrowBack size={20} />
                    <p>Back to All Slides</p>
                </motion.div>


                {
                    allLogicJumpSlides.slice(0, 4).map((obj, indexId) => (
                        <div key={indexId} style={{ marginBottom: "2rem" }}>
                            <div className="slides__opt">
                                <h2>Option {indexId + 1} :</h2>
                                <h3>{obj.val} </h3>
                            </div>
                            <div className="slides">
                                {
                                    obj?.arr?.map((item, index) => (
                                        <div className="slides__item" key={item.id}>
                                            <motion.div className="update" whileTap={{ scale: .97 }} onClick={() => editSlide(item)} >
                                                <RiEditCircleFill size={40} cursor="pointer" />
                                            </motion.div>
                                            <div className="preview">
                                                <Preview type={item?.builderslideno} data={{ ...previewData(item, item?.builderslideno), allSlide: true, isTest }} allSlide={true} />
                                            </div>
                                            <div className="edit">
                                                <div className="edit__order">
                                                    {
                                                        item?.logic_jump?.arr.length!==4 ? (
                                                            <>
                                                                <p>Slide no</p>
                                                                <div className="title" onClick={() => setShowSlideOpt(item => ({ id: showSlideOpt.id === index ? null : index, show: showSlideOpt.id === index ? false : true,row:indexId }))}>
                                                                    <p>{index + 1} </p>
                                                                    <BsChevronDown size={15} />
                                                                </div>
                                                            </>

                                                        ) : (
                                                            <>
                                                                <motion.div className="title logic_jump" whileTap={{ scale: .98 }} onClick={() => onAllLogicSlideShowHandler({ id: item._id, data: item, is: true })}>
                                                                    <FaListAlt size={20} cursor="pointer" />
                                                                    <p>All Slides</p>
                                                                </motion.div>
                                                            </>
                                                        )
                                                    }

                                                    <AnimatePresence>
                                                        {
                                                            (showSlideOpt.id === index && showSlideOpt.show && showSlideOpt.row===indexId) && (
                                                                <motion.div className="option slideopt" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} >
                                                                    {
                                                                        obj?.arr.map((_, orderIndex) => (showSlideOpt.id !== orderIndex && showSlideOpt.show) && (
                                                                            <div className="option__item" onClick={() => onOrderSelectHandler({ id, from: index, to: orderIndex, logic_jump_id: obj.id })} key={orderIndex}>
                                                                                <p>{orderIndex + 1}</p>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </motion.div>
                                                            )
                                                        }
                                                    </AnimatePresence>
                                                </div>

                                                <motion.div className="edit__delete" onClick={() => onSlideDeleteHandler(item, obj.val)} whileTap={{ scale: .98 }}>
                                                    <RiDeleteBinLine size={25} />
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default LogicJump