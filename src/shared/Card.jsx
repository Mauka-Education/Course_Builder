import Image from "next/image"
import { motion } from "framer-motion"
import {TbNotebook} from "react-icons/tb"

const Card = ({title,subtitle,duration,lesson,img}) => {
    
  return (
    <div className="mauka__builder-card">
        <img src={img} style={{width:"100%",height:"200px",objectFit:"cover"}} />
        <div className="mauka__builder-card__content">
            <div className="title">
                <h2>{title }</h2>
                {/* <p>{subtitle.length>10 ? subtitle.slice(0,100) :{} }</p> */}
                <p>{subtitle}</p>
            </div>
            <div className="info">
                <div className="info__time">
                    <Image src={"/assets/clock.png"} width={20} height={20} objectFit="contain" />
                    <p>{duration} mins</p>
                </div>
                <div className="info__lesson">
                    <TbNotebook size={22}  />
                    <p>{lesson} lessons</p>
                </div>
            </div>
            <motion.div className="preview" whileTap={{scale:.97}}>
                <h3>Preview</h3>
            </motion.div>
        </div>
    </div>
  )
}

export default Card