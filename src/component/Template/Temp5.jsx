import React, { useState } from 'react'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { useForm } from "react-hook-form"

const QullEditor = dynamic(import("react-quill"), {
    ssr: false,
})

const Temp5 = ({ lessonId, toast, onAddSlide,order }) => {
    const { register, handleSubmit, watch } = useForm({ mode: "onChange" })

    const [subText, setSubText] = useState(null)
    const [addSlide] = useCreateSlideMutation()


    const onSubmitHandler = ({ data }) => {

        if (!subText) {
            return toast.error("Please Add Paragraph")
        }
        addSlide({ id: lessonId, data: { heading: subText, type: 7, ...data,builderslideno:4 ,order} }).unwrap().then((res) => {
            onAddSlide({...res.data,slideno: 4})
            toast.success("Slide Added")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }


    return (
        <>
            <form className="course__builder-temp1" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' />
                </div>
                <div className="multi">
                    <div className="item">
                        <p>Lower Limit Text</p>
                        <input type="text" {...register("lowLabel", { required: true })} placeholder={"Enter Lower Limit Text"} />
                    </div>
                    <div className="item">
                        <p>Upper Limit Text</p>
                        <input type="text" {...register("highLabel", { required: true })} placeholder={"Enter Upper Limit Text"} />
                    </div>
                </div>
                <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
                    <h3>Save</h3>
                </motion.button>
            </form>
            <Preview type={4} data={{ title: subText, lowLabel: watch("lowLabel"), highLabel: watch("highLabel") }} />
        </>
    )
}

export default Temp5