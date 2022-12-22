import { AnimatePresence, motion } from "framer-motion"
import { RiArrowDownSLine } from "react-icons/ri"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCourseData } from "../../../../../redux/slices/util"
import { MdDelete } from "react-icons/md"
import { useDeleteAssignmentMutation, useUpdateAssignmentMutation, useAddAssignmentMutation,useGetAssignmentMutation } from "../../../../../redux/slices/course"


const Assignment = ({ course, toast }) => {
  const [showLesson, setShowLesson] = useState(false)
  const [selectLesson, setSelectLesson] = useState({ id: null, name: null })
  const [formData, setFormData] = useState({ heading: null, subtext: null, time_to_finish: null })
  const dispatch = useDispatch()
  const [savedData, setSavedData] = useState([])

  const [addAssignment] = useAddAssignmentMutation()
  const [deleteAssignment] = useDeleteAssignmentMutation()
  const [updateAssignment] = useUpdateAssignmentMutation()
  const [getAssignment]=useGetAssignmentMutation()
  const [isUpdate, setIsUpdate] = useState(false)
  const {isPreview}=useSelector(state=>state.util)


  useEffect(() => {

  }, [dispatch, course, formData])
  useEffect(() => {
    if (course?.assigment) {
      setSavedData(course?.assigment)
    }
    if(isPreview){
      getAssignment(course?.id).unwrap().then((res)=>{
        let arr=[]
        res.data.forEach((item)=>{
          arr.push({heading:item.heading,id:item._id,lesson: item.lesson, time_to_finish: item.time_to_finish,subtext:item.subtext,order:item?.order ?? 0})
        })
        setSavedData(arr)
      }).catch((err)=>{
        toast.error("Error Occured while Fetching")
      })
    }
  }, [])


  useEffect(() => {
    dispatch(setCourseData({ assigment: savedData }))
  }, [savedData])

  const onOptionClickHandler = (item) => {
    setSelectLesson(prev => ({ ...prev, id: item.isSaved, name: item.name }))
    setShowLesson(false)
  }

  const onChangeHandler = (data) => {
    setFormData(item => ({ ...item, ...data }))
  }

  const onSubmitHandler = () => {
    if (!formData.heading || !formData.heading || !formData.time_to_finish ) {
      toast.error("All Field is Required")
    } else if (isUpdate) {
      updateAssignment({ data: { ...formData }, id: formData?.id }).unwrap().then((res) => {
        toast.success("Assignment Updated")
        setSavedData(item => item.map((obj, i) => obj.id === formData?.id ? { ...obj, heading: res.data.heading, subtext: res.data.subtext, lesson: res.data.lesson, time_to_finish: res.data.time_to_finish } : obj))
      }).catch((err) => {
        toast.error("Error Occured, While Updating")
      })
    } else {
      addAssignment({ ...formData, lesson: selectLesson.id, course: course.id, time_to_finish: parseInt(formData.time_to_finish) }).unwrap().then((res) => {
        toast.success("Assignment Added")
        setSavedData(item => ([...item, { id: res.data._id, heading: res.data.heading, subtext: res.data.subtext, lesson: res.data.lesson, time_to_finish: res.data.time_to_finish }]))
        setSelectLesson({ id: null, name: null })
        setFormData({ heading: "", subtext: "", time_to_finish: "" })
      }).catch((err) => {
        toast.error("Some Error Occured")
      })
    }
  }

  const itemClickHandler = (item) => {
    setIsUpdate(true)
    setFormData({ ...formData, ...item })
    const lessonName = course?.structure?.find((prev) => prev.isSaved === item.lesson)
    setSelectLesson({ id: item.lesson, name: lessonName?.name })
  }

  const assigmentDeleteHandler = (id) => {
    deleteAssignment(id).unwrap().then(() => {
      toast.success("Assignment Deleted")
      setSavedData(item => item.filter((d) => d.id !== id))
    }).catch((err) => {
      toast.error("Error Occured")
    })
  }
  const onClearHandler = () => {
    setIsUpdate(false)
    setFormData({ heading: "", subtext: "", time_to_finish: "", lesson: "" })
    setSelectLesson({ id: null, name: null })
  }

  console.log({course})

  return (
    <div className="course__structure-content__assignment">
      <div className="left">
        {/* <div className="left__title">
          <h1>List:-</h1>
        </div> */}
        <div className="left__content">
          {
            savedData?.map((item, index) => (
              <div className="item" key={index} >
                <div className="item__left" onClick={() => itemClickHandler(item)}>
                  <h2>{index + 1}</h2>
                  <div className="title">
                    <h2>{item.heading}</h2>
                    <p>{item.subtext.slice(0, 150)}</p>
                  </div>
                </div>
                <motion.div className="delete" whileTap={{ scale: .97 }} onClick={() => assigmentDeleteHandler(item.id)}>
                  <MdDelete size={30} color="red" />
                </motion.div>
              </div>
            ))
          }
        </div>

      </div>
      <div className="right">
        <div className="right__title">
          <h2>Add Assignment</h2>
          <motion.div className="clear" onClick={onClearHandler} whileTap={{ scale: .98 }}>
            <p>clear</p>
          </motion.div>

        </div>

        <div className="right__form">
          <div className="right__form-item input">
            <span>Title</span>
            <input type="text" placeholder='Assignment Heading' value={formData?.heading} onChange={(e) => onChangeHandler({ heading: e.target.value })} />
          </div>
          <div className="right__form-item input">
            <span>Subtext</span>
            <textarea type="text" placeholder='Assignment Subtext' rows={4} value={formData?.subtext} onChange={(e) => onChangeHandler({ subtext: e.target.value })} />
          </div>
          <div className="right__form-item input">
            <span>Duration</span>
            <input type="number" placeholder="Add Assignment Duration in mins" value={formData?.time_to_finish} onChange={(e) => onChangeHandler({ time_to_finish: e.target.value })} />
          </div>
          <div className="right__form-item type">
            <span>Lesson ID</span>
            <div className="type__title" onClick={() => setShowLesson(!showLesson)}>
              <p>{selectLesson.name ?? "None"}</p>
              <div className="cor">
                <span>{selectLesson?.id && `#${selectLesson.id}`}</span>
                <RiArrowDownSLine size={20} />
              </div>
            </div>
            <AnimatePresence>
              {
                showLesson && (
                  <motion.div className="type__option" initial={{
                    scale: 0,
                    opacity: 0
                  }} animate={{
                    scale: 1,
                    opacity: 1
                  }} exit={{
                    scale: 0,
                    opacity: 0
                  }}>
                    {
                      course?.structure?.map((item, i) => !course?.assigment?.find(obj=>obj.lesson===item?.isSaved) && (
                        <div className="opt" onClick={() => onOptionClickHandler(item)} key={item?.id}>
                          <p style={{ textAlign: "start" }}>
                            {item.name}  -  #{item.isSaved}</p>
                        </div>
                      ))
                    }
                  </motion.div>

                )
              }
            </AnimatePresence>
          </div>
          <motion.div className="right__form-save" whileTap={{ scale: .99 }} onClick={onSubmitHandler}>
            <h2>Save Changes</h2>
          </motion.div>
        </div>
      </div>

    </div>
  )
}

export default Assignment