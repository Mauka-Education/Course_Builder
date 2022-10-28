import React, { useEffect, useState } from 'react'
import { Preview } from '../../shared'
import { useCreateSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { RiArrowUpSLine } from 'react-icons/ri'
import { convertToBase64 } from '../../util/ConvertImageToBase64'


const Temp4 = ({ lessonId, toast, onAddSlide,order }) => {
    const [previewImg, setPreviewImg] = useState([])

    const [addSlide] = useCreateSlideMutation()
    const onSubmitHandler = (e) => {
        e.preventDefault()

        if(previewImg.length===0){
            return toast.error("Please Select Image")
        }

        addSlide({ id: lessonId, data:{images: previewImg,type:8,builderslideno:5,order} }).unwrap().then((res) => {
            onAddSlide({...res.data,slideno: 5})
            toast.success("Slide Added")
        }).catch((err) => {
            toast.error("Error Occured")
            console.log("Err", err)
        })
    }
    useEffect(()=>{

    },[previewImg])

    const onChangeHandler=async (e)=>{
        if(e.target.files.length > 1){
            for(let i=0;i<e.target.files.length; i++){
                console.log("runn")
                const Image_Url=await convertToBase64(e.target.files[i])
                setPreviewImg(item=>[...item,{url: Image_Url,type: e.target.files[i].type}])
            }
        }else if(e.target.files.length===1){
            const Image_Url=await convertToBase64(e.target.files[0])
            setPreviewImg(item=>[...item,{ url: Image_Url,type: e.target.files[0].type}])
        }
    }
    

    return (
        <>
            <form className="course__builder-temp1" onSubmit={onSubmitHandler}>
                <div className="item image">
                    <span>Media</span>
                    <div className="image__inner">
                        <input type="file" className='upload' id='upload' accept='image/*' multiple onChange={(e)=>onChangeHandler(e)}  />
                        <label htmlFor="upload">Upload <RiArrowUpSLine size={25} /> </label>
                        <motion.span whileTap={{scale:.98}} onClick={()=>setPreviewImg([])} >Clear All</motion.span>
                    </div>
                </div>
                <motion.button className="save__btn" type='submit' whileTap={{ scale: .97 }}>
                    <h3>Save</h3>
                </motion.button>
            </form>
            <Preview type={5} data={{ images: previewImg}} />
        </>
    )
}

export default Temp4