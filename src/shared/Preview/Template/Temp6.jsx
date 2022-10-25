import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";


// import required modules
import { Navigation, Pagination } from "swiper";

const Temp5 = ({ data }) => {
  if (!data?.images) {
    console.log(data)
    return null
  }
  console.log({ data })

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
          {data?.images?.map((item,index) => (
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