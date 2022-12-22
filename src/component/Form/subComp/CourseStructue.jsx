import React, { useEffect, useState } from 'react'
import { useGetLogicJumpSlideMutation, useGetSlideMutation, useGetTestLogicJumpSlideMutation, useGetTestSlideMutation, useLessonlistOrderMutation } from '../../../../redux/slices/slide'
import { clearLogicJump, clearTestLogicJump, setLogicJump, setSlideData, setTestData, setTestLogicJump, setCourseData } from '../../../../redux/slices/util'
import { useRouter } from 'next/router'
import { ToastContainer } from 'react-toast'
import { useDispatch } from 'react-redux'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { TestCard } from '../../../shared'

const CourseStructue = ({ course }) => {
    const [structureData, setStructureData] = useState([])
    const [getSLide] = useGetSlideMutation()
    const [getTestSlide] = useGetTestSlideMutation()
    const router = useRouter()
    const [getLogicJumpSlide] = useGetLogicJumpSlideMutation()
    const [getTestLogicJumpSlide] = useGetTestLogicJumpSlideMutation()
    const [lessonListOrder] = useLessonlistOrderMutation()

    const dispatch = useDispatch()

    useEffect(() => {
        if (course?.structure) {
            course.structure.forEach((item) => {
                let assignment = course?.assigment?.filter(d => d.lesson === item.isSaved)
                let test = course?.test?.filter(d => d.lesson === item.isSaved)

                setStructureData(prev => [...prev, { title: item.name, type: "lesson", id: item.isSaved, assignment, test, order: item.order }])
            })
        }
        if (course?.assigment) {
            setStructureData(prev => [...prev, ...course?.assigment?.filter(d => d.lesson === null).map(v => ({ ...v, type: "assignment" }))])
        }
        if (course?.test) {
            setStructureData(prev => [...prev, ...course?.test?.filter(d => d.lesson === null).map(v => ({ ...v, type: "test" }))])
        }
    }, [])

    useEffect(() => {

    }, [dispatch])


    const onLessonClickHandler = (i, item) => {
        getSLide(item.id).unwrap().then((res) => {
            dispatch(setSlideData(res.data))
            getLogicJumpSlide(item.id).unwrap().then(res => {

                dispatch(clearLogicJump())
                dispatch(setLogicJump(res.data))
                console.log({ res })
                if (res.inner.is) {
                    console.log("run")
                    res.inner.arr.forEach(item => {
                        dispatch(setLogicJump(item))

                    })
                }
                router.push(`/slide/lesson?no=${i}&title=${item?.title}&key=${item.id}`)
            }).catch(err => {

                router.push(`/slide/lesson?no=${i}&title=${item?.title}&key=${item.id}`)

            })
        }).catch((err) => {
            dispatch(clearLogicJump())
            router.push(`/slide/lesson?no=${i}&title=${item?.title}&key=${item.id}`)
            console.log({ err })
            // toast.error("Error Fetching Lesson Slides")
        })
    }

    const onTestClickHandler = (i, item) => {
        getTestSlide(item.id).unwrap().then(res => {
            dispatch(setTestData(res.data))

            getTestLogicJumpSlide(item.id).unwrap().then(res => {
                dispatch(clearTestLogicJump())
                dispatch(setTestLogicJump(res.data))

                if (res.inner.is) {
                    res.inner.arr.forEach(item => {
                        dispatch(setTestLogicJump(item))
                    })
                }
                router.push(`/slide/test?no=${i + 1}&title=${item?.heading}&key=${item.id}`)
            }).catch(err => {
                router.push(`/slide/test?no=${i + 1}&title=${item?.heading}&key=${item.id}`)

            })
            console.log(res)
        }).catch(err => {
            router.push(`/slide/test?no=${i + 1}&title=${item?.heading}&key=${item.id}`)
            console.log({ err })
        })
    }

    const getIndex = (index) => {
        if (index === 0) return index
        let final = 0

        for (let i = 0; i < index; i++) {
            const obj = structureData[i]
            if (obj.type === "assignment" || obj.type === "test") {
                final += 1
            } else if (obj.type === "lesson") {
                const asmtLen = structureData[i]?.assignment ? structureData[i]?.assignment.length : 0
                const testLen = structureData[i]?.test ? structureData[i]?.test.length : 0
                final += asmtLen + testLen + 1
            }
        }

        return final

    }

    function reduxHandler(type, id, order) {
        switch (type) {
            case "lesson": {
                dispatch(setCourseData({ structure: course.structure.map(obj=>obj.isSaved===id ? {...obj,order}: obj) }))
                return
            }
            case "assignment":{
                dispatch(setCourseData({ assigment: course.assigment.map(obj=>obj.id===id ? {...obj,order} : obj )}))
            }
            case "test":{
                dispatch(setCourseData({ test: course.test.map(obj=>obj.id===id ? {...obj,order} : obj )}))
            }
            default:
                return
        }
    }

    const onDragEnd = (result) => {
        if (!result.destination) return
        const items = structureData
        const temp = items[result.destination.index]
        items[result.destination.index] = { ...items[result.source.index], order: result.destination.index }
        items[result.source.index] = { ...temp, order: result.source.index }

        setStructureData(items)
        const data = structureData.map((obj, index) => {
            return { id: obj.id, order: index, type: obj.type }
        })
        lessonListOrder(data).unwrap().then(res => {
            reduxHandler(items[result.source.index].type, items[result.source.index].id, result.source.index)
            reduxHandler(items[result.destination.index].type, items[result.destination.index].id, result.destination.index)
        })
    }

    return (
        <div className="course__struct">
            <ToastContainer delay={3000} />
            <div className="course__structure-title">
                <h1>Course Structure</h1>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='structure'>
                    {(provided) => (
                        <div className="course__struct-content" {...provided.droppableProps} ref={provided.innerRef} >
                            {
                                structureData.sort((a, b) => a?.order - b?.order).map((item, index) => (
                                    <Draggable key={item.title ?? item.heading} draggableId={item.title ?? item.heading} index={index}  >
                                        {(provided) => (
                                            <div key={index} {...provided.draggableProps} ref={provided.innerRef} {...provided.dragHandleProps} >
                                                {
                                                    item?.type === "lesson" ? (
                                                        <div style={{ marginBottom: "3rem" }} >
                                                            <TestCard className={"light"} key={item.title} heading={item?.title} index={getIndex(index) + 1} handler={() => onLessonClickHandler(index + 1, item)} />
                                                            {/* <br /> */}
                                                            {
                                                                (item?.assignment && item?.assignment.length !== 0) &&
                                                                (
                                                                    <>
                                                                        <div className="line"></div>
                                                                        {item.assignment.map((a, i) => (
                                                                            <TestCard className={"violet"} key={a.heading} heading={a.heading} index={getIndex(index) + 2} />
                                                                        ))}
                                                                    </>
                                                                )
                                                            }

                                                            {
                                                                (item?.test && item?.test.length !== 0) &&
                                                                (<>

                                                                    <div className="line"></div>
                                                                    {item.test.map((a, i) => (
                                                                        <TestCard className={"main"} key={a.heading} heading={a.heading} index={getIndex(index) + 3} handler={() => onTestClickHandler(i, a)} />
                                                                    ))}
                                                                </>)
                                                            }
                                                        </div>
                                                    ) : (
                                                        <TestCard
                                                            className={item.type === "assignment" ? ` violet ` : "main"}
                                                            key={index}
                                                            heading={item?.heading}
                                                            index={getIndex(index) + 1}
                                                            style={{ marginLeft: 0, marginBottom: "3rem" }}
                                                            handler={() => item.type === "test" ? onTestClickHandler(index, item) : null}
                                                        />

                                                    )
                                                }
                                            </div>
                                        )}

                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default CourseStructue