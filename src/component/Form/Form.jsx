import React, { useEffect, useState } from 'react'
import { BsArrowRight, BsArrowLeft } from "react-icons/bs"
import { motion } from 'framer-motion'
import { Structure, Title, CourseStructure } from './subComp'
import { useForm, FormProvider } from 'react-hook-form'
import { useCreateCourseMutation, useGetLessonMutation, useUpdateCourseMutation } from '../../../redux/slices/course'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveStep, setCourseData, setInitiated, setPreRequisite } from '../../../redux/slices/util'
import { toast, ToastContainer } from 'react-toast'
import { uploadMediaToS3 } from '../../util/uploadMedia'


const Form = () => {
    const methods = useForm()
    const dispatch = useDispatch()

    const [createCourseTitle] = useCreateCourseMutation()
    const [updateCourseTitle] = useUpdateCourseMutation()
    const [courseImage, setCourseImage] = useState({ url: null, type: null })
    const { activeStep, initiated, course, isPreview ,user} = useSelector(state => state.util)

    const [getLessons] = useGetLessonMutation()

    useEffect(() => {
        if (isPreview) {
            setCourseImage({ url: course?.image_url })
        }
    }, [])
    useEffect(() => {

    }, [dispatch, initiated])


    function formStep(step) {
        switch (step) {
            case 0:
                return <Title setCourseImage={setCourseImage} isPreview={isPreview} />
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
            getLessons(course?.id).unwrap().then((res) => {
                let arr = []
                let preType=[]
                res.data.forEach((item,index) => {
                    arr.push({ name: item?.name, pre: item?.pre, row: item?.order, isSaved: item?._id })
                    preType.push({id: index, name: item?.name})
                    // dispatch(setCourseData({structure:{name: "", pre: null, row: 0, isSaved: null, update: false}}))
                })
                dispatch(setCourseData({ structure: arr }))
                dispatch(setPreRequisite(preType))
                dispatch(setActiveStep(activeStep + 1))
            }).catch((err) => {
                console.log({ err })
            })
        }else dispatch(setActiveStep(activeStep + 1))
    }
    console.log({ course })


    const onSubmitHandler = async(data) => {
        switch (activeStep) {
            case 0:
                if (!initiated.once) {
                    createCourseTitle({ ...data, img_url: courseImage.url, type: courseImage.type }).unwrap().then((res) => {
                        dispatch(setActiveStep(activeStep + 1))
                        dispatch(setInitiated({ once: true }))
                        dispatch(setCourseData({ ...data, image_url: res.data?.img_url, id: res.id }))

                    }).catch((err) => {
                        toast.error(err?.data?.message)
                    })
                } else if (initiated.once && initiated.refactor) {
                    dispatch(setInitiated({ refactor: false }))

                    if (course?.image_url === courseImage.url) {
                        updateCourseTitle({ data, id: course?.id }).unwrap().then((res) => {
                            dispatch(setCourseData({ ...data, ...res.data }))
                            dispatch(setActiveStep(activeStep + 1))
                        }).catch((err) => {
                            console.log({ err })
                            toast.error("Error Occured")
                        })
                    } else {
                        let url
                        await uploadMediaToS3(courseImage.url,user.token).then((res)=>{
                            url=res.data.data
                        })

                        console.log({url})
                        if(!url) toast.error("Error Occurred, While Upload Image")

                        updateCourseTitle({ data: { ...data, img_url: url }, id: course?.id }).unwrap().then((res) => {
                            dispatch(setCourseData({ ...data, ...res.data }))
                            dispatch(setActiveStep(activeStep + 1))
                        }).catch((err) => {
                            console.log({ err })
                            toast.error("Error Occured")
                        })
                        
                    }
                    getAllLesson()

                }
                else {
                    if (isPreview) {
                        getAllLesson()
                    } else {
                        dispatch(setActiveStep(activeStep + 1))
                        // dispatch(setActiveStep(activeStep + 1))
                    }
                }
                break
            case 1:
                dispatch(setActiveStep(activeStep + 1))

            default:
                return "No Function"
        }
    }
    return (
        <FormProvider {...methods}>
            <ToastContainer position="bottom-left" delay={3000} />
            <form className="mauka__builder-create" onSubmit={methods.handleSubmit(onSubmitHandler)}>
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
                                <motion.button className="next" whileTap={{ scale: .97 }} type="submit">
                                    <p>Next</p>
                                    <BsArrowRight size={20} />
                                </motion.button>

                            )
                        }
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

export default Form