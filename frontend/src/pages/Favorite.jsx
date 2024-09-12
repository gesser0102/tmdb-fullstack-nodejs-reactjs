import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MediaItem from "../components/common/MediaItem";
import { muiConfigs } from "../configs/styleConfigs";
import favoriteApi from "../api/modules/favoriteModule";
import { removeFavorite } from "../redux/userSlice";



const FavoriteItem = ({ media, onRemoved }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, err } = await favoriteApi.remove({ favoriteId: media._id });
    setOnRequest(false);

    if (err) {
      toast.error(err.message);
    } else if (response) {
      toast.success("Removido com sucesso!");
      dispatch(removeFavorite({ mediaId: media.mediaId }));
      onRemoved(media._id);
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      '&:hover .removeButton': {
        opacity: 1, // Mostrar o botão no hover
        transform: 'translateY(0)' // Final da animação
      }
    }}>
      <MediaItem  media={media} mediaType={media.mediaType} />
      <LoadingButton
        className="removeButton"
        fullWidth
        variant="contained"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          marginTop: 2,
          opacity: 0, // Escondido inicialmente
          transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
          transform: 'translateY(-100%)' // Começo da animação
        }}
        startIcon={<DeleteIcon />}
        loadingPosition="start"
        loading={onRequest}
        onClick={onRemove}
      >
        remover
      </LoadingButton>
    </Box>
  );
};


export const Favorites = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const favoritesNew = useSelector(state => state.user.listFavorites);

  const dispatch = useDispatch();

  const skip = 8;

  useEffect(() => {
    const getFavorites = async () => {

      const { response, err } = await favoriteApi.getList();



      if (err) toast.error(err.message);
      if (response) {
        setCount(response.length);
        setMedias([...response]);
        setFilteredMedias([...response].splice(0, skip));
      }
    };

    getFavorites();
  }, [dispatch, skip, favoritesNew]);



  const onLoadMore = () => {

    const newFilteredMedias = [...filteredMedias, ...medias.slice(page * skip, (page + 1) * skip)];
    setFilteredMedias(newFilteredMedias);
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    const getFavorites = async () => {
      const { response, err } = await favoriteApi.getList();

      if (err) toast.error(err.message);
      if (response) {
        setCount(response.length);
        setMedias(response);
        setFilteredMedias(response.slice(0, skip));
      }
    };

    getFavorites();
  }, [dispatch, skip]);


  const onRemoved = (id) => {

    const updatedMedias = medias.filter(item => item._id !== id);

    setMedias(updatedMedias);
    setFilteredMedias(updatedMedias.slice(0, page * skip));

    setCount(prevCount => prevCount - 1);
  };

  return (
    <Box sx={{ ...muiConfigs.style.mainContent, mt: '5rem', backgroundColor: "#111" }}>
      <Box sx={{ my: 2 }}>
        <Box component="h2" sx={{ mb: 2 }}>
          {`Meus Filmes Favoritos (${count})`}
        </Box>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: '-8px' // Compensar o espaçamento entre os itens
        }}>
          {filteredMedias.map((media, index) => (
            <Box key={index} sx={{
              p: '8px', // Espaçamento em torno de cada item para criar o "gap"
              width: { xs: '50%', sm: '33.33%', md: '25%', margin: "0 auto" } // Responsividade
            }}>
              <FavoriteItem media={media} onRemoved={onRemoved} />
            </Box>
          ))}
        </Box>
        {filteredMedias.length < medias.length && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onLoadMore}>Carregar mais</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

