import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Preview } from '../../shared'
import { useCreateSlideMutation, useCreateTestSlideMutation,useAddSlideInLogicMutation, useUpdateMediaSlideMutation, useUpdateMediaTestSlideMutation, useUpdateTestSlideMutation, useUpdateSlideInLogicMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { RiArrowUpSLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { convertToBase64 } from '../../util/ConvertImageToBase64'
import dynamic from 'next/dynamic'
import { uploadMediaToS3 } from '../../util/uploadMedia'
import { getPreSignedUrl } from '../../util/getPreSignedUrl'

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

const Temp8 = ({ lessonId, toast, onAddSlide, isTest = false, order, update, onSlideUpdateHandler,isLogicJump }) => {
    const { register, handleSubmit, watch, setValue } = useForm({ mode: "onChange" })
    
    const [selectedFile, setSelectedFile] = useState({ url: "", type: "", name: "", format: "",preview:"" })
    const [isNewMedia, setIsNewMedia] = useState(false)
    const [activeTab, setActiveTab] = useState(0)
    const [subText, setSubText] = useState(null)
    const [mark, setMark] = useState(1)
    
    const [addSlide] = useCreateSlideMutation()
    const [addTestSlide] = useCreateTestSlideMutation()
    const [updateSlide] = useUpdateMediaSlideMutation()
    const [updateTestSlide] = useUpdateMediaTestSlideMutation()
    
    const isUpdate = update?.is

    const [addSlideInLogic] = useAddSlideInLogicMutation()
    const { logicJump, user,updateLogicSlide } = useSelector(state => state.util)
    const [updateSlideInLogic] = useUpdateSlideInLogicMutation()

    const [logicJumpId, setLogicJumpId] = useState(null)

    useEffect(() => {
        if (isUpdate) {
            if (update?.data?.image_url) {
                getPreSignedUrl(update?.data?.image_url).then(res=>{
                    setSelectedFile({ url: update?.data?.image_url, type: "image", name: "Image",preview:res })
                })
            } else {

                getPreSignedUrl(update?.data?.video_url).then(res=>{
                    setSelectedFile({ url: update?.data?.video_url, type: "video", name: "Video",preview:res })
                })
            }
            setSubText(update?.data?.question)
            if(isTest) setMark(update?.data?.mark)
        }
    }, [])

    

    useEffect(() => {
        if (selectedFile.url !== "") setSelectedFile({ url: "", type: "", name: "" })
    }, [watch("video_url")])


    const onSubmitHandler = async(data) => {
        if (!subText) {
            return toast.error("Please Add Paragraph")
        }
        if (selectedFile.url === "" && watch("video_url") === undefined) {
            return toast.error("Please Select Image/Video")
        }

        let url
        if (!watch("video_url")) {
            await uploadMediaToS3(selectedFile.url, user.token).then((res) => {
                console.log({ res })
                url = res.data.data
            }).catch((err) => {
                console.log({ err })
                toast.error("Image Not Uploaded, Try Again")
            })
        }

        if (!url && !watch("video_url")) return
        
        if (selectedFile.type === "image") {
            if (isLogicJump?.is === "true") {
                addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { question: subText, order, builderslideno: 7, type: 5, image_url:url} }).unwrap().then((res) => {
                    isLogicJump.handler(res.data)
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })
                return
            }
            
            addSlide({ id: lessonId, data: { question: subText, order, builderslideno: 7, type: 5, image_url: url} }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 7 })
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            
            if (isLogicJump?.is === "true") {
                addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { question: subText, order, builderslideno: 7, type: 5, video_url: url ? url : data.video_url} }).unwrap().then((res) => {
                    isLogicJump.handler(res.data)
                    toast.success("Slide Added")
                }).catch((err) => {
                    toast.error("Error Occured")
                    console.log("Err", err)
                })
                return
            }
            
            addSlide({ id: lessonId, data: { question: subText, order, builderslideno: 7, type: 5, video_url: url ? url : data.video_url } }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 7 })
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        }
    }

    const onTestSubmitHandler = async(data) => {
        if (!subText) {
            return toast.error("Please Add Paragraph")
        }
        if (selectedFile.url === "" && watch("video_url") === undefined) {
            return toast.error("Please Select Image/Video")
        }
        
        let url
        if (!watch("video_url")) {
            await uploadMediaToS3(selectedFile.url, user.token).then((res) => {
                console.log({ res })
                url = res.data.data
            }).catch((err) => {
                console.log({ err })
                toast.error("Image Not Uploaded, Try Again")
            })
        }

        if (!url && !watch("video_url")) return

        if (selectedFile.type === "image") {
            addTestSlide({ id: lessonId, data: { question: subText, builderslideno: 7, type: 5, image_url: url, mark } }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 7, added: true })
                toast.success("Test Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            addTestSlide({ id: lessonId, data: { question: subText, builderslideno: 7, type: 5, video_url: url ? url : data.video_url, mark } }).unwrap().then((res) => {
                onAddSlide({ ...res.data, slideno: 7, added: true })
                toast.success("Test Slide Added")
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
            setSelectedFile(item => ({ ...item, url: e.target.files[0], type,preview: Image_Url }))
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
                        <input type="text" {...register("video_url", { required: true,onChange:()=>{setIsNewMedia(true)} })} placeholder={"Enter Youtube Url"}  />
                    </div>
                )
            default:
                break;
        }
    }

    const onUpdateHandler = async(data) => {
        let url
        if (!watch("video_url") && isNewMedia) {
            await uploadMediaToS3(selectedFile.url, user.token).then((res) => {
                console.log({ res })
                url = res.data.data
            }).catch((err) => {
                console.log({ err })
                toast.error("Image Not Uploaded, Try Again")
            })
        }

        if (!url && !watch("video_url") && isNewMedia ) return
        
        if (selectedFile.type === "image") {

            if (updateLogicSlide.is) {
                updateSlideInLogic({ id: updateLogicSlide.id,logic_jump_id: updateLogicSlide.logic_jump_id, arrno: updateLogicSlide.arrno, data: { question:subText, order, image_url: url} }).unwrap().then((res) => {
                    isLogicJump.handler(res.data, true)
                    toast.success("Slide updated")
                }).catch((err) => {
                    console.log({ err })
                })
    
                return
            }
            
            updateSlide({ id: update?.id, data: { question: subText, image_url: url, isNewMedia  } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            if (updateLogicSlide.is) {
                updateSlideInLogic({ id: updateLogicSlide.id,logic_jump_id: updateLogicSlide.logic_jump_id, arrno: updateLogicSlide.arrno, data: { question:subText, order, video_url: url ? url : data.video_url} }).unwrap().then((res) => {
                    isLogicJump.handler(res.data, true)
                    toast.success("Slide updated")
                }).catch((err) => {
                    console.log({ err })
                })
    
                return
            }

            updateSlide({ id: update?.id, data: { question: subText, video_url: url ? url : data.video_url,isNewMedia } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        }
    }
    
    const onTestUpdateHandler = async(data) => {
        let url
        if (!watch("video_url") && isNewMedia) {
            await uploadMediaToS3(selectedFile.url, user.token).then((res) => {
                console.log({ res })
                url = res.data.data
            }).catch((err) => {
                console.log({ err })
                toast.error("Image Not Uploaded, Try Again")
            })
        }
    
        if (!url && !watch("video_url") && isNewMedia ) return

        if (selectedFile.type === "image") {
            updateTestSlide({ id: update?.id, data: { question: subText, mark, image_url: url,isNewMedia } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        } else {
            updateTestSlide({ id: update?.id, data: { question: subText,mark, video_url: url ? url : data.video_url,isNewMedia } }).unwrap().then((res) => {
                onSlideUpdateHandler(update?.id, res.data)
                toast.success("Slide updated")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
        }
    }

    const handler=!isUpdate ? onSubmitHandler : onUpdateHandler
    const testHandler=!isUpdate ? onTestSubmitHandler : onTestUpdateHandler
    const isLogicJumpArr = !isTest && logicJump.find((item) => item._id === isLogicJump?.logicJumpId)

    return (
        <>
            <form className="course__builder-temp1" onSubmit={handleSubmit(isTest ?  testHandler :  handler)}>
                <div className="item">
                    <p>Question/Prompt</p>
                    <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Question' defaultValue={isUpdate ? update.data.question : null} />
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
                    isTest && (
                        <div className="item mark">
                            <p>Mark</p>
                            <input type="number" onChange={(e) => setMark(e.target.value)} defaultValue={isUpdate ? update?.data?.mark : 1} />
                        </div>

                    )
                }
                {
                    (isLogicJump?.is && !isTest) && (
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
            {/* <Preview type={7} data={{ question: subText, url: selectedFile.type === "video" ? selectedFile.url : watch("video_url"), image_url: selectedFile.type === "image" ? selectedFile.url : null, isTest }} /> */}
            <Preview type={7} data={{question:subText, url: selectedFile.type === "video" ? selectedFile.preview : watch("video_url"), image_url: selectedFile.type === "image" ? selectedFile.preview : null,editor:true,isTest }} />
        </>
    )
}

export default Temp8