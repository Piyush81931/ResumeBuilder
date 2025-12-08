import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Preview from "./pages/Preview";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeAnalyze from "./pages/ResumeAnalyze"; 
import { useDispatch } from "react-redux";
import api from "./configues/api";
import { login, setLoading } from "./fetaures/authSlice";
import {Toaster} from 'react-hot-toast'
import JobMatching from "./pages/JobMatching";

const App = () => {
  const dispatch = useDispatch();
  const getUserData = async ()=>{
    const token = localStorage.getItem('token')
    try {
      if(token){
      const {data} = await api.get('/api/users/data',{headers:{Authorization:token}})
      if(data.user){
        dispatch(login({token,user:data.user}))
      }
      dispatch(setLoading(false))
    }else{
      dispatch(setLoading(false))
    }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }
  useEffect(()=>{
    getUserData();
  },[])
  return (
    <>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
           <Route path="analyze/:resumeId" element={<ResumeAnalyze />} />
           <Route path="job-match/:resumeId" element={<JobMatching />} /> 
        </Route>
        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
};

export default App;
