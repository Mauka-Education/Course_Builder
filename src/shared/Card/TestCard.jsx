import React from 'react'
import { MdOutlineKeyboardArrowRight as RightArrow } from "react-icons/md"
import {motion} from "framer-motion"

const TestCard = ({className,index,heading,handler,key:tkey,style}) => {
    return (
        <motion.div className={`card ${className}`} key={tkey} whileTap={{ scale: .995 }} onClick={ handler &&    handler} style={{...style}}>
            <div className="card__left" >
                <div className="card__dec">
                    <div className="hidden" />
                </div>
                <div className="card__info">
                    <p>Step {index}:</p>
                    <h3>{heading}</h3>
                </div>
            </div>
            <div className="card__right">
                <div className="card__navigate">
                    <RightArrow size={30} />
                </div>
            </div>
        </motion.div>
    )
}

export default TestCard