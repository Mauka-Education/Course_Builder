import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowRight as RightArrow } from "react-icons/md"
import { motion } from 'framer-motion'
import Link from 'next/link'

const CourseStructue = ({ course }) => {
    const [structureData, setStructureData] = useState([])

    useEffect(() => {
        if (course?.structure) {
            course.structure.forEach((item) => {
                let assignment = course?.assigment?.filter(d => d.lesson === item.isSaved)
                let test = course?.test?.filter(d => d.lesson === item.isSaved)

                setStructureData(prev => [...prev, { title: item.name, type: "lesson", id: item.isSaved, assignment, test }])
            })
        }
    }, [])

    console.table(structureData)
    return (
        <div className="course__struct">
            <div className="course__structure-title">
                <h1>Course Structure</h1>
            </div>

            <div className="course__struct-content">
                {
                    structureData.map((item, i) => (

                        <div style={{ marginBottom: "3rem" }} key={item.id}>
                            <Link href={`/slide/lesson?no=${i + 1}&title=${item?.title}&key=${item.id}`}>
                                <motion.div className={"card light"} key={item.title} whileTap={{ scale: .995 }}>
                                    <div className="card__left" >
                                        <div className="card__dec">
                                            <div className="hidden" />
                                        </div>
                                        <div className="card__info">
                                            <p>Lesson {i + 1} :</p>
                                            <h3>{item?.title}</h3>
                                        </div>
                                    </div>
                                    <div className="card__right">
                                        <div className="card__navigate">
                                            <RightArrow size={30} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                            {/* <br /> */}


                            {
                                item?.assignment &&
                                (<>
                                    <div className="line"></div>
                                    {item.assignment.map((a, i) => (
                                        <motion.div className={`card violet`} key={item.title} whileTap={{ scale: .995 }}>
                                            <div className="card__left" >
                                                <div className="card__dec">
                                                    <div className="hidden" />
                                                </div>
                                                <div className="card__info">
                                                    <p>Assigment {i + 1}:</p>
                                                    <h3>{a?.heading}</h3>
                                                </div>
                                            </div>
                                            <div className="card__right">
                                                <div className="card__navigate">
                                                    <RightArrow size={30} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </>)
                            }

                            {
                                item?.test &&
                                (<>

                                    <div className="line"></div>
                                    {item.test.map((a, i) => (
                                        <div key={i}>
                                            <Link href={`/slide/test?no=${i + 1}&title=${a?.heading}&key=${a.id}`}>
                                                <motion.div className={`card main`} key={a.heading} whileTap={{ scale: .995 }}>
                                                    <div className="card__left" >
                                                        <div className="card__dec">
                                                            <div className="hidden" />
                                                        </div>
                                                        <div className="card__info">
                                                            <p>Test {i + 1}:</p>
                                                            <h3>{a?.heading}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="card__right">
                                                        <div className="card__navigate">
                                                            <RightArrow size={30} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        </div>
                                    ))}
                                </>)
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CourseStructue