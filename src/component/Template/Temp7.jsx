import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Preview } from '../../shared'
import { useSelector } from 'react-redux'
import { useCreateSlideMutation, useUpdateMediaSlideMutation,useAddSlideInLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { RiArrowUpSLine } from 'react-icons/ri'
import { convertToBase64 } from '../../util/ConvertImageToBase64'

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

const Temp7 = ({ lessonId, toast, onAddSlide, order, update, onSlideUpdateHandler,isLogicJump }) => {
    const { register, handleSubmit, watch, setValue } = useForm({ mode: "onChange" })
    const [addSlide] = useCreateSlideMutation()
    const [selectedFile, setSelectedFile] = useState({ url: "", type: "", name: "", format: "" })

    const [activeTab, setActiveTab] = useState(0)
    const [updateSlide] = useUpdateMediaSlideMutation()

    const [isNewMedia, setIsNewMedia] = useState(false)
    const isUpdate = update.is

    const [addSlideInLogic] = useAddSlideInLogicMutation()
    const { logicJump } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState(null)


    useEffect(() => {
        if (selectedFile.url !== "") setSelectedFile({ url: "", type: "", name: "" })
        
    }, [watch("video_url")])

    useEffect(() => {
        if (isUpdate) {
            if (update?.data?.image_url) {
                setSelectedFile({ url: update?.data?.image_url, type: "image", name: "Image" })
            } else {
                setSelectedFile({ url: update?.data?.video_url, type: "video", name: "Video" })
            }
        }
    }, [])


    const onSubmitHandler = (data) => {
        if (selectedFile.url.length === 0 && watch("video_url") === undefined) {
            return toast.error("Please Select Image/Video")
        }
        
        if (selectedFile.type === "image") {
            if (isLogicJump.is === "true") {
                addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { ...data, order, builderslideno: 6, type: 1, image_url: { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name }, heading: data?.heading  } }).unwrap().then((res) => {
                    onAddSlide({ ...res.data, slideno: 1 })
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })
                return
            }
            addSlide({ id: lessonId, data: { ...data, order, builderslideno: 6, type: 1, image_url: { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name }, heading: data?.heading } }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 6 })
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            if (isLogicJump.is === "true") {
                addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { ...data, order, builderslideno: 6, type: 1, video_url: selectedFile.url !== "" ? { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name } : data.video_url, heading: data?.heading } }).unwrap().then((res) => {
                    onAddSlide({ ...res.data, slideno: 1 })
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })
                return
            }
            
            addSlide({ id: lessonId, data: { ...data, order, builderslideno: 6, type: 1, video_url: selectedFile.url !== "" ? { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name } : data.video_url, heading: data?.heading } }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 6 })
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })

        }
    }
    const onChangeHandler = async (e) => {
        if (e.target.files.length === 1) {
            setIsNewMedia(true)
            setValue("video_url", null)
            const Image_Url = await convertToBase64(e.target.files[0])
            let match = Image_Url.match(/^data:([^/]+)\/([^;]+);/) || [];
            let type = match[1];
            setSelectedFile(item => ({ ...item, url: Image_Url, type, name: e.target.files[0]?.name, format: e.target.files[0]?.type }))
        }
    }

    const onUpdateHandler = (data) => {
        if (selectedFile.type === "image") {
            updateSlide({ id: update?.id, data: { heading:data.heading, image_url: { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name,isNewMedia } } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            updateSlide({ id: update?.id, data: { heading:data.heading, video_url: selectedFile.url !== "" ? { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name ,isNewMedia} : {youtube:data.video_url,isNewMedia} } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })

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
                        <input type="text" {...register("video_url", { required: true,onChange:()=>setIsNewMedia(true) })} placeholder={"Enter Youtube Url"} />
                    </div>
                )
            default:
                break;
        }
    }
    
    const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

    return (
        <>
            <form className="course__builder-temp1" onSubmit={handleSubmit(!isUpdate ? onSubmitHandler : onUpdateHandler)}>
                <div className="item">
                    <p>Heading</p>
                    <input type="text" {...register("heading", { required: true })} placeholder={"Enter your Heading"} defaultValue={isUpdate ? update?.data?.heading : null} />
                </div>
                {renderer(activeTab)}
                <div className="item tab">
                    {
                        tabItem.map((item) => (
                            <motion.span key={item.name} className={item.id === activeTab ? "active" : ''} whileTap={{ scale: .98 }} onClick={() => setActiveTab(item.id)} >{item.name}</motion.span>
                        ))
                    }
                </div>
                {
                    isLogicJump.is && (
                        <div className="item logic_jump">
                            <p>Select where to add this slide in Logic Jump Option </p>
                            <div className="logic_jump-option">
                                {isLogicJumpArr?.logic_jump.arr.map((item) => (
                                    <h3 key={item._id} onClick={() => setLogicJumpId(item._id)} className={item._id === logicJumpId ? "corr" : ""} >{item.val}</h3>
                                ))}
                            </div>
                        </div>
                    )
                }

                <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
                    <h3>{isUpdate ? "Update" : "Save"}</h3>
                </motion.button>
            </form>
            <Preview type={6} data={{ title: watch("heading"), url: selectedFile.type === "video" ? selectedFile.url : watch("video_url"), image_url: selectedFile.type === "image" ? selectedFile.url : null }} />
        </>
    )
}

export default Temp7