import React, { useEffect } from 'react'
import { BsArrowRight, BsArrowLeft } from "react-icons/bs"
import { motion } from 'framer-motion'
import { Structure, Title, CourseStructure } from './subComp'
import { useGetLessonMutation } from '../../../redux/slices/course'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveStep, setCourseData, setPreRequisite } from '../../../redux/slices/util'
import { toast, ToastContainer } from 'react-toast'

const Form = () => {
    const dispatch = useDispatch()

    const { activeStep, initiated, course, isPreview } = useSelector(state => state.util)

    const [getLessons] = useGetLessonMutation()

    useEffect(() => {

    }, [dispatch, initiated])


    function formStep(step) {
        switch (step) {
            case 0:
                return <Title isPreview={isPreview} />
            case 1:
                return <Structure toast={toast} />
            case 2:
                return <CourseStructure course={course} />
            default:
                return <Title />
        }
    }

    const getAllLesson = () => {
        if (!course?.structure) {
            getLessons(course?._id).unwrap().then((res) => {
                let arr = []
                let preType = []
                res.data.forEach((item, index) => {
                    arr.push({ name: item?.name, pre: item?.pre, row: item?.order, isSaved: item?._id,order:item.order })
                    preType.push({ id: index, name: item?.name })
                    // dispatch(setCourseData({structure:{name: "", pre: null, row: 0, isSaved: null, update: false}}))
                })
                dispatch(setCourseData({ structure: arr }))
                dispatch(setPreRequisite(preType))
                dispatch(setActiveStep(activeStep + 1))
            }).catch((err) => {
                console.log({ err })
            })
        } else dispatch(setActiveStep(activeStep + 1))
    }


    const onSubmitHandler = async () => {
        switch (activeStep) {
            case 0:
                getAllLesson()
                break
            case 1:
                dispatch(setActiveStep(activeStep + 1))
                break;

            default:
                return "No Function"
        }
    }
    return (
        <>
            <ToastContainer position="bottom-left" delay={3000} />
            <div className="mauka__builder-create">
                <div className="mauka__builder-create__form">
                    {formStep(activeStep)}
                </div>
                <div className="mauka__builder-create__btn">
                    <div className="main__btn">
                        {
                            activeStep !== 0 && (
                                <motion.button className="prev" whileTap={{ scale: .97 }} onClick={() => dispatch(setActiveStep(activeStep - 1))} type="button">
                                    <BsArrowLeft size={20} />
                                    <p>Previous</p>
                                </motion.button>
                            )
                        }
                        {
                            activeStep !== 2 && (
                                <motion.button className="next" whileTap={{ scale: .97 }} onClick={onSubmitHandler}>
                                    <p>Next</p>
                                    <BsArrowRight size={20} />
                                </motion.button>

                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Form