import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { data, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_API } from '../../utils/constants';
import JournalCard from '../../components/Cards/JournalCard';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditJournal from './AddEditJournal';
import ViewJournal from './ViewJournal';
import EmptyCard from '../../components/Cards/EmptyCard';

const Home = () => {
  const navigate = useNavigate();
  const [ userInfo, steUserInfo] = useState(null);
  const [allJournals, setAllJournals] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const [openEditModal, setOpenEditModal] = useState({
    isShown : false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown : false,
    data : null,
  });

  const getUserInfo = async() => {
    try{
      const response = await axios.get(`${BASE_API}/auth/me`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if(response.data && response.data.user){
        steUserInfo(response.data.user);
      }
    } catch(error){
      if(error.response.status === 401){
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  const getAllJournals = async () => {
    try{
      const response = await axios.get(`${BASE_API}/journal/getallJournal`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if(response.data && response.data.allJournals){
        setAllJournals(response.data.allJournals);
      }
    } catch(error) {
      console.log("An unexpected error occured. Please try again."); 
    }
  }

  const deleteJournal = async (data) => {
    const journalId = data._id;
    try{
      const response = await axios.delete(`${BASE_API}/journal/delete/${journalId}`, {
        withCredentials: true
    });
    

      if(response.data && !response.data.error) {
        getAllJournals();
        setOpenViewModal((prev) => ({ ...prev, isShown: false}))
      }
    } catch(error) {
      console.log("Unexpexted error occured");
    }
  }

  const handleEdit = (data) => {
    setOpenEditModal({isShown: true, type: "edit", data: data}); 
  }

  const handleViewJournal = (item) => {
    setOpenViewModal({ isShown: true, data: item });
  };
  
  const onSearchJournal = async (query) => {
    try {
      const response = await axios.get(
        `${BASE_API}/journal/search`,
        {
          params: { query },
          withCredentials: true,
        }
      );
  
      if (response.data && response.data.journals) {
        setFilterType("search");
        setAllJournals(response.data.journals);
      }
    } catch (error) {
      console.error("Unexpected error occurred:", error);
    }
  };
  

  const handleClearSearch = () => {
    setFilterType("");
    getAllJournals();
  }

  const updateIsFavourite = async (journalData) => {
    const journalId = journalData._id;
  
    try {
      const response = await axios.put(
        `${BASE_API}/journal/favourite/${journalId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      
      if (response.data && response.status === 200) {
        console.log('Updated:', response.data);
        getAllJournals();
      }
    } catch (error) {
      console.log('Error occurred:', error.message);
    }
  };

  useEffect( () => {
    getAllJournals();
    getUserInfo();
  },[])

  return (
    <>
    <div>
      <Navbar
      userInfo={userInfo}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearchNote={onSearchJournal} 
      handleClearSearch={handleClearSearch}/>

      <div>
        <div className="container mx-auto py-10">
          <div className="flex gap-7">
            <div className="flex-1">
              {allJournals.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {allJournals.map((item) => {
                    return (
                      <JournalCard
                      key={item.id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      onEdit={()=> handleEdit(item)}
                      onClick={() => handleViewJournal(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                      />
                    );
                  })
                  }
                </div>
              ):<EmptyCard message={`Nothing to show here. Start by adding some items!`}/>
              }
            </div>
          </div>
        </div>

        <div className="w-[320px]">
          <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">

          </div>
        </div>
      </div>

    </div>

    <Modal
      isOpen={openEditModal.isShown}
      onRequestClose={() => openEditModal.setShown(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 999,
        },
      }}
      appElement={document.getElementById("root")}
      className="model-box"
    >
      <AddEditJournal
      type={openEditModal.type}
      journalInfo={openEditModal.data}
      onClose={() => {
        setOpenEditModal({isShown: false, type: "add", data: null});
      }}
      getAllJournals={getAllJournals}
      />
    </Modal>

    <Modal
      isOpen={openViewModal.isShown}
      onRequestClose={() => {}}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 999,
        },
      }}
      appElement={document.getElementById("root")}
      className="model-box"
    >
      <ViewJournal
      storyInfo={openViewModal.data || null}
      onClose={() => {
        setOpenViewModal((prev) => ({ ...prev, isShown: false}))
      }}
      onEditClick={() => {
        setOpenViewModal((prev) => ({ ...prev, isShown: false}));
        handleEdit(openViewModal.data || null)
      }}
      onDeleteClick={() => {
        deleteJournal(openViewModal.data || null)
      }}
      />
    </Modal>

    <button className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
    onClick={() => {
      setOpenEditModal({
        isShown: true,
        type: "add",
        data: null
      });
    }}>
      <MdAdd className="text-[32px] text-white " />
    </button>
    </>
  )
}

export default Home
