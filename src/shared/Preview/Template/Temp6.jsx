import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";


// import required modules
import { Navigation, Pagination } from "swiper";
import { useState,useEffect } from "react";
import { getPreSignedUrl } from "../../../util/getPreSignedUrl";

const Temp5 = ({ data }) => {
  const [filesUrl, setFilesUrl] = useState([])

  if (!data?.images) {
    return null
  }

  useEffect(() => {
    if (data?.images) {
      data.images.forEach((item) => {
        getPreSignedUrl(item).then(res => {
          setFilesUrl(prev=>[...prev,res])
        })
      })
    }
  },[])

  console.log({filesUrl})
  return (
    <div className="temp5">
      <div className="slider">
        <Swiper navigation={true} modules={[Navigation, Pagination]} className="mySwiper" spaceBetween={30}>
          {
            data.images.length === 0 && (
              <>
                {
                  Array.from(Array(2).keys()).map(item => (
                    <SwiperSlide key={item}>
                      <div className="slider__preview">

                      </div>
                    </SwiperSlide>
                  ))
                }
              </>
            )
          }
          {filesUrl?.map((item, index) => (
            <SwiperSlide key={index}>
              <img src={item?.url ? item?.url : item} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Temp5