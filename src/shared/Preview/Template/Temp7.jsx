// import ReactPlayer from "react-player"

import { useState } from "react"
import { useEffect } from "react"
import ReactPlayer from "react-player"
import { getPreSignedUrl } from "../../../util/getPreSignedUrl"

const Temp7 = ({ data }) => {
    const [fileUrl, setFileUrl] = useState(null)
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
        <div className="temp1">
            <div className="title">
                <h1>{(data?.title?.length !== 0 && data?.title) ? data?.title : "Title"}</h1>
            </div>
            {
                (!data?.image_url && !data?.url) && (
                    <div className="temp1__preview">

                    </div>
                )
            }
            {
                data?.image_url && (
                    <div className="image">
                        <img src={fileUrl} alt="" />
                    </div>
                )
            }
            {
                (data?.url && data?.url !== "") && (
                    <ReactPlayer url={fileUrl} controls width={data?.allSlide && "100%"} height={data?.allSlide && "15rem"} />
                )
            }

        </div>
    )
}

export default Temp7