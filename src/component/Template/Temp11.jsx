import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Preview } from '../../shared'
import dynamic from 'next/dynamic'
import { useCreateSlideMutation } from '../../../redux/slices/slide'
import { motion } from 'framer-motion'
import { RiArrowUpSLine } from 'react-icons/ri'
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

const Temp11 = ({ lessonId, toast, onAddSlide }) => {
  const { register, handleSubmit, watch, setValue } = useForm({ mode: "onChange" })
  const [addSlide] = useCreateSlideMutation()

  const [subText, setSubText] = useState(null)
  const [selectedFile, setSelectedFile] = useState({ url: "", type: "", name: "", format: "" })
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (selectedFile.url !== "") {
        setSelectedFile({ url: "", type: "", name: "" })
    }
}, [watch("video_url")])

  const onSubmitHandler = (data) => {


    if (selectedFile.url === "" && watch("video_url") === undefined) {
      return toast.error("Please Select Image/Video")
    } else if (subText === "" || !subText) {
      return toast.error("Please Add Quetion")
    }
    if (selectedFile.type === "image") {
      addSlide({ id: lessonId, data: { ...data,subtext: subText, type: 1, image_url: { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name }} }).unwrap().then((res) => {
        onAddSlide({...res.data,slideno: 10})
        toast.success("Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })
    } else {
      addSlide({ id: lessonId, data: { ...data,subtext: subText, type: 1, video_url: selectedFile.url !== "" ? { url: selectedFile.url, type: selectedFile.format, name: selectedFile.name } : data.video_url } }).unwrap().then((res) => {
        onAddSlide({...res.data,slideno: 10})
        toast.success("Slide Added")
      }).catch((err) => {
        toast.error("Error Occured")
        console.log("Err", err)
      })

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
        <div className="item">
          <p>Heading</p>
          <input type="text" {...register("heading", { required: true })} placeholder={"Enter your Heading"} />
        </div>
        <div className="item">
          <p>Sub Heading</p>
          <input type="text" {...register("subheading", { required: true })} placeholder={"Enter your SubHeading"} />
        </div>
        <div className="item">
          <p>Paragraph</p>
          <QullEditor onChange={(data) => setSubText(data)} theme="snow" placeholder='Enter Your Paragraph' />
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
      <Preview type={10} data={{ title: watch("heading"), subheading: watch("subheading"), para: subText, url: selectedFile.type === "video" ? selectedFile.url : watch("video_url"), image_url: selectedFile.type === "image" ? selectedFile.url : null }} />
    </>
  )
}

export default Temp11