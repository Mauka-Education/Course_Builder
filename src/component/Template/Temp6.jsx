import React, { useEffect, useState } from 'react'
import { Preview } from '../../shared'
import { useCreateSlideMutation, useUpdateSlideMutation,useAddSlideInLogicMutation, useUpdateSlideInLogicMutation } from '../../../redux/slices/slide'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RiArrowUpSLine } from 'react-icons/ri'
import { convertToBase64 } from '../../util/ConvertImageToBase64'


const Temp4 = ({ lessonId, toast, onAddSlide, order,update,onSlideUpdateHandler,isLogicJump }) => {

    const isUpdate=update?.is
    const [previewImg, setPreviewImg] = useState([])

    const [addSlide] = useCreateSlideMutation()
    const [updateSlide]=useUpdateSlideMutation()

    const [allNew, setAllNew] = useState(false)

    const [addSlideInLogic] = useAddSlideInLogicMutation()
    const { logicJump,updateLogicSlide } = useSelector(state => state.util)

    const [updateSlideInLogic] = useUpdateSlideInLogicMutation()
    
    const [logicJumpId, setLogicJumpId] = useState(null)
    
    const onSubmitHandler = async(e) => {
        e.preventDefault()

        if (previewImg.length === 0) {
            return toast.error("Please Select Image")
        }

        // const {}=await 

        if (isLogicJump.is === "true") {
            addSlideInLogic({ id: isLogicJump.logicJumpId, logicId: logicJumpId, data: { images: previewImg, type: 8, builderslideno: 5, order} }).unwrap().then((res) => {
                isLogicJump.handler(res.data)
                toast.success("Slide Added")
            }).catch((err) => {
                toast.error("Error Occured")
                console.log("Err", err)
            })
            return
        }

        addSlide({ id: lessonId, data: { images: previewImg, type: 8, builderslideno: 5, order } }).unwrap().then((res) => {
            onAddSlide({ ...res.data, slideno: 5 })
            toast.success("Slide Added")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }
    useEffect(()=>{
        if(isUpdate && update?.data?.images?.length!==0){
            setPreviewImg(update.data.images)
        }
    },[])
    useEffect(() => {

    }, [previewImg])

    const onChangeHandler = async (e) => {
        console.log({hs:e.target.files})
        if (e.target.files.length > 1) {
            for (let i = 0; i < e.target.files.length; i++) {
                console.log("runn")
                const Image_Url = await convertToBase64(e.target.files[i])
                setPreviewImg(item => [...item, { url: Image_Url, type: e.target.files[i].type,name:e.target.files[i]?.name,update: isUpdate }])
            }
        } else if (e.target.files.length === 1) {
            const Image_Url = await convertToBase64(e.target.files[0])
            setPreviewImg(item => [...item, { url: Image_Url, type: e.target.files[0].type,name:e.target.files[0]?.name,update: isUpdate }])
        }
    }

    const onUpdateHandler = (e) => {
        e.preventDefault()

        if (updateLogicSlide.is) {
            updateSlideInLogic({ id: updateLogicSlide.id, data: { ...data, heading: subText }, logic_jump_id: updateLogicSlide.logic_jump_id, arrno: updateLogicSlide.arrno }).unwrap().then((res) => {
                isLogicJump.handler(res.data, true)
                toast.success("Slide updated")
            }).catch((err) => {
                console.log({ err })
            })

            return
        }

        updateSlide({ id: update?.id, data: { images:{ files: previewImg.filter((item)=>item?.update===true),isAllNew: allNew} } }).unwrap().then((res) => {
            onSlideUpdateHandler(update?.id, res.data)
            toast.success("Slide updated")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }

    const isLogicJumpArr = logicJump.find((item) => item._id === isLogicJump.logicJumpId)

    return (
        <>
            <form className="course__builder-temp1" onSubmit={ !isUpdate ? onSubmitHandler : onUpdateHandler }>
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
            <Preview type={5} data={{ images: previewImg }} />
        </>
    )
}

export default Temp4