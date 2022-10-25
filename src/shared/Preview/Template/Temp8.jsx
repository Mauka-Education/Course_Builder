import React from 'react'
import Temp2 from './Temp2'
import ReactPlayer from 'react-player'

const Temp8 = ({ data }) => {
    return (
        <div className="temp8">
            <div className="left">
                <Temp2 data={data} style={{ alignItems: "flex-start" }} />
            </div>
            <div className="right">
                {
                    data?.image_url && (
                        <div className="image">
                            <img src={data?.image_url} alt="" />
                        </div>
                    )
                }
                {
                    (data?.url && data?.url !== "") && (
                        <ReactPlayer url={data?.url} controls width={ data?.allSlide ?  "100%" : "27rem"} height={ !data?.allSlide && "17rem"} />
                    )
                }
                {
                    (!data?.url && !data?.image_url ) && (
                        <div className="right__preview">
                            
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Temp8