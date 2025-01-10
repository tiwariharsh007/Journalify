import axios from "axios";
import { BASE_API } from "./constants";
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post(`${BASE_API}/journal/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading the image:', error);
    throw error;
  }
};

export default uploadImage;
