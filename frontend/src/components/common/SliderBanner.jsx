import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { setGlobalLoading } from "../../redux/globalLoadingSlice";
import tmdbConfig from "../../api/services/tmdbService";
import mediaApi from "../../api/modules/mediaModule";
import { SearchBox } from './SearchBox';

const SliderBanner = ({ mediaType, mediaCategory }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMedias = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory,
        page: 1
      });

      dispatch(setGlobalLoading(false));
      if (response) setMovies(response.results);
      if (err) toast.error(err.message);
    };

    getMedias();
  }, [mediaType, mediaCategory, dispatch]);

  return (
    <Box
      sx={{
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "30%",
          pointerEvents: "none"
        }
      }}
    >
      <Swiper
        grabCursor={false}
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        loop={true}
        style={{ width: "100%", height: "100vh" }}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: "relative", 
                paddingTop: {
                  xs: "230%",
                  sm: "150%",
                  md: "100%",
                  lg: "80%",
                },
                backgroundPosition: "top",
                backgroundSize: "cover",
                backgroundImage: `url(${tmdbConfig.backdropPath(movie.backdrop_path || movie.poster_path)})`,
              }}
            >
              
            </Box>
          </SwiperSlide>
        ))}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "80%",
            color: "white",
            zIndex: 9999,
            backgroundColor: theme.palette.background.default ,
            padding: theme.spacing(2),
            borderRadius: theme.shape.borderRadius,
            maxHeight: "80vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none"
            },
          }}
        >
          <SearchBox />
        </Box>


      </Swiper>

    </Box>


  );
};

export default SliderBanner;