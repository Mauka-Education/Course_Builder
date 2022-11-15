import React, { useEffect, useState } from 'react'
import { getPreSignedUrl } from '../../../util/getPreSignedUrl'
import ReactPlayer from 'react-player'
import Temp3 from './Temp3'

const Temp9 = ({ data }) => {
    const [fileUrl, setFileUrl] = useState(null)

    // useEffect(()=>{
        
    // },[fileUrl])
    useEffect(() => {
        if (!data?.editor) {
            if (data.image_url) {
                getPreSignedUrl(data?.image_url).then(res => {
                    console.log({res})
                    setFileUrl(res)
                })
            } else {
                getPreSignedUrl(data?.url).then(res => {
                    console.log({res})
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

    console.log({data},"")
    return (
        <div className="temp8">
            <div className="left">
                <Temp3 data={data} />
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

export default Temp9