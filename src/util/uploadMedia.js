import axios from "axios"

const url=process.env.NODE_ENV==="development" ? "http://localhost:3000/api/admin" : "https://lms.maukaeducation.com/api/admin"

export const uploadMediaToS3=async(file,token)=>{

    const formData=new FormData()

    formData.append("file",file)
    

    return new Promise((resolve,reject)=>{
        axios.post(`${url}/upload`,formData,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        }).then((res)=>{
            resolve({data: res.data})
        }).catch((err)=>{
            reject({err})
        })
    })
}