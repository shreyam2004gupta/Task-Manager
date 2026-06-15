import axiosInstance from "./axiosinstance";

const uploadImage = async(imageFile)=>{
    const formData = new formData()

    formData.append("iamge",imageFile)
    try{
     const response = await axiosInstance.post("/auth/upload-image",formData,{
        headers:{
            "Content-Type" : "multipart/form-data",
        },
     })
     return response.data
    }catch(error){
        console.log(`Error uploading image: ${error.message}`);
        throw error
    }
}

export default uploadImage