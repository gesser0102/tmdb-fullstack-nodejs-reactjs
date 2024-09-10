import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LoadingProgress } from "../common/Loading";
import { Footer } from "../common/Footer";
import { NavBar } from "../common/Navbar";
import  LoginModal from "../common/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import userApi from "../../api/modules/userModule";
import favoriteApi from "../../api/modules/favoriteModule";
import { setUser, setListFavorites } from "../../redux/userSlice";
import MediaModal from "../common/MediaModal";

export const MainLayout = () => {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      const {response, err } = await userApi.getInfo();
      if (response) {
        dispatch(setUser(response));
      } else if (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList();

      if (response) dispatch(setListFavorites(response));
      if (err) toast.error(err.message);
    };

    if (user) getFavorites();
    if (!user) dispatch(setListFavorites([]));
  }, [user, dispatch]);
  
  return (
    <>
    <LoadingProgress/>

    <LoginModal/>

    <MediaModal/>
    <Box display={"flex"} minHeight={"100vh"}>

      <Box component={"main"} flexGrow={1} overflow={"hidden"} minHeight={"100vh"}>
        <NavBar/>
        
      <Outlet/>
        
      </Box>
    
    </Box>
    <Footer/>
    </>
  )
}