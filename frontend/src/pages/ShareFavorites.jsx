import { useParams } from "react-router-dom";
import publicClient from "../api/client/publicClient";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MediaItem from "../components/common/MediaItem";
import { muiConfigs } from "../configs/styleConfigs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { enableBtnHide, disableBtnHide } from "../redux/mediaModalSlice"; // Importações atualizadas

const SharedFavorites = () => {
  const { shareToken } = useParams();
  const [medias, setMedias] = useState([]);
  const [user, setUser] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(enableBtnHide());

    return () => {
      dispatch(disableBtnHide());
    };
  }, [dispatch]);

  useEffect(() => {
    const getSharedFavorites = async () => {
      try {
        const response = await publicClient.get(`/user/favorites/share/${shareToken}`);
        console.log(response);
        setMedias(response.favorites);
        setUser(response.user || response.username);
      } catch (err) {
        toast.error("Não foi possível carregar os favoritos compartilhados.");
      }
    };
    getSharedFavorites();
  }, [shareToken]);

  return (
    <Box sx={{ ...muiConfigs.style.mainContent, mt: '5rem', backgroundColor: "#111" }}>
      <Box sx={{ my: 2 }}>
        <Box component="h2" sx={{ mb: 2 }}>
          {`Favoritos Compartilhados de ${user}`}
        </Box>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '-8px'
        }}>
          {medias.map((media) => (
            <Box key={media.id} sx={{
              p: '8px',
              width: { xs: '50%', sm: '33.33%', md: '25%' },
              margin: "0 auto"
            }}>
              <MediaItem media={media} mediaType={media.mediaType} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SharedFavorites;
