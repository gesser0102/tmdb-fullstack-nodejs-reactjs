import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Modal, Stack, Chip, CircularProgress } from '@mui/material';
import { LoadingButton } from "@mui/lab";
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
    const { isOpen, mediaId, mediaType } = useSelector((state) => state.mediaModal);
    const [media, setMedia] = useState(null);
    const [genres, setGenres] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const { user, listFavorites } = useSelector((state) => state.user);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        setModalLoading(true);
        if (isOpen && mediaId) {
            setModalLoading(false);
            const fetchMedia = async () => {
                const { response } = await mediaApi.getDetail({ mediaType, mediaId });

                if (response) {
                    setMedia(response);
                    setGenres(response.genres.splice(0, 2));
                    setIsFavorite(listFavorites.some(fav => fav.mediaId === response.id.toString()));
                }
            };

            fetchMedia();

        } else {

            setMedia(null);
            setGenres([]);
            setIsFavorite(false);
        }
    }, [isOpen, mediaId, mediaType, listFavorites, dispatch]);

    const handleClose = () => {
        if (!favoriteLoading) {
            dispatch(closeModal());
            setModalLoading(true);
        }
    };

    const onFavoriteClick = async () => {
        if (!user) return dispatch(setAuthModalOpen(true));
        if (favoriteLoading) return;

        setFavoriteLoading(true);

        if (isFavorite) {
            await onRemoveFavorite();
            setModalLoading(false);
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
                setModalLoading(false);
            } else if (response) {
                dispatch(addFavorite(response));
                setIsFavorite(true);
                toast.success("Adicionado aos Favoritos");
            }
        }

        setFavoriteLoading(false);
    };

    const onRemoveFavorite = async () => {
        if (favoriteLoading) return;

        setModalLoading(false);
        const favorite = listFavorites.find(e => e.mediaId === media.id.toString());

        if (!favorite) {
            toast.error('Favorite not found.')
            return;
        }

        const { response, err } = await favoriteApi.remove({ favoriteId: favorite._id });

        if (err) {
            toast.error(err.message);
        } else if (response) {
            dispatch(removeFavorite(favorite));
            setIsFavorite(false);
            toast.success("Removido dos Favoritos");
        }

        setFavoriteLoading(false);
    };


    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={{
                position: "relative",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: '90%', sm: '80%', md: '70%' },
                backgroundColor: "background.paper",
                display: "flex",
                flexDirection: { xs: 'column', sm: 'row' },
                outline: "none"
            }}>
                {modalLoading ? (
                    <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                ) : (
                    media && (
                        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, width: '100%' }}>
                            <Box sx={{
                                width: { xs: '100%', sm: '100%', md: '50%' },
                                padding: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Box component="img" src={tmdbConfig.posterPath(media.poster_path || media.backdrop_path)} sx={{ width: { xs: '50%', sm: '100%' }, height: 'auto' }} />
                            </Box>
                            <Box sx={{ width: "100%", padding: 2 }}>
                                <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "2rem", fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                                    {media.title || media.name}
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                    <Container header="Sinopse:" >
                                        <Typography variant="body1" sx={{ ...muiConfigs.style.typoLines(5) }}>
                                            {media.overview}
                                        </Typography>
                                    </Container>
                                )}
                            </Box>
                            <Box sx={{ position: { xs: 'relative', sm: 'absolute' }, bottom: 16, right: 16, left: { xs: 10, sm: 'auto' } }}>
                                <LoadingButton
                                    variant="text"
                                    sx={{
                                        width: "max-content",
                                        "& .MuiButton-startIcon": { marginRight: "0" }
                                    }}
                                    size="large"
                                    startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                                    loadingPosition="start"
                                    loading={favoriteLoading}
                                    onClick={onFavoriteClick}
                                    disabled={favoriteLoading}
                                >
                                    {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                </LoadingButton>
                            </Box>
                        </Box>
                    )
                )}
            </Box>
        </Modal>

    );
};

export default MediaModal;

