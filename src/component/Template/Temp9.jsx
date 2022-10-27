import React, { useEffect, useState } from 'react'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation, useCreateTestSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import MCQ from "./util/MCQ"
import { RiArrowUpSLine } from 'react-icons/ri'
import { useForm } from 'react-hook-form'
import { convertToBase64 } from '../../util/ConvertImageToBase64'

const QullEditor = dynamic(import("react-quill"), {
    ssr: false,
})
const tabItem = [
    {
        id: 0,
        name: "Media"
    },
    {
        id: 1,
        name: "Youtube"
    },
]

const Temp9 = ({ lessonId, toast, onAddSlide, isTest,order }) => {

    const [subText, setSubText] = useState(null)
    const [addSlide] = useCreateSlideMutation()
    const [addTestSlide] = useCreateTestSlideMutation()
    const [mark, setMark] = useState(1)

    const [option, setOption] = useState([])
    const [correctOpt, setCorrectOpt] = useState([])
    const [selectedFile, setSelectedFile] = useState({ url: "", type: "", name: "", format: "" })
    const [activeTab, setActiveTab] = useState(0)

    const { register, handleSubmit, watch, setValue } = useForm({ mode: "onChange" })

    useEffect(() => {
        if (selectedFile.url !== "") {
            setSelectedFile({ url: "", type: "", name: "" })
        }
    }, [watch("video_url")])

    const onSubmitHandler = (data) => {
        const removeUndifined = correctOpt.filter((item) => item !== undefined)
        const isAllOption = option.filter((item) => item.val === "")

        if (!subText) {
            return toast.error("Please Add Paragraph")
        } else if (isAllOption?.length !== 0) {
            return toast.error("Please Add All Option")
        } else if (removeUndifined?.length === 0) {
            return toast.error("Please Select Correct Option")
        } else if (selectedFile.url === "" && watch("video_url") === undefined) {
            return toast.error("Please Select Image/Video")
        } else if (subText === "" || !subText) {
            return toast.error("Please Add Quetion")
        }

        if (!isTest) {
            if (selectedFile.type === "image") {
                addSlide({ id: lessonId, data: { question: subText,builderslideno:8,order, type: 5, image_url: { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name }, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio" } }).unwrap().then((res) => {
                    onAddSlide({ ...res.data, slideno: 8 })
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })
            } else {
                addSlide({ id: lessonId, data: { question: subText,builderslideno:8,order, type: 5, video_url: selectedFile.url !== "" ? { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name } : data.video_url, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio" } }).unwrap().then((res) => {
                    onAddSlide({ ...res.data, slideno: 8 })
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })

            }
        }else{
            if (selectedFile.type === "image") {
                addTestSlide({ id: lessonId, data: { question: subText,builderslideno:8,order, type: 5, image_url: { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name }, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio",mark } }).unwrap().then((res) => {
                    onAddSlide({ ...res.data, slideno: 8,added:true })
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })
            } else {
                addTestSlide({ id: lessonId, data: { question: subText,builderslideno:8,order, type: 5, video_url: selectedFile.url !== "" ? { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name } : data.video_url, options: option, correct_options: correctOpt.filter(item => item !== undefined), mcq_type: "radio",mark } }).unwrap().then((res) => {
                    onAddSlide({ ...res.data, slideno: 8,added:true })
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })

            }
        }
    }



    const onChangeHandler = async (e) => {
        if (e.target.files.length === 1) {
            setValue("video_url", null)
            const Image_Url = await convertToBase64(e.target.files[0])
            let match = Image_Url.match(/^data:([^/]+)\/([^;]+);/) || [];
            let type = match[1];
            setSelectedFile(item => ({ ...item, url: Image_Url, type, name: e.target.files[0]?.name, format: e.target.files[0]?.type }))
        }
    }
    function renderer(no) {
        switch (no) {
            case 0:
                return (
                    <div className="item image">
                        <span>Media</span>
                        <div className="image__inner">
                            <input type="file" className='upload' id='upload' accept='image/*,video/*' onChange={(e) => onChangeHandler(e)} />
                            <label htmlFor="upload">Upload <RiArrowUpSLine size={25} /> </label>
                            <p>{selectedFile?.name}</p>
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="item">
                        <span>Youtube URL</span>
                        <input type="text" {...register("video_url", { required: true })} placeholder={"Enter Youtube Url"} />
                    </div>
                )
            default:
                break;
        }
    }
    return (
        <>
            <form className="course__builder-temp1" onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="item quil_small" >
                    <p>Question/Prompt</p>
                    <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' />
                </div>
                <div className="item">
                    <MCQ isMulti={false} setQuestion={setOption} setAnswer={setCorrectOpt} isTest={isTest} setMark={setMark} />
                </div>
                {renderer(activeTab)}
                <div className="item tab">
                    {
                        tabItem.map((item) => (
                            <motion.span key={item.name} className={item.id === activeTab ? "active" : ''} whileTap={{ scale: .98 }} onClick={() => setActiveTab(item.id)} >{item.name}</motion.span>
                        ))
                    }
                </div>
                <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
                    <h3>Save</h3>
                </motion.button>
            </form>
            <Preview type={8} data={{ question: subText, option, correct: correctOpt.filter((item) => item !== undefined)[0], url: selectedFile.type === "video" ? selectedFile.url : watch("video_url"), image_url: selectedFile.type === "image" ? selectedFile.url : null,isTest }} />
        </>
    )
}

export default Temp9