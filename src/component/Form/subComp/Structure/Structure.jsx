import React, { useEffect, useState } from 'react'
import { RiArrowDownSFill, RiArrowDownSLine, RiDeleteBin6Line } from "react-icons/ri"
import { AnimatePresence, motion } from 'framer-motion'
import { BsPlusCircleFill } from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux'
import { setCourseData, setPreRequisite } from '../../../../../redux/slices/util'
import { useAddLessonMutation, useUpdateLessonMutation, useDeleteLessonMutation } from '../../../../../redux/slices/course'
import Assignment from './Assignment'
import Test from './Test'


const switchOpton = [
    {
        id: 0,
        name: "Lesson",
    },
    {
        id: 1,
        name: "Assignment",
    },
    {
        id: 2,
        name: "Test",
    },
]

function Lesson(props) {
    
    const {changePos,setShowNumOpt,showNumOpt}=props
    return (<div>
        {props.fieldArr.map((item, index) => <div className="course__structure-content__item" key={index}>
            <div className='first' key={index}>
                <br />
                <h3 className='no' onClick={() => props.fieldArr.length !== 0 && setShowNumOpt({ id: showNumOpt.id ? null : index, show: showNumOpt.show ? false : true })} >{index + 1} {props.fieldArr.length !== 0 && <RiArrowDownSFill />} </h3>
                <AnimatePresence>

                    {
                        (showNumOpt.id === index && showNumOpt.show) && (
                            <motion.div className="option" initial={{
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
                                    props.fieldArr.map((_, i) => (
                                        <div className="opt" onClick={()=>changePos(index,i)} key={i}>
                                            <h3>{i + 1}</h3>
                                        </div>
                                    ))
                                }
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
            <div className="input">
                <span>Title</span>
                <input type="text" placeholder='Type Lesson Name' value={item.name ?? null} onChange={e => props.onNameChangeHanlder(e, index)} />
            </div>
            <div className="type">
                <span>Pre-requisite</span>
                <div className="type__title" onClick={() => index !== 0 && props.showOptionHandler(1, index)} style={{
                    color: index === 0 && "gray"
                }}>
                    <p style={{
                        textTransform: "capitalize"
                    }}>{item.pre ?? "None"} </p>
                    <RiArrowDownSLine size={20} />
                </div>
                {props.showOption.id === 1 && props.showOption.show && props.showOption.row === index && <motion.div className="type__option" initial={{
                    scale: 0,
                    opacity: 0
                }} animate={{
                    scale: 1,
                    opacity: 1
                }} exit={{
                    scale: 0,
                    opacity: 0
                }}>
                    {props.preType.map(item => item.id !== index && <div className="opt" key={item.name} id={item.name} onClick={() => props.optionSelectHandler(item.name, index)}>
                        <p>{item.name}</p>
                    </div>)}

                </motion.div>}
            </div>
            {props.fieldArr.length - 1 !== 0 && <div>
                <br />
                <motion.div className="delete" onClick={() => props.removeFieldHandler(index)} whileTap={{
                    scale: .97
                }}>
                    <RiDeleteBin6Line size={35} style={{
                        marginTop: ".5rem"
                    }} />
                </motion.div>
            </div>}
        </div>)}

        <div className="add">
            <motion.div className="add__btn" whileTap={{
                scale: .97
            }} onClick={() => props.addFieldHandler(props.fieldArr.length)}>
                <BsPlusCircleFill size={40} />
            </motion.div>
        </div>
    </div>);
}



const Structure = ({ toast }) => {
    const [switchOption, setSwitchOption] = useState("Lesson")

    const { course, preRequisite } = useSelector(state => state.util)
    const [showSwitch, setShowSwitch] = useState(false)

    let [fieldArr, setFieldArr] = useState([{ name: "", pre: null, row: 0, isSaved: null, update: false }])
    const [showOption, setShowOption] = useState({ id: null, show: false, row: null })
    const [showNumOpt, setShowNumOpt] = useState({ id: null, show: false })

    const dispatch = useDispatch()
    const [addLesson] = useAddLessonMutation()
    const [deleteLesson] = useDeleteLessonMutation()
    const [updateLesson] = useUpdateLessonMutation()

    const [preType, setPreType] = useState([])
    
    console.table(preType)
    

    useEffect(() => {

    }, [dispatch])
    useEffect(() => {
        dispatch(setCourseData({ structure: fieldArr }))
    }, [fieldArr])


    useEffect(() => {
        dispatch(setPreRequisite(preType))

    }, [preType])

    useEffect(() => {
        if (course?.structure) {
            setFieldArr(course?.structure)
        }
        if (preRequisite || preRequisite?.length === 0) {
            setPreType(preRequisite)
        }

    }, [])


    const showOptionHandler = (id, no) => {

        if (id === showOption.id && no === showOption.row) {
            setShowOption(item => ({ ...item, id: null, show: false, row: null }))
        } else {
            setShowOption(item => ({ ...item, id, show: true, row: no }))

        }
    }

    const onNameChangeHanlder = (e, index) => {
        const { value } = e.target
        setFieldArr(list => list.map((obj, i) => i === index ? { ...obj, name: value, update: obj.isSaved ? true : false } : obj))

        if (preType[index]?.id === index) {
            setPreType(list => list.map((obj, i) => i === index ? { ...obj, name: value } : obj))
        } else {
            setPreType([...preType, { id: index, name: fieldArr[index].name, }])
        }
    }

    const addFieldHandler = (index) => {
        setFieldArr([...fieldArr, { name: "", pre: null, row: index, isSaved: null }])
    }

    const removeFieldHandler = (id) => {
        const data = fieldArr.filter((_, index) => index === id)

        if (data[0].isSaved) {
            console.log("Runng")
            deleteLesson(data[0]?.isSaved).unwrap().then(() => {
                toast.success("Lesson Deleted")
                setFieldArr((item) => item.filter((_, index) => index !== id))
                setPreType(item => item.filter((_, index) => index !== id))
            }).catch(() => {
                toast.error("Error Occured while deleting")
            })
        } else {
            setFieldArr((item) => item.filter((_, index) => index !== id))
            setPreType(item => item.filter((_, index) => index !== id))
        }
    }

    const optionSelectHandler = (data, row) => {
        console.log(data)
        setFieldArr(list => list.map((obj, i) => i === row ? { ...obj, pre: data, update: obj.isSaved ? true : false } : obj))
        setShowOption(item => ({ ...item, id: null, show: false, row: null }))
    }


    const onSaveHandler = () => {
        fieldArr.forEach((item, index) => {
            if (!item.isSaved) {
                addLesson({ data: { order: index, name: item.name, pre: item.pre }, id: course.id }).unwrap().then((res) => {
                    toast.success("Lesson Added")
                    setFieldArr(list => list.map((obj, i) => i === index ? { ...obj, isSaved: res.data?._id } : obj))
                })
            } else if (item.update) {
                updateLesson({ data: item, id: item.isSaved }).unwrap().then(() => {

                    setFieldArr(list => list.map((obj, i) => i === index ? { ...obj, update: false } : obj))
                    toast.success("Lesson Updated")
                })
            }
        })

    }

    const changePos = (fromIndex, toIndex) => {
        
        var element = fieldArr[fromIndex];
        const newArr=[...fieldArr]
        newArr.splice(fromIndex, 1)
        newArr.splice(toIndex, 0, element)
        setFieldArr(newArr)
        setShowNumOpt({id:null,show:false})
    }

    function showComp() {
        switch (switchOption) {
            case "Lesson":
                return <Lesson
                    fieldArr={fieldArr}
                    showOption={showOption}
                    preType={preType}
                    showOptionHandler={showOptionHandler}
                    onNameChangeHanlder={onNameChangeHanlder}
                    addFieldHandler={addFieldHandler}
                    removeFieldHandler={removeFieldHandler}
                    optionSelectHandler={optionSelectHandler}
                    changePos={changePos}
                    showNumOpt={showNumOpt}
                    setShowNumOpt={setShowNumOpt}

                />
            case "Assignment":
                return <Assignment course={course} toast={toast} />
            case "Test":
                return <Test course={course} toast={toast} />
            default:
                return <Lesson
                    fieldArr={fieldArr}
                    showOption={showOption}
                    preType={preType}
                    showOptionHandler={showOptionHandler}
                    onNameChangeHanlder={onNameChangeHanlder}
                    addFieldHandler={addFieldHandler}
                    removeFieldHandler={removeFieldHandler}
                    optionSelectHandler={optionSelectHandler}
                />
        }
    }



    return (
        <div className="course__structure">

            <div className="course__structure-title">
                <h1>{course?.name ?? "Structure"}</h1>
                {
                    switchOption === "Lesson" && (
                        <motion.div className="save" whileTap={{ scale: .97 }} onClick={onSaveHandler}>
                            <h2>Save Changes</h2>
                        </motion.div>
                    )
                }
            </div>
            <div className="course__structure-switch">

                <motion.div className="btn" onClick={() => setShowSwitch(item => (!item))} whileTap={{ scale: .97 }}>
                    <h3>{switchOption}</h3>
                    <RiArrowDownSFill size={20} />
                </motion.div>
                <AnimatePresence>
                    {
                        showSwitch && (
                            <motion.div className="btn__option" initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} >
                                {switchOpton.map((item) => (
                                    <div className="btn__option-item" key={item.id} onClick={() => {
                                        setSwitchOption(item.name)
                                        setShowSwitch(false)
                                    }}>
                                        <p>{item.name}</p>
                                    </div>
                                ))}
                            </motion.div>
                        )
                    }
                </AnimatePresence>

            </div>
            <div className="course__structure-content">
                {showComp()}
            </div>
        </div>
    )
}

export default Structure