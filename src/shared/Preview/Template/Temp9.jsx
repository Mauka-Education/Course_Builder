import React from 'react'
import ReactPlayer from 'react-player'
import Temp3 from './Temp3'

const Temp9 = ({ data }) => {
    console.log({data})
    return (
        <div className="temp8">
            <div className="left">
                <Temp3 data={data} />
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
                        <ReactPlayer url={data?.url} controls width={"27rem"} height={"17rem"} />
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

export default Temp9