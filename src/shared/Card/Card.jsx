import Image from "next/image"
import { motion } from "framer-motion"
import { TbNotebook } from "react-icons/tb"
import { useDispatch } from "react-redux"
import { clearCourse, setCourseData, setInitiated, setIsPreview } from "../../../redux/slices/util"
import { useRouter } from "next/router"
import { useGetCourseByIdMutation } from "../../../redux/slices/course"
import { useEffect, useState } from "react"
import { getPreSignedUrl } from "../../util/getPreSignedUrl"
import { useGetTotalLessonMutation } from "../../../redux/slices/slide"
import { MdDelete } from "react-icons/md"

const Card = ({ title, subtitle, duration, img, id,deleteHandler }) => {
    const dispatch = useDispatch()
    const [lesson, setLesson] = useState(0)
    const [run] = useGetCourseByIdMutation()

    const [imgUrl, setImgUrl] = useState("")

    const router = useRouter()

    const [getTotalLesson]=useGetTotalLessonMutation()

    useEffect(() => {
        getPreSignedUrl(img).then((res)=>{
            setImgUrl(res)
        })
        getTotalLesson(id).unwrap().then(res=>{
            console.log(res.data)
            setLesson(res.data)
        })

        return ()=>{
            getPreSignedUrl()
        }
    }, [])


    const onPreviewHandler = () => {
        dispatch(clearCourse())
        dispatch(setIsPreview({ is: true, id }))

        run(id).unwrap().then((res) => {
            dispatch(setCourseData({ ...res.data, image_url: imgUrl }))
            dispatch(setInitiated({ once: true, refactor: true }))
            router.push(`/addcourse?preview=true`)
        }).catch((err) => {
            console.log({ err })
        })
    }

    function renderString(string, len = 23) {
        if(!string) return ""
        if (string.length >= len) {
            return `${string.slice(0, len)}...`
        } else {
            return string
        }
    }

    return (
        <div className="mauka__builder-card">
            <div className="delete">
                <motion.div className="delete__circle" whileTap={{scale:.97}} onClick={()=>deleteHandler(id)}>
                    <MdDelete size={30} color="red" />
                </motion.div>
            </div>
            <img src={imgUrl} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <div className="mauka__builder-card__content">
                <div className="title">
                    <h2>{renderString(title)}</h2>
                    <p>{(subtitle)}</p>
                </div>
                <div className="info">
                    <div className="info__time">
                        <Image src={"/assets/clock.png"} width={20} height={20} objectFit="contain" />
                        <p>{duration} mins</p>
                    </div>
                    <div className="info__lesson">
                        <TbNotebook size={22} />
                        <p>{lesson} lessons</p>
                    </div>
                </div>
                <motion.div className="preview" whileTap={{ scale: .97 }} onClick={onPreviewHandler}>
                    <h3>Preview</h3>
                </motion.div>
            </div>
        </div>
    )
}

export default Card