import React from 'react'
import AllSlide from "./AllSlide"
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AiOutlinePlus } from "react-icons/ai"

const SideNav = ({ id, type }) => {
    const [showNav, setShowNav] = useState(false)


    return (
        <>
            {
                !showNav && (
                    <motion.div className='course__builder-sidenav__btn' whileTap={{ scale: .97, rotate: "90deg" }} initial={{ rotate: "90deg" }} onClick={() => setShowNav(true)}>
                        <p>All Slides</p>
                    </motion.div>
                )
            }

            <AnimatePresence>

                {
                    showNav && (
                        <div style={{width:"100%",background:"red"}}>
                            <motion.div className='course__builder-sidenav' initial={{ width: 0, opacity: 0 }} exit={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} transition={{ duration: 1.5 }}>
                                <div className="close" style={{ position: "relative", width: "100%" }}>
                                    <motion.div className='course__builder-sidenav__btn close' whileTap={{ scale: .97, rotate: 0 }} initial={{ rotate: 0 }} onClick={() => setShowNav(false)}>
                                        <AiOutlinePlus style={{ rotate: "45deg", marginRight: ".5rem", alignItems: "initial" }} size={20} />
                                        <p>Close</p>
                                    </motion.div>
                                </div>

                                <AllSlide id={id} type={type} sidenav={true} />
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence>
        </>
    )
}

export default SideNav