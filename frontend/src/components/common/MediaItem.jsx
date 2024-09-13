
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import tmdbConfig from "../../api/services/tmdbService";
import { muiConfigs } from "../../configs/styleConfigs";
import FilmRate from "./FilmRate";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/mediaModalSlice";

const MediaItem = ({ media, mediaType }) => {


  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [rate, setRate] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(media.title || media.name || media.mediaTitle);

    setPosterPath(tmdbConfig.posterPath(media.poster_path || media.backdrop_path || media.mediaPoster || media.profile_path));

    if (mediaType === tmdbConfig.mediaType.movie) {
      setReleaseDate(media.release_date && media.release_date.split("-")[0]);
    } else {
      setReleaseDate(media.first_air_date && media.first_air_date.split("-")[0]);
    }

    setRate(media.vote_average || media.mediaRate);
  }, [media, mediaType]);

  const handleOpenModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openModal({
      mediaId: media.mediaId || media.id,
      mediaType: mediaType
    }));
  };


  return (
    <Box onClick={handleOpenModal} sx={{
      ...muiConfigs.style.backgroundImage(posterPath),
      paddingTop: "160%",
      ".media-info": { opacity: 1, bottom: 0 },
      "&:hover .media-back-drop": { opacity: 1 },
      color: "primary.contrastText", cursor: "pointer",
    }}>
      {mediaType  && (
        <>
          <Box className="media-back-drop" sx={{
            opacity: { xs: 1, md: 0 },
            transition: "all 0.3s ease",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
          }} />
          {rate && (
            <Box sx={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: "10px",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: "30px 0 0 30px",
              color: "secondary.contrastText",
            }}>
              <FilmRate value={rate} />
            </Box>
          )}
          <Box
            className="media-info"
            sx={{
              transition: "all 0.3s ease",
              position: "absolute",
              bottom: { xs: 0, md: "-20px" },
              width: "100%",
              height: "max-content",
              boxSizing: "border-box",
              backgroundColor: "rgba(0,0,0,0.75)",
              padding: { xs: "10px", md: "2rem 1rem" }
            }}
          >
            <Stack spacing={{ xs: 1, md: 2 }} >
              <Typography color="secondary.contrastText" fontWeight="700">{releaseDate}</Typography>
              <Typography
                variant="body1"
                fontWeight="700"

                sx={{
                  fontSize: "1rem",
                  color: "secondary.contrastText",
                  ...muiConfigs.style.typoLines(1, "left")
                }}
              >
                {title}
              </Typography>
            </Stack>
          </Box>
        </>
      )}
    </Box>

  );
};

export default MediaItem;