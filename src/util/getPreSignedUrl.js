import axios from "axios";

const HOST_URL=process.env.NODE_ENV==="development" ? "http://localhost:3000/api" : "https://lms.maukaeducation.com/api"

const getPreSignedUrl = async(url) => {
  const isS3Url = url?.includes(
    "https://mauka-user-videos.s3.ap-south-1.amazonaws.com/"
  );

  if (isS3Url) {
    const {data} =await axios.get(`${HOST_URL}/getmedia/${url?.slice(54)}`)
    return data.data
  } else {
    return url
  }
};


export {getPreSignedUrl}
