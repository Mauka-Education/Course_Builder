import React, { useState } from 'react'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation,useUpdateSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { useForm } from "react-hook-form"

const QullEditor = dynamic(import("react-quill"), {
    ssr: false,
})

const Temp5 = ({ lessonId, toast, onAddSlide,order,update,onSlideUpdateHandler }) => {
    const { register, handleSubmit, watch } = useForm({ mode: "onChange" })

    
    const isUpdate=update?.is
    const [addSlide] = useCreateSlideMutation()
    const [updateSlide] = useUpdateSlideMutation()
    const [subText, setSubText] = useState(isUpdate ? update.data.question : "")

    const onSubmitHandler = (data ) => {

        if (!subText) {
            return toast.error("Please Add Paragraph")
        }
        console.log({data})
        addSlide({ id: lessonId, data: { heading: subText, type: 7, ...data,builderslideno:4 ,order} }).unwrap().then((res) => {
            onAddSlide({...res.data,slideno: 4})
            toast.success("Slide Added")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }

    const onUpdateHandler = (data) => {
        
        updateSlide({ id: update?.id, data:{...data,heading:subText} }).unwrap().then((res) => {
            onSlideUpdateHandler(update?.id, res.data)
            toast.success("Slide updated")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }

    return (
        <>
            <form className="course__builder-temp1" onSubmit={handleSubmit( !isUpdate ? onSubmitHandler : onUpdateHandler)}>
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' defaultValue={isUpdate ? update?.data?.heading : null} />
                </div>
                <div className="multi">
                    <div className="item">
                        <p>Lower Limit Text</p>
                        <input type="text" {...register("lowLabel", { required: true })} placeholder={"Enter Lower Limit Text"}  defaultValue={isUpdate ? update?.data?.lowLabel : null} />
                    </div>
                    <div className="item">
                        <p>Upper Limit Text</p>
                        <input type="text" {...register("highLabel", { required: true })} placeholder={"Enter Upper Limit Text"} defaultValue={isUpdate ? update?.data?.highLabel : null}  />
                    </div>
                </div>
                <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
                    <h3>Save</h3>
                </motion.button>
            </form>
            <Preview type={4} data={{ title:  subText, lowLabel: watch("lowLabel"), highLabel: watch("highLabel") }} />
        </>
    )
}

export default Temp5