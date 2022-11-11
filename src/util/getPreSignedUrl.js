import axios from "axios";

const getPreSignedUrl = async(url) => {
  const isS3Url = url?.includes(
    "https://mauka-user-videos.s3.ap-south-1.amazonaws.com/"
  );

  if (isS3Url) {
    const {data} =await axios.get(`http://localhost:3000/api/getmedia/${url?.slice(54)}`)
    return data.data
  } else {
    return url
  }
};


export {getPreSignedUrl}
