import { Box } from "@mui/material";
import MediaItem from "./MediaItem";

const MediaGrid = ({ medias, mediaType }) => {
  return (
    <Box
      display="grid"
      gap={1}
      sx={{
       
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",  
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",  
          lg: "repeat(5, 1fr)"   
        },
      }}
    >
      {medias.map((media, index) => (
        <Box key={index}>
          <MediaItem media={media} mediaType={mediaType} />
        </Box>
      ))}
    </Box>
  );
};

export default MediaGrid;
