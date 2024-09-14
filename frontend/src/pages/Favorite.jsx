import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share"; // Importa o ícone de compartilhamento
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Ícone para copiar
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MediaItem from "../components/common/MediaItem";
import { muiConfigs } from "../configs/styleConfigs";
import favoriteApi from "../api/modules/favoriteModule";
import userApi from "../api/modules/userModule"; // Importa o módulo userApi
import { removeFavorite } from "../redux/userSlice";
import { routesGen } from "../routes/routes"
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
        Remover
      </LoadingButton>
    </Box>
  );
};

export const Favorites = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [shareLink, setShareLink] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
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

  const onRemoved = (id) => {

    const updatedMedias = medias.filter(item => item._id !== id);

    setMedias(updatedMedias);
    setFilteredMedias(updatedMedias.slice(0, page * skip));

    setCount(prevCount => prevCount - 1);
  };

  // Função para gerar o link de compartilhamento
  const handleShareFavorites = async () => {
    setGeneratingLink(true);
    const { response, err } = await userApi.generateShareLink();
    setGeneratingLink(false);

    if (err) {
      toast.error(err.message);
    } else if (response) {
      const shareToken = response.shareToken;
      const link = `${window.location.origin}${routesGen.sharedFavorites(shareToken)}`;
      setShareLink(link);
      setOpenDialog(true);
    }
  };

  // Função para copiar o link para a área de transferência
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <Box sx={{ ...muiConfigs.style.mainContent, mt: '5rem', backgroundColor: "#111" }}>
      <Box sx={{ my: 2 }}>
        {/* Cabeçalho com o título e o botão de compartilhar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box component="h2">
            {`Meus Filmes Favoritos (${count})`}
          </Box>
          <LoadingButton
            variant="contained"
            startIcon={<ShareIcon />}
            loading={generatingLink}
            onClick={handleShareFavorites}
          >
            Compartilhar Favoritos
          </LoadingButton>
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

      {/* Diálogo para exibir o link de compartilhamento */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Link de Compartilhamento</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={shareLink}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button startIcon={<ContentCopyIcon />} onClick={handleCopyLink}>
            Copiar Link
          </Button>
          <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Favorites;
