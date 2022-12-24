import {useEffect,useState} from 'react'
import ReactPlayer from 'react-player'
import { getPreSignedUrl } from '../../../util/getPreSignedUrl'
import Temp1 from './Temp1'

const Temp10 = ({ data,all }) => {
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
        <div className="temp8">
            <div className="left">
                <Temp1 data={data} all={all} />
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

export default Temp10