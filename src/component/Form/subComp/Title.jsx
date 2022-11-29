import React, { useEffect, useState } from 'react'
import { RiArrowUpSLine } from "react-icons/ri"
import { useFormContext } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { setInitiated } from '../../../../redux/slices/util'
import { convertToBase64 } from '../../../util/ConvertImageToBase64'
import { getPreSignedUrl } from '../../../util/getPreSignedUrl'

const Title = ({ setCourseImage, isPreview, data }) => {
    const dispatch = useDispatch()
    const [inputText, setInputText] = useState("")
    const { course } = useSelector(state => state.util)
    const { register } = useFormContext()
    const [previewImg, setpreviewImg] = useState("")


    useEffect(() => {

    }, [dispatch])

    useEffect(()=>{
        getPreSignedUrl(course?.image_url).then((data)=>{
            setpreviewImg(data)
        })
    },[])

    const onChangeHandler = async (e) => {

        if (e.target.files[0]) {
            setInputText(e.target.files[0]?.name)

            const image_Url = await convertToBase64(e.target?.files[0])
            setpreviewImg(image_Url)
            setCourseImage({ url: e.target.files[0], type: e.target?.files[0]?.type })
            dispatch(setInitiated({ refactor: true }))
        }
    }



    return (
        <div className="course__basic" >
            <div className="course__basic-title item" >
                <span>Course Title</span>
                <input type="text" defaultValue={course?.name ?? null} placeholder='New Course' {...register("name", { required: true })} onChange={() => dispatch(setInitiated({ refactor: true }))} />
            </div>
            <div className="course__basic-desc item">
                <span>Description</span>
                <input type="text" defaultValue={course?.short_desc ?? null} placeholder='Please Add Course Description' {...register("short_desc", { required: true })} onChange={() => dispatch(setInitiated({ refactor: true }))} />
            </div>
            <div className="course__basic-desc item">
                <span>Duration</span>
                <input type="number" defaultValue={course?.time_to_finish ?? null} placeholder='Please Add Course Duration in mins' {...register("time_to_finish", { required: true })} onChange={() => dispatch(setInitiated({ refactor: true }))} />
            </div>
            <div className="course__basic-img">
                <span>Cover Image</span>
                <div className="input">
                    <label htmlFor="image">
                        <p>Upload</p>
                        <RiArrowUpSLine size={20} />
                    </label>
                    <input type="file" name='image' id='image' accept='image/*' onChange={onChangeHandler} />
                    {
                        inputText && (
                            <span>{inputText}</span>
                        )
                    }
                </div>
                {
                    previewImg && (
                        <div className="course__basic-img__preview">
                            <img src={previewImg} alt="" style={{ width: "100%" }} />
                        </div>

                    )
                }

            </div>
        </div>
    )
}

export default Title