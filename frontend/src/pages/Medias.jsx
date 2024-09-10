import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import tmdbConfig from "../api/services/tmdbService";
import mediaApi from "../api/modules/mediaModule";
import { setAppState } from "../redux/appStateSlice";
import { toast } from "react-toastify";
import usePrevious from "../hooks/usePrevious";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Button, Stack, Typography, Toolbar, CircularProgress } from "@mui/material";
import MediaGrid from "../components/common/MediaGrid";
import { muiConfigs } from "../configs/styleConfigs";

export const MediaList = () => {
  const { mediaType } = useParams();
  const [medias, setMedias] = useState([]);
  const [currCategory, setCurrCategory] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const prevMediaType = usePrevious(mediaType);
  const dispatch = useDispatch();
  const mediaCategories = useMemo(() => ["popular", "top_rated"], []);

  const categoryLabels = useMemo(() => ({
    popular: "Popular",
    top_rated: "Mais Avaliados"
  }), []);

  useEffect(() => {
    dispatch(setAppState(mediaType));
    window.scrollTo(0, 0);
  }, [mediaType, dispatch]);

  useEffect(() => {
    const getMedias = async () => {
      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory: mediaCategories[currCategory],
        page: currPage
      });


      if (err) {
        toast.error(err.message);
        setHasMore(false);
      } else if (response) {
        setMedias(m => [...m, ...response.results]);
        setHasMore(response.page < response.total_pages);
      }
    };

    if (mediaType !== prevMediaType) {
      setCurrCategory(0);
      setCurrPage(1);
      setMedias([]);
      setHasMore(true);
    } else {
      getMedias();
    }
  }, [mediaType, currCategory, prevMediaType, currPage, mediaCategories, dispatch]);

  const onCategoryChange = (categoryIndex) => {
    if (currCategory === categoryIndex) return;
    setMedias([]);
    setCurrPage(1);
    setCurrCategory(categoryIndex);
  };

  const onLoadMore = () => setCurrPage(currPage + 1);

  return (
    <>
      <Toolbar />
      <Box sx={{ ...muiConfigs.style.mainContent, marginTop: 4 }}>
        <Stack
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: 4 }}
        >
          <Typography fontWeight="700" variant="h5">
            {mediaType === tmdbConfig.mediaType.movie ? "Filmes" : "TV Shows / Series"}
          </Typography>
          <Stack direction="row" spacing={2}>
            {mediaCategories.map((cate, index) => (
              <Button
                key={index}
                size="large"
                variant={currCategory === index ? "contained" : "text"}
                onClick={() => onCategoryChange(index)}
              >
                {categoryLabels[cate]}
              </Button>
            ))}
          </Stack>
        </Stack>
        <InfiniteScroll
          dataLength={medias.length}
          next={onLoadMore}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ margin: "0 auto" }} />}
        >
          <MediaGrid medias={medias} mediaType={mediaType} />
        </InfiniteScroll>
      </Box>
    </>
  );
};
