import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { IoMdArrowBack } from 'react-icons/io'
import { setUpdateSlide, setUpdateLogicSlide, deleteLogicJumpSlides, updateSlides, updateLogicJump } from '../../../redux/slices/util'
import { useRouter } from 'next/router'
import { RiDeleteBinLine, RiEditCircleFill } from 'react-icons/ri'
import { Preview } from '../../shared'
import { BsChevronDown } from 'react-icons/bs'
import { FaListAlt } from 'react-icons/fa'
import { useDeleteSlideInLogicMutation, useGetSlideByArrMutation ,useChangeSlideOrderInLogicJumpMutation} from '../../../redux/slices/slide'
import { toast, ToastContainer } from 'react-toast'

const LogicJump = ({ id, mainSlide }) => {
    const dispatch = useDispatch()
    const router = useRouter()

    const [allLogicJumpSlides, setAllLogicJumpSlides] = useState([])
    const [showSlideOpt, setShowSlideOpt] = useState({ id: null, show: false })

    const { slide, logicJump } = useSelector(state => state.util)
    const [getSlideByArr] = useGetSlideByArrMutation()
    const [deleteSlide] = useDeleteSlideInLogicMutation()
    const [changeSlideOrderInLogicJump]=useChangeSlideOrderInLogicJumpMutation()


    const [logicJumpSlide, setLogicJumpSlide] = useState(logicJump.find((obj) => obj._id === id) ?? null)
    // const logicJumpSlide=slide.find((obj) => obj._id === id)


    const getLogicJumpSlides = (refetch, newLogicJumpSlide) => {
        if (refetch) {
            setLogicJumpSlide(newLogicJumpSlide)
            setAllLogicJumpSlides([])
            return
        }
        

        logicJumpSlide.logic_jump.arr.forEach((item) => {
            getSlideByArr(item.next).unwrap().then(res => {
                console.log({res})
                setAllLogicJumpSlides(prev => [...prev, { val: item.val, arr: res.data,id:item._id }])
            }).catch((err) => {
                setAllLogicJumpSlides(prev => [...prev, { val: item.val, arr: [],id:item._id}])
            })
        })

    }

    console.log({allLogicJumpSlides})
    function uniqByKeepLast(data,key){
        return [
            ...new Map(data.map(x=>[key(x),x])).values()
        ]
    }
    useEffect(()=>{
        if(allLogicJumpSlides.length>4){            
            // setAllLogicJumpSlides(allLogicJumpSlides?.filter((v, i, a) => a.findIndex(v2 => (v2.val === v.val)) === i))
            setAllLogicJumpSlides(prev=>uniqByKeepLast(prev,it=>it.id))
        }
    },[allLogicJumpSlides])

    useEffect(() => {
        if (logicJumpSlide) {
            getLogicJumpSlides()
        }
    }, [id, logicJumpSlide])

    useEffect(() => {
        if (logicJumpSlide) {
            getLogicJumpSlides()
        }

        console.log("updated")
    }, [dispatch, router])


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

    const onSlideDeleteHandler = (item, mainSlideVal) => {
        let arrno

        const index = logicJumpSlide.logic_jump.arr.findIndex(obj => obj.val === mainSlideVal)

        if (index > -1) arrno = index

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
    }

    const onAllLogicSlideShowHandler = ({ id, data }) => {
        dispatch(setUpdateSlide({ is: true, data, id }))
        router.push(`/slide/logic?id=${id}`)
        // router.reload()
    }

    const onOrderSelectHandler=({id,from,to,logic_jump_id})=>{
        console.log({to,from})
        changeSlideOrderInLogicJump({id,from,to,logic_jump_id}).unwrap().then((res)=>{
            setShowSlideOpt({id:null,show:null})
            setLogicJumpSlide(res.data)
            dispatch(updateLogicJump({id:res.data._id,data:res.data}))
        }).catch(err=>{
            console.log({err})
        })
    }

    console.log({logicJumpSlide})
    
    return (
        <>
            <ToastContainer position="top-right" delay={3000} />
            <div className="course__builder-slide preview">
                <motion.div className="nav" whileTap={{ scale: .97 }} onClick={onBackHandler}>
                    <IoMdArrowBack size={20} />
                    <p>Back to All Slides</p>
                </motion.div>


                {
                    allLogicJumpSlides.slice(0,4).map((obj, indexId) => (
                        <div key={indexId} style={{ marginBottom: "2rem" }}>
                            <div className="slides__opt">
                                <h2>Option {indexId + 1} :</h2>
                                <h3>{obj.val} </h3>
                            </div>
                            <div className="slides">
                                {
                                    obj?.arr?.map((item, index) => (
                                        <div className="slides__item" key={obj.id}>
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
                                                                <div className="title" onClick={() => setShowSlideOpt(item => ({ id: showSlideOpt.id=== index ? null : index , show: showSlideOpt.id===index ? false :  true }))}>
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
                                                            (showSlideOpt.id === index && showSlideOpt.show) && (
                                                                <motion.div className="option slideopt" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} >
                                                                    {
                                                                        obj?.arr.map((_, orderIndex) => (showSlideOpt.id !== orderIndex && showSlideOpt.show) &&  (
                                                                            <div className="option__item" onClick={() => onOrderSelectHandler({ id, from:index,to:orderIndex,logic_jump_id:obj.id })} key={orderIndex}>
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