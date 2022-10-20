import React, { useEffect, useState } from 'react'
import { BsArrowRight, BsArrowLeft } from "react-icons/bs"
import { motion } from 'framer-motion'
import { Structure, Title, CourseStructure } from './subComp'
import { useForm, FormProvider } from 'react-hook-form'
import { useCreateCourseMutation, useUpdateCourseMutation } from '../../../redux/slices/course'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveStep, setCourseData, setInitiated } from '../../../redux/slices/util'
import { toast, ToastContainer } from 'react-toast'


const Form = () => {
    const methods = useForm()
    const dispatch = useDispatch()

    const [createCourseTitle] = useCreateCourseMutation()
    const [updateCourseTitle] = useUpdateCourseMutation()
    const [courseImage, setCourseImage] = useState({ url: null, type: null })
    const { activeStep, initiated, course } = useSelector(state => state.util)


    useEffect(() => {

    }, [dispatch, initiated])


    function formStep(step) {
        switch (step) {
            case 0:
                return <Title setCourseImage={setCourseImage} />
            case 1:
                return <Structure toast={toast} />
            case 2:
                return <CourseStructure course={course} />
            default:
                return <Title />
        }
    }

    const onSubmitHandler = (data) => {
        switch (activeStep) {
            case 0:
                if (!initiated.once) {
                    createCourseTitle({ ...data, image_url: courseImage.url, type: courseImage.type }).unwrap().then((res) => {
                        dispatch(setActiveStep(activeStep + 1))
                        dispatch(setInitiated({ once: true }))
                        dispatch(setCourseData({ ...data, id: res.id }))

                    }).catch((err) => {
                        toast.error(err?.data?.message)
                    })
                } else if (initiated.once && initiated.refactor) {
                    dispatch(setInitiated({ refactor: false }))

                    if (course?.image_url === courseImage.url) {
                        console.log("running this")
                        updateCourseTitle({ data, id: course?.id }).unwrap().then((res) => {
                            dispatch(setCourseData({ ...data, ...res.data }))

                            dispatch(setActiveStep(activeStep + 1))
                        }).catch((err) => {
                            console.log({ err })
                            toast.error("Error Occured")
                        })
                    } else {
                        console.log("running")
                        updateCourseTitle({ data: { ...data, image_url: courseImage.url, type: courseImage.type, update_img: true }, id: course?.id }).unwrap().then((res) => {
                            dispatch(setCourseData({ ...data, ...res.data, image_url: courseImage.url }))
                            dispatch(setActiveStep(activeStep + 1))
                        }).catch((err) => {
                            console.log({ err })
                            toast.error("Error Occured")
                        })

                    }

                }
                else {
                    dispatch(setActiveStep(activeStep + 1))
                }
                break
            case 1:
                dispatch(setActiveStep(activeStep + 1))

            default:
                return "No Function"
        }
    }

    console.log({ initiated })
    return (
        <FormProvider {...methods}>
            <ToastContainer position="top-right" delay={3000} />
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
                    {/* <div className="lesson__btn">
                        <motion.button className="previous" whileTap={{ scale: .97 }} >
                            <p>Previous Slide</p>
                            <MdOutlineArrowBackIos size={20} />
                        </motion.button>
                        <motion.button className="add" whileTap={{ scale: .97 }} >
                            <p>Add Slide</p>
                            <AiOutlinePlus size={20} />
                        </motion.button>
                        <motion.button className="done" whileTap={{ scale: .97 }} >
                            Done
                        </motion.button>
                    </div> */}
                </div>
            </form>
        </FormProvider>
    )
}

export default Form