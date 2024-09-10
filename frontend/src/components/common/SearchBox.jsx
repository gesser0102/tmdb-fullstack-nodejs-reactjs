import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import mediaApi from "../../api/modules/mediaModule";
import MediaGrid from "./MediaGrid";
import { muiConfigs } from "../../configs/styleConfigs";

const mediaTypes = ["movie", "tv"];

// Mapping for media type labels in Portuguese
const mediaTypeLabels = {
  movie: "Filmes",
  tv: "TV"
};

let timer;

export const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);

  const search = useCallback(
    async () => {
      setOnSearch(true);

      const { response, err } = await mediaApi.search({
        mediaType,
        query,
        page
      });

      setOnSearch(false);

      if (err) toast.error(err.message);
      if (response) {
        if (page > 1) setMedias(medias => [...medias, ...response.results]);
        else setMedias([...response.results]);
      }
    },
    [mediaType, query, page],
  );

  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
      setPage(1);
    } else search();
  }, [search, query, mediaType, page]);

  useEffect(() => {
    setMedias([]);
    setPage(1);
  }, [mediaType]);

  const onCategoryChange = (selectedCategory) => setMediaType(selectedCategory);

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);

    timer = setTimeout(() => {
      setQuery(newQuery);
    }, 500);
  };

  return (
    <>
      <Box sx={{ ...muiConfigs.style.mainContent }}>
        <Stack spacing={0}>
          <Box sx={{ justifyContent: "center", margin: "1rem auto" }}>
            <Typography variant="h2" sx={{ fontSize: {xs: "1rem", md: "1.5rem", sm: "2rem"} }}>Pesquise Seus Filmes Favoritos</Typography>
          </Box>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            sx={{ width: "100%", marginBottom: "1rem" }}
          >
            {mediaTypes.map((item, index) => (
              <Button
                size="medium"
                key={index}
                variant={mediaType === item ? "contained" : "text"}
                sx={{
                  color: mediaType === item ? "primary.contrastText" : "text.primary"
                }}
                onClick={() => onCategoryChange(item)}
              >
                {mediaTypeLabels[item]}
              </Button>
            ))}
          </Stack>
          <TextField
            placeholder="Pesquisar por um filme..."
            sx={{ width: "100%" }}
            autoFocus
            onChange={onQueryChange}
          />

          <MediaGrid medias={medias} mediaType={mediaType} />

          {medias.length > 0 && (
            <LoadingButton
              loading={onSearch}
              variant="contained"
              onClick={() => setPage(page + 1)}
              sx={{ width: "50%", justifyContent: "center", margin: "10px auto" }}
            >
              Carregar mais
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};
