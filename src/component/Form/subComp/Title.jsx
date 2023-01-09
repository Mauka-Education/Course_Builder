import React, { useEffect, useState } from 'react'
import { RiArrowUpSLine } from "react-icons/ri"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { setInitiated, setCourseData } from '../../../../redux/slices/util'
import { useUpdateCourseMutation } from '../../../../redux/slices/course'
import { convertToBase64 } from '../../../util/ConvertImageToBase64'
import { getPreSignedUrl } from '../../../util/getPreSignedUrl'
import { uploadMediaToS3 } from '../../../util/uploadMedia'


const Title = ({  isPreview }) => {
    const dispatch = useDispatch()
    const [inputText, setInputText] = useState("")
    const { course,user } = useSelector(state => state.util)
    const [previewImg, setpreviewImg] = useState("")
    const [updateCourse] = useUpdateCourseMutation()

    const { register, handleSubmit } = useForm()

    useEffect(() => {

    }, [dispatch])

    useEffect(() => {
        getPreSignedUrl(course?.image_url).then((data) => {
            setpreviewImg(data)
        })
    }, [])

    const onImgChangeHandler = async (e) => {
        if (e.target.files[0]) {
            await uploadMediaToS3(e.target.files[0], user.token).then(res=>{
                updateCourse({id:course._id,data:{img_url:res.data.data}})
                dispatch(setCourseData({image_url:res.data.data}))
            }).catch(err=>{
                console.log("Error Uploading Image")
            })
            setInputText(e.target.files[0]?.name)
            const image_Url = await convertToBase64(e.target?.files[0])
            setpreviewImg(image_Url)
            dispatch(setInitiated({ refactor: true }))
        }
    }


    const onChangeHandler = (data) => {
        setTimeout(() => {
            updateCourse({ id: course._id, data }).unwrap().then(res => {
                dispatch(setInitiated({ refactor: true }))
                dispatch(setCourseData(res.data))
            }).catch(err => {
                console.log("Error Occured")
            })
        }, 1000)
    }


    return (
        <form className="course__basic" onChange={handleSubmit(onChangeHandler)} >
            <div className="course__basic-title item">
                <span>Course Title</span>
                <input type="text" defaultValue={course?.name ?? null} placeholder='New Course' {...register("name")} />
            </div>
            <div className="course__basic-desc item">
                <span>Description</span>
                <input type="text" defaultValue={course?.short_desc ?? null} placeholder='Please Add Course Description' {...register("short_desc")} />
            </div>
            <div className="course__basic-desc item">
                <span>Duration</span>
                <input type="number" defaultValue={course?.time_to_finish ?? null} placeholder='Please Add Course Duration in mins' {...register("time_to_finish")} />
            </div>
            <div className="course__basic-img">
                <span>Cover Image</span>
                <div className="input">
                    <label htmlFor="image">
                        <p>Upload</p>
                        <RiArrowUpSLine size={20} />
                    </label>
                    <input type="file" name='image' id='image' accept='image/*' onChange={onImgChangeHandler} />
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
        </form>
    )
}

export default Title