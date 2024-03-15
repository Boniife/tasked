import React, { useState, useEffect, useContext } from "react";
import MkdSDK from "../utils/MkdSDK";
import { AuthContext } from "../authContext";

const AdminDashboardPage = () => {
  const { dispatch: authDispatch } = useContext(AuthContext);
  const [pageIndex, setPageIndex] = useState(0);
  const [videoData, setVideoData] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [pageIndex]);

  const fetchData = async () => {
    try {
      const sdk = new MkdSDK();
      sdk.setTable("video");
      const response = await sdk.callRestAPI({ payload: {}, page: pageIndex + 1, limit: pageSize }, "PAGINATE");
      if (response.error) {
        throw new Error("Error fetching data");
      }
      setVideoData(response.list);
      console.log(response)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClickNext = () => {
    setPageIndex((prevIndex) => prevIndex + 1);
  };

  const handleClickPrevious = () => {
    if (pageIndex > 0) {
      setPageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleLogout = () => {
    const userData = localStorage.getItem("test-user");
    const user = JSON.parse(userData)
    console.log(user)
    window.location.href = "/" + user?.role + "/login";
    authDispatch({ type: "LOGOUT" });
  };

  return (
    <div className="bg-black h-[100%] mt-0 px-28">
      <div className="flex justify-between mt-3">
        <div>
          <h1 className="text-xl font-bold text-white">APP</h1>
        </div>
        <div className="flex items-center" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <div className="bg-green-400 p-2 rounded-full">
            <h1 className="text-xl font-bold">Logout</h1>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-4 py-2 text-white mt-16 mb-10 mx-5">
        <h1 className="text-xl font-bold">Today's Leaderboard</h1>
        <p className="bg-gray-600 p-4 rounded-lg">30 May 2022 <span className="bg-green-400 rounded-full p-2">Submission Open</span> 11:34</p>
      </div>
      <div>
        {videoData.map((video) => (
          <div key={video.id} className="bg-black text-white p-4 mb-4 rounded-md border flex gap-10">
            <p>{video.id}</p>
            <h2 className="font-bold max-w-[30%]">{video.title}</h2>
            <p className="text-green-200"> {video.username}</p>
            <div className=" ml-auto">
            <p className=""> {video.like}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        {pageIndex > 0 && (
          <button onClick={handleClickPrevious} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 mr-2">
            Previous
          </button>
        )}
        {videoData.length === pageSize && (
          <button onClick={handleClickNext} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
