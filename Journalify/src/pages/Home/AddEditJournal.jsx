import React, { useState } from "react";
import { MdAdd, MdClose, MdUpdate, MdDeleteOutline} from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import axios from "axios";
import { BASE_API } from "../../utils/constants";
import moment from "moment";
import uploadImage from "../../utils/UploadImage";

const AddEditJournal = ({
  journalInfo,
  type,
  onClose,
  getAllJournals,
}) => {
  const [title, setTitle] = useState(journalInfo?.title || "");
  const [storyImg, setStoryImg] = useState(journalInfo?.imageUrl || null);
  const [story, setStory] = useState(journalInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(journalInfo?.visitedLocation || []);
  const [visitedDate, setVisitedDate] = useState(journalInfo?.visitedDate || null);

  const [error, setError] = useState("");

  const createNewJournal = async () => {

    try {
      let imageUrl = "";
      if(storyImg) {
        const imageUploadResponse = await uploadImage(storyImg);
        imageUrl = imageUploadResponse.imageUrl || "";
      }
      console.log({title,story,imageUrl,visitedDate,visitedLocation});
      const response = await axios.post(
        `${BASE_API}/journal/create`,
        {
          title,
          story,
          imageUrl: imageUrl || "",
          visitedLocation,
          visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        },
        {
          withCredentials: true,
        }
      );
      
  
      if (response.data && response.data.story) {
        console.log("Story added successfully!");
        getAllJournals();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const updateJournal = async () => {
    try {
      let updateData = {
        title,
        story,
        imageUrl: journalInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
      };
  
      if (typeof storyImg === "object") {
        const imageUploadResponse = await uploadImage(storyImg);
        const newImageUrl = imageUploadResponse?.imageUrl || "";
        updateData.imageUrl = newImageUrl;
      }
  
      const response = await axios.put(
        `${BASE_API}/journal/update/${journalInfo._id}`,
        updateData,
        { withCredentials: true }
      );
  
      if (response.data && response.data.story) {
        console.log("Story updated successfully!");
        getAllJournals();
        onClose();
      }
    } catch (error) {
      console.error("Error in updateJournal:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Unexpected Error Occurred.");
    }
  };
  

  const handleAddorUpdateClick = () => {
    console.log("Data",{title,story,storyImg,visitedDate,visitedLocation});
    if(!title){
      setError("Please enter Title.");
      return;
    }
    if(!story){
      setError("Please enter your journal.");
      return;
    }
    setError("");
    if(type=== "edit"){
      updateJournal();
    } else {
      createNewJournal();
    }
  };

  const handleDeleteStoryImage = async () => {
    try {
      const deleteImageResponse = await axios.delete(`${BASE_API}/journal/deleteImage`, {
        params: {
          imageUrl: journalInfo.imageUrl,
        },
      });
  
      if (deleteImageResponse.data) {
        const journalId = journalInfo._id;
  
        const postData = {
          title,
          story,
          visitedLocation,
          visitedDate: moment().valueOf(),
          imageUrl: "",
        };
  
        const response = await axios.put(`${BASE_API}/journal/update/${journalId}`, postData);
  
        if (response.data) {
          setStoryImg(null);
        }
      }
    } catch (error) {
      console.error("Error deleting story image:", error);
    }
  };
  

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
          {type === "add" ? (
            <button onClick={handleAddorUpdateClick} className="btn-small">
              <MdAdd className="text-lg"/>ADD STORY
            </button>
            ) : (
            <button className="btn-small" onClick={handleAddorUpdateClick}>
              <MdUpdate className="text-lg"/>UPDATE STORY
            </button>
          )}


            <button onClick={onClose} className="">
              <MdClose className="text-xl text-slate-400"/>
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}

        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="A Day to remember..."
          value={title}
          onChange={({target})=>{setTitle(target.value)}}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate}/>
          </div>

          <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImage={handleDeleteStoryImage}></ImageSelector>

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded"
              placeholder="Story"
              rows={10}
              value={story}
              onChange={({ target }) => setStory(target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditJournal;
