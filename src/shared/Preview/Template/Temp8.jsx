import React, { useEffect, useState } from 'react'
import Temp2 from './Temp2'
import ReactPlayer from 'react-player'
import { getPreSignedUrl } from '../../../util/getPreSignedUrl'

const Temp8 = ({ data }) => {
    const [fileUrl, setFileUrl] = useState(null)

    useEffect(()=>{
    },[fileUrl])
    useEffect(() => {
        if (!data?.editor) {
            if (data.image_url) {
                getPreSignedUrl(data?.image_url).then(res => {
                    
                    setFileUrl(res)
                })
            } else {
                getPreSignedUrl(data?.url).then(res => {
                    
                    setFileUrl(res)
                })
            }
        } else {
            if (data.image_url) {
                
                setFileUrl(data.image_url)
            } else {
                
                setFileUrl(data.url)
            }
        }
    })

    return (
        <div className="temp8">
            <div className="left">
                <Temp2 data={data} style={{ alignItems: "flex-start" }} />
            </div>
            <div className="right">
                {
                    data?.image_url && (
                        <div className="image">
                            <img src={fileUrl} alt="" />
                        </div>
                    )
                }
                {
                    (data?.url && data?.url !== "") && (
                        <ReactPlayer url={fileUrl} controls width={ data?.allSlide ?  "100%" : "27rem"} height={ !data?.allSlide && "17rem"} />
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