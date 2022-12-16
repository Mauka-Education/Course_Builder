import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Preview } from '../../shared'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RiArrowUpSLine } from 'react-icons/ri'
import { convertToBase64 } from '../../util/ConvertImageToBase64'
import { uploadMediaToS3 } from '../../util/uploadMedia'
import { getPreSignedUrl } from '../../util/getPreSignedUrl'
import LogicJump from './util/LogicJump'
import { useInitateSlide } from '../../../hooks'

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

const Temp7 = ({ lessonId, toast, onAddSlide, order, update, isLogicJump,autoSaveHandler }) => {
    const { register, handleSubmit, watch, setValue } = useForm({ mode: "onChange" })
    const [selectedFile, setSelectedFile] = useState({ url: "", type: "", name: "", format: "", preview: "" })

    const [activeTab, setActiveTab] = useState(0)
    const isUpdate = update.is

    const { logicJump, user } = useSelector(state => state.util)

    const [logicJumpId, setLogicJumpId] = useState([])

    const BUILDER_SLIDE_NO = 6
    const SLIDE_TYPE = 3
    const { mainId, slide } = useInitateSlide(isLogicJump?.is ? isLogicJump?.logicJumpId :lessonId, SLIDE_TYPE, BUILDER_SLIDE_NO, isUpdate, order)

    useEffect(() => {
        if (mainId) {
            onAddSlide(slide)
        }
    }, [mainId])

    useEffect(()=>{
        if(logicJumpId.length!==0){
          isLogicJump.handler(mainId,logicJumpId)
        }
      },[logicJumpId])

    useEffect(() => {
        if (selectedFile.url !== "") setSelectedFile({ url: "", type: "", name: "", preview: "" })

    }, [watch("video_url")])

    useEffect(() => {
        if (isUpdate) {
            if (update?.data?.image_url) {
                getPreSignedUrl(update?.data?.image_url).then(res => {
                    setSelectedFile({ url: update?.data?.image_url, type: "image", name: "Image", preview: res })
                })

            } else {

                getPreSignedUrl(update?.data?.video_url).then(res => {
                    setSelectedFile({ url: update?.data?.video_url, type: "video", name: "Video", preview: res })
                })
            }
        }
    }, [])

    const onChangeHandler = async (e) => {
        if (e.target.files.length === 1) {
            setValue("video_url", null)
            const Image_Url = await convertToBase64(e.target.files[0])
            let match = Image_Url.match(/^data:([^/]+)\/([^;]+);/) || [];
            let type = match[1];
            setSelectedFile(item => ({ ...item, url: e.target.files[0], type, preview: Image_Url }))

            await uploadMediaToS3(e.target.files[0], user.token).then((res) => {
                autoSaveHandler(mainId,{[ type==="image" ?"image_url":"video_url"]:res.data.data},true)
            }).catch((err) => {
                console.log({ err })
                toast.error("Image Not Uploaded, Try Again")
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
                        <input type="text" {...register("video_url", { required: true })} placeholder={"Enter Youtube Url"} />
                    </div>
                )
            default:
                break;
        }
    }

    const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

    const onMulSelectHandler = (data) => {
        if (logicJumpId.includes(data)) {
            setLogicJumpId(prev => prev.filter(item => item !== data))
        } else {
            setLogicJumpId(prev => [...prev, data])
        }
    }


    const onAutoSaveHandler=(data)=>{
        autoSaveHandler(mainId,{...data})
    }
    return (
        <>
            <form className="course__builder-temp1" onChange={handleSubmit(onAutoSaveHandler)}>
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
                        <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} />
                    )
                }
            </form>
            <Preview type={6} data={{ title: watch("heading"), url: selectedFile.type === "video" ? selectedFile.preview : watch("video_url"), image_url: selectedFile.type === "image" ? selectedFile.preview : null, editor: true }} />
        </>
    )
}

export default Temp7