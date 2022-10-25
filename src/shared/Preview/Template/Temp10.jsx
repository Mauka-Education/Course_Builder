import React from 'react'
import ReactPlayer from 'react-player'
import Temp4 from './Temp4'

const Temp10 = ({ data }) => {
    return (
        <div className="temp8">
            <div className="left">
                <Temp4 data={data} />
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

export default Temp10