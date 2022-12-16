import React, { useEffect, useState } from 'react'
import { Preview } from '../../shared'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RiArrowUpSLine } from 'react-icons/ri'
import { convertToBase64 } from '../../util/ConvertImageToBase64'
import LogicJump from './util/LogicJump'
import { uploadMediaToS3 } from '../../util/uploadMedia'
import { useInitateSlide } from '../../../hooks'


const Temp6 = ({ lessonId, toast, onAddSlide, order, update, isLogicJump, autoSaveHandler }) => {

    const isUpdate = update?.is
    const [previewImg, setPreviewImg] = useState([])

    const [allNew, setAllNew] = useState(false)
    const { logicJump, user } = useSelector(state => state.util)


    const [logicJumpId, setLogicJumpId] = useState([])

    const BUILDER_SLIDE_NO = 8
    const SLIDE_TYPE = 5
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
        if (isUpdate && update?.data?.images?.length !== 0) {
            setPreviewImg(update.data.images)
        }
    }, [])
    useEffect(() => {

    }, [previewImg])

    const onChangeHandler = async (e) => {
        let url = []
        if (e.target.files.length > 1) {
            for (let i = 0; i < e.target.files.length; i++) {
                const Image_Url = await convertToBase64(e.target.files[i])
                uploadMediaToS3(e.target.files[i], user.token).then(res => {
                    url.push(res.data.data)
                })

                setPreviewImg(item => [...item, Image_Url])
            }

        } else if (e.target.files.length === 1) {
            const Image_Url = await convertToBase64(e.target.files[0])
            uploadMediaToS3(e.target.files[0], user.token).then(res => {
                url.push(res.data.data)
            })
            setPreviewImg(item => [...item, { url: Image_Url, type: e.target.files[0].type, name: e.target.files[0]?.name, update: isUpdate }])
        }

        autoSaveHandler(mainId, { images: url })
        toast.success("Images Uploaded")
    }

    const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

    const onMulSelectHandler = (data) => {
        if (logicJumpId.includes(data)) {
            setLogicJumpId(prev => prev.filter(item => item !== data))
        } else {
            setLogicJumpId(prev => [...prev, data])
        }
    }

    return (
        <>
            <form className="course__builder-temp1">
                <div className="item image">
                    <span>Media</span>
                    <div className="image__inner">
                        <input type="file" className='upload' id='upload' accept='image/*' multiple onChange={(e) => onChangeHandler(e)} />
                        <label htmlFor="upload">Upload <RiArrowUpSLine size={25} /> </label>
                        <motion.span whileTap={{ scale: .98 }} onClick={() => {
                            setPreviewImg([])
                            setAllNew(true)
                        }} >Clear All</motion.span>
                    </div>
                </div>
                {
                    isLogicJump.is && (
                        <LogicJump handler={onMulSelectHandler} idArr={logicJumpId} arr={isLogicJumpArr?.logic_jump.arr} />
                    )
                }
            </form>
            <Preview type={5} data={{ images: previewImg, editor: true }} />
        </>
    )
}

export default Temp6