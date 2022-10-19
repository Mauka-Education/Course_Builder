// import ReactPlayer from "react-player"

import ReactPlayer from "react-player"

const Temp7 = ({ data }) => {
    console.log(!data?.image_url , data?.video_url)
    return (
        <div className="temp1">
            <div className="title">
                <h1>{(data?.title?.length!==0 && data?.title)  ? data?.title  : "Title"}</h1>
            </div>
            {/* {
                (!data?.image_url && data?.video_url!==undefined) && (
                    <div className="temp1__preview">

                    </div>
                )
            } */}
            {
                data?.image_url && (
                    <div className="image">
                        <img src={data?.image_url} alt="" />
                    </div>
                )
            }
            {
                (data?.url && data?.url!=="") && (
                    <ReactPlayer url={data?.url} controls />
                )
            }
        </div>
    )
}

export default Temp7