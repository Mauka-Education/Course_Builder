import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowRight as RightArrow } from "react-icons/md"
import { motion } from 'framer-motion'
// import Link from 'next/link'
import { useGetLogicJumpSlideMutation, useGetSlideMutation,useGetTestLogicJumpSlideMutation,useGetTestSlideMutation } from '../../../../redux/slices/slide'
import { clearLogicJump, clearTestLogicJump, setLogicJump, setSlideData,setTestData, setTestLogicJump } from '../../../../redux/slices/util'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toast'
import { useDispatch } from 'react-redux'

const CourseStructue = ({ course }) => {
    const [structureData, setStructureData] = useState([])
    const [getSLide] = useGetSlideMutation()
    const [getTestSlide] = useGetTestSlideMutation()
    const router = useRouter()
    const [getLogicJumpSlide] = useGetLogicJumpSlideMutation()
    const [getTestLogicJumpSlide] = useGetTestLogicJumpSlideMutation()
    const dispatch=useDispatch()

    useEffect(() => {
        if (course?.structure) {
            course.structure.forEach((item) => {
                let assignment = course?.assigment?.filter(d => d.lesson === item.isSaved)
                let test = course?.test?.filter(d => d.lesson === item.isSaved)

                setStructureData(prev => [...prev, { title: item.name, type: "lesson", id: item.isSaved, assignment, test }])
            })
        }
    }, [])

    useEffect(()=>{

    },[dispatch])

    const onLessonClickHandler = (i,item) => {
        getSLide(item.id).unwrap().then((res) => {
            dispatch(setSlideData(res.data))
            getLogicJumpSlide(item.id).unwrap().then(res=>{
                
                dispatch(clearLogicJump())
                dispatch(setLogicJump(res.data))
                if(res.inner.is){
                    res.inner.arr.forEach(item=>{
                        dispatch(setLogicJump(item))

                    })
                }
                router.push(`/slide/lesson?no=${i}&title=${item?.title}&key=${item.id}`)
            }).catch(err=>{
                
                router.push(`/slide/lesson?no=${i}&title=${item?.title}&key=${item.id}`)
                
            })
        }).catch((err) => {
            dispatch(clearLogicJump())
            router.push(`/slide/lesson?no=${i}&title=${item?.title}&key=${item.id}`)
            console.log({err})
            // toast.error("Error Fetching Lesson Slides")
        })
    }

    const onTestClickHandler=(i,item)=>{
        getTestSlide(item.id).unwrap().then(res=>{
            dispatch(setTestData(res.data))

            getTestLogicJumpSlide(item.id).unwrap().then(res=>{
                dispatch(clearTestLogicJump())
                dispatch(setTestLogicJump(res.data))

                if(res.inner.is){
                    res.inner.arr.forEach(item=>{
                        dispatch(setTestLogicJump(res.data))
                    })
                }
                router.push(`/slide/test?no=${i + 1}&title=${item?.heading}&key=${item.id}`)
            }).catch(err=>{
                router.push(`/slide/test?no=${i + 1}&title=${item?.heading}&key=${item.id}`)
                
            })
            console.log(res)
        }).catch(err=>{
            router.push(`/slide/test?no=${i + 1}&title=${item?.heading}&key=${item.id}`)
            console.log({err})
        })
    }
    return (
        <div className="course__struct">
            <ToastContainer delay={3000} />
            <div className="course__structure-title">
                <h1>Course Structure</h1>
            </div>

            <div className="course__struct-content">
                {
                    structureData.map((item, i) => (

                        <div style={{ marginBottom: "3rem" }} key={item.id}>
                            
                                <motion.div className={"card light"} key={item.title} whileTap={{ scale: .995 }} onClick={()=>onLessonClickHandler(i+1,item)}>
                                    <div className="card__left" >
                                        <div className="card__dec">
                                            <div className="hidden" />
                                        </div>
                                        <div className="card__info">
                                            <p>Lesson {i + 1} :</p>
                                            <h3>{item?.title}</h3>
                                        </div>
                                    </div>
                                    <div className="card__right">
                                        <div className="card__navigate">
                                            <RightArrow size={30} />
                                        </div>
                                    </div>
                                </motion.div>
                            {/* <br /> */}


                            {
                                (item?.assignment && item?.assignment.length !== 0) &&
                                (<>
                                    <div className="line"></div>
                                    {item.assignment.map((a, i) => (
                                        <motion.div className={`card violet`} key={item.title} whileTap={{ scale: .995 }}>
                                            <div className="card__left" >
                                                <div className="card__dec">
                                                    <div className="hidden" />
                                                </div>
                                                <div className="card__info">
                                                    <p>Assigment {i + 1}:</p>
                                                    <h3>{a?.heading}</h3>
                                                </div>
                                            </div>
                                            <div className="card__right">
                                                <div className="card__navigate">
                                                    <RightArrow size={30} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </>)
                            }

                            {
                                (item?.test && item?.test.length !== 0) &&
                                (<>

                                    <div className="line"></div>
                                    {item.test.map((a, i) => (
                                           <div key={i}>
                                            <motion.div className={`card main`} key={a.heading} whileTap={{ scale: .995 }}  onClick={()=>onTestClickHandler(i,a)}>
                                                <div className="card__left" >
                                                    <div className="card__dec">
                                                        <div className="hidden" />
                                                    </div>
                                                    <div className="card__info">
                                                        <p>Test {i + 1}:</p>
                                                        <h3>{a?.heading}</h3>
                                                    </div>
                                                </div>
                                                <div className="card__right">
                                                    <div className="card__navigate">
                                                        <RightArrow size={30} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    ))}
                                </>)
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CourseStructue