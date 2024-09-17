import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Modal, Stack, Chip, CircularProgress, IconButton } from '@mui/material';
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { closeModal } from '../../redux/mediaModalSlice';
import mediaApi from '../../api/modules/mediaModule';
import tmdbConfig from '../../api/services/tmdbService';
import FilmRate from './FilmRate';
import { muiConfigs } from '../../configs/styleConfigs';
import { Container } from './Container';
import { toast } from 'react-toastify';
import favoriteApi from '../../api/modules/favoriteModule';
import { addFavorite, removeFavorite } from "../../redux/userSlice";
import { setAuthModalOpen } from '../../redux/loginModalSlice';

const MediaModal = () => {
    const dispatch = useDispatch();
    const { isOpen, mediaId, mediaType, btnHide } = useSelector((state) => state.mediaModal);
    const { user, listFavorites } = useSelector((state) => state.user);
    const [media, setMedia] = useState(null);
    const [genres, setGenres] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false); // Inicializa como false

    useEffect(() => {
        if (isOpen && mediaId) {
            setModalLoading(true); // Inicia o carregamento ao abrir o modal
            const fetchMedia = async () => {
                const { response } = await mediaApi.getDetail({ mediaType, mediaId });
                if (response) {
                    setMedia(response);
                    setGenres(response.genres.splice(0, 2));
                }
                setModalLoading(false); // Finaliza o carregamento após receber os dados
            };
            fetchMedia();
        } else {
            setMedia(null);
            setGenres([]);
            setIsFavorite(false);
            setModalLoading(false); // Garante que o estado seja false quando o modal estiver fechado
        }
    }, [isOpen, mediaId, mediaType]);

    useEffect(() => {
        if (media && listFavorites) {
            setIsFavorite(listFavorites.some(fav => fav.mediaId === media.id.toString()));
        }
    }, [media, listFavorites]);

    const handleClose = () => {
        if (!favoriteLoading) {
            dispatch(closeModal());
            setModalLoading(false); // Reseta o estado de carregamento ao fechar o modal
        }
    };

    const toggleFavorite = async () => {
        if (!user) return dispatch(setAuthModalOpen(true));
        if (favoriteLoading) return;

        setFavoriteLoading(true);

        if (isFavorite) {
            const favorite = listFavorites.find(e => e.mediaId === media.id.toString());
            if (!favorite) {
                toast.error('Favorito não encontrado.');
                setFavoriteLoading(false);
                return;
            }

            const { response, err } = await favoriteApi.remove({ favoriteId: favorite._id });
            if (err) {
                toast.error(err.message);
            } else if (response) {
                dispatch(removeFavorite(favorite));
                toast.success("Removido dos Favoritos");
            }
        } else {
            const body = {
                mediaId: media.id,
                mediaTitle: media.title || media.name,
                mediaType,
                mediaPoster: media.poster_path,
                mediaRate: media.vote_average
            };

            const { response, err } = await favoriteApi.add(body);
            if (err) {
                toast.error(err.message);
            } else if (response) {
                dispatch(addFavorite(response));
                toast.success("Adicionado aos Favoritos");
            }
        }
        setFavoriteLoading(false);
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            {modalLoading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '80%', md: '70%' },
                    maxHeight: '90vh',
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    overflowY: 'auto',
                    outline: 'none'
                }}>
                    <IconButton
                        sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.500' }}
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    {media && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            width: '100%',
                            overflow: 'auto'
                        }}>
                            <Box sx={{
                                width: { xs: '100%', sm: '100%', md: '50%' },
                                padding: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Box
                                    component="img"
                                    src={tmdbConfig.posterPath(media.poster_path || media.backdrop_path)}
                                    sx={{ width: { xs: '50%', sm: '100%' }, height: 'auto' }}
                                />
                            </Box>
                            <Box sx={{ width: '100%', padding: 2 }}>
                                <Typography variant="h4" sx={{
                                    textAlign: 'center',
                                    marginBottom: '2rem',
                                    fontSize: { xs: '1.5rem', sm: '2rem' }
                                }}>
                                    {media.title || media.name}
                                </Typography>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1}
                                    sx={{
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Stack direction="row" spacing={1}>
                                        {genres.map((genre, index) => (
                                            <Chip
                                                label={genre.name}
                                                variant="outlined"
                                                key={index}
                                            />
                                        ))}
                                    </Stack>
                                    <Box>
                                        <Typography variant="body1" sx={{ ...muiConfigs.style.typoLines(1) }}>
                                            {media.release_date ? media.release_date.split("-")[0] :
                                                media.first_air_date ? media.first_air_date.split("-")[0] : "N/A"}
                                        </Typography>
                                    </Box>
                                    <FilmRate value={media.vote_average} />
                                </Stack>
                                {media.overview && (
                                    <Container header="Sinopse:">
                                        <Typography variant="body1" sx={{ ...muiConfigs.style.typoLines(5) }}>
                                            {media.overview}
                                        </Typography>
                                    </Container>
                                )}
                            </Box>
                            {btnHide === false && (
                                <Box sx={{
                                    position: { xs: 'relative', sm: 'absolute' },
                                    bottom: 16,
                                    right: 16,
                                    left: { xs: 10, sm: 'auto' }
                                }}>
                                    <LoadingButton
                                        variant="text"
                                        sx={{
                                            width: 'max-content',
                                            '& .MuiButton-startIcon': { marginRight: '0' }
                                        }}
                                        size="large"
                                        startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                                        loadingPosition="start"
                                        loading={favoriteLoading}
                                        onClick={toggleFavorite}
                                        disabled={favoriteLoading}
                                    >
                                        {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                    </LoadingButton>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Modal>
    );
};

export default MediaModal;
