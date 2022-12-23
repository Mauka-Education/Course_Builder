import { AnimatePresence, motion } from "framer-motion"
import { RiArrowDownSLine } from "react-icons/ri"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCourseData } from "../../../../../redux/slices/util"
import { MdDelete } from "react-icons/md"
import { useDeleteAssignmentMutation, useUpdateAssignmentMutation, useInitiateAssinmentMutation, useGetAssignmentMutation } from "../../../../../redux/slices/course"


const Assignment = ({ course, toast }) => {
  const [showLesson, setShowLesson] = useState(false)
  const [selectLesson, setSelectLesson] = useState({ id: null, name: null })
  const [formData, setFormData] = useState({ heading: null, subtext: null, time_to_finish: null })
  const dispatch = useDispatch()
  const [savedData, setSavedData] = useState([])

  const [currentId, setCurrentId] = useState(null)

  const [initateAssignment] = useInitiateAssinmentMutation()
  const [deleteAssignment] = useDeleteAssignmentMutation()
  const [updateAssignment] = useUpdateAssignmentMutation()
  const [getAssignment] = useGetAssignmentMutation()
  const { isPreview } = useSelector(state => state.util)


  useEffect(() => {

  }, [dispatch, course, formData])

  useEffect(() => {
    if (course?.assigment) {
      setSavedData(course?.assigment)
    }
    if (isPreview) {
      getAssignment(course?.id).unwrap().then((res) => {
        let arr = []
        res.data.forEach((item) => {
          arr.push({ heading: item.heading, id: item._id, lesson: item.lesson, time_to_finish: item.time_to_finish, subtext: item.subtext, order: item?.order ?? 0 })
        })
        setSavedData(arr)
      }).catch((err) => {
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
    updateAssignment({ data:{lesson:item.isSaved}, id: currentId }).then(res => {
      setSavedData(prev=>prev.map(obj=>obj.id==currentId ? {...obj,lesson:item.isSaved} : obj ))
    }).catch(err => {
      console.log("Err")
    })
  }

  const onChangeHandler = (data) => {
    setFormData(item => ({ ...item, ...data }))
    setSavedData(item => item.map(obj => obj.id === currentId ? { ...obj, ...data } : obj))
    setTimeout(() => {
      updateAssignment({ data, id: currentId }).then(res => {
        console.log({ res })
      }).catch(err => {
        console.log("Err")
      })
    }, 1000)
  }

  const itemClickHandler = (item) => {
    setFormData({ ...formData, ...item })
    setCurrentId(item.id)
    const lessonName = course?.structure?.find((prev) => prev.isSaved === item.lesson)
    setSelectLesson({ id: item.lesson, name: lessonName?.name })
  }

  const assigmentDeleteHandler = (id) => {
    deleteAssignment(id).unwrap().then(() => {
      toast.success("Assignment Deleted")
      setCurrentId(null)
      setFormData({ heading: "", subtext: "", time_to_finish: "", lesson: "" })
      setSelectLesson({id:null,name:null})
      setSavedData(item => item.filter((d) => d.id !== id))
    }).catch((err) => {
      toast.error("Error Occured")
    })
  }
  const onClearHandler = () => {
    setCurrentId(null)
    setFormData({ heading: "", subtext: "", time_to_finish: "", lesson: "" })
    setSelectLesson({ id: null, name: null })
  }

  const onInitiate = () => {
    initateAssignment(course.id).unwrap().then(res => {
      setCurrentId(res.data)
      setFormData({ heading: "", subtext: "", time_to_finish: "", lesson: "" })
      setSelectLesson({id:null,name:null})
      setSavedData(item => ([...item, { id: res.data }]))
    }).catch(err => {
      console.log({ err })
    })
  }

  return (
    <div className="course__structure-content__assignment">
      <div className="left">
        <div className="left__content">
          {
            savedData?.map((item, index) => (
              <div className="item" key={index}>
                <div className="item__left" onClick={() => itemClickHandler(item)}>
                  <h3>{index + 1}</h3>
                  <div className="title">
                    <h3>{item.heading ?? "Heading"}</h3>
                    <p>{item.subtext ? item.subtext.slice(0, 150) : "Subtext"}</p>
                  </div>
                </div>
                <motion.div className="delete" whileTap={{ scale: .97 }} onClick={() => assigmentDeleteHandler(item.id)}>
                  <MdDelete size={20} color="red" />
                </motion.div>
              </div>
            ))
          }
        </div>

      </div>
      <div className="right">
        <div className="right__title">
          <h2>Add Assignment</h2>
          <motion.div className={`clear ${currentId && "danger"} `} onClick={ !currentId ? onInitiate : onClearHandler } whileTap={{ scale: .98 }}>
            {
              currentId ? <p>Clear</p> :<p>Add New</p>
            }
          </motion.div>

        </div>

        <div className="right__form">
          <div className="right__form-item input">
            <span style={{color: !currentId && "gray"}}>Title</span>
            <input type="text" disabled={currentId ? false : true} style={{backgroundColor: !currentId && "rgb(234 234 234)"}}   placeholder='Assignment Heading' value={formData?.heading} onChange={(e) => onChangeHandler({ heading: e.target.value })} />
          </div>
          <div className="right__form-item input">
            <span style={{color: !currentId && "gray"}}>Question'</span>
            <textarea type="text" placeholder='Assignment Question' disabled={currentId ? false : true} style={{backgroundColor: !currentId && "rgb(234 234 234)"}} rows={4} value={formData?.subtext} onChange={(e) => onChangeHandler({ subtext: e.target.value })} />
          </div>
          <div className="right__form-item input">
            <span style={{color: !currentId && "gray"}}>Duration</span>
            <input type="number" placeholder="Add Assignment Duration in mins" disabled={currentId ? false : true} style={{backgroundColor: !currentId && "rgb(234 234 234)"}} value={formData?.time_to_finish} onChange={(e) => onChangeHandler({ time_to_finish: e.target.value })} />
          </div>
          <div className="right__form-item type">
            <span style={{color: !currentId && "gray"}}>Lesson ID</span>
            <div className="type__title" onClick={() => currentId && setShowLesson(!showLesson)} disabled={currentId ? false : true} style={{backgroundColor: !currentId && "rgb(234 234 234)"}}>
              <p>{selectLesson.name ?? "None"}</p>
              <div className="cor" >
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
                      course?.structure?.map((item) => !course?.assigment?.find(obj => obj.lesson === item?.isSaved) && (
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
        </div>
      </div>

    </div>
  )
}

export default Assignment