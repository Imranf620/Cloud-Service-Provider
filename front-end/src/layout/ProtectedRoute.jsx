import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchMyProfile } from "../features/userSlice";
import Loader from "../pages/Loader/Loader";

const ProtectedRoute = () => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      const result = await dispatch(fetchMyProfile());
      console.log("user", result.payload.data.user);
      setUser(result.payload.data.user);
      setLoading(false); 
    };

    getUser();
  }, [dispatch]);

  if (loading) {
    return <Loader/>; 
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
