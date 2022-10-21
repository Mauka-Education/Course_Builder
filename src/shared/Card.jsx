import Image from "next/image"
import { motion } from "framer-motion"
import { TbNotebook } from "react-icons/tb"
import { useDispatch } from "react-redux"
import { clearCourse, setCourseData, setInitiated, setIsPreview } from "../../redux/slices/util"
import { useRouter } from "next/router"
import { useGetCourseByIdMutation } from "../../redux/slices/course"

const Card = ({ title, subtitle, duration, lesson, img,id }) => {
    const dispatch = useDispatch()
    const [run]=useGetCourseByIdMutation()

    const router=useRouter()
    const onPreviewHandler=()=>{
        dispatch(clearCourse())
        dispatch(setIsPreview({is:true,id}))

        run(id).unwrap().then((res)=>{
            dispatch(setCourseData({id:res?.data._id,name:res?.data?.name,time_to_finish:res?.data?.time_to_finish,short_desc: res?.data?.short_desc ,image_url: res?.data.img_url}))
            dispatch(setInitiated({once:true,refactor:true}))
            router.push(`/addcourse?preview=true`)
        }).catch((err)=>{
            console.log({err})
        })
    }
    return (
        <div className="mauka__builder-card">
            <img src={img} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <div className="mauka__builder-card__content">
                <div className="title">
                    <h2>{title}</h2>
                    {/* <p>{subtitle.length>10 ? subtitle.slice(0,100) :{} }</p> */}
                    <p>{subtitle}</p>
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