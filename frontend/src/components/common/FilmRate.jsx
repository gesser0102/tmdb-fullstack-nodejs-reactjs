import { Box, Typography, CircularProgress } from "@mui/material";

const FilmRate = ({ value }) => {
  
  const getColor = (value) => {
    if (value === 0) return "inherit";
    if (value >= 7) return "success"; 
    if (value >= 4) return "warning";  
    return "error";                    
  };


  const getProgressValue = (value) => {
    return Math.max(1, value * 10); 
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: "max-content",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={getProgressValue(value)}
        color={getColor(value)}
        size={50}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          fontWeight="700"
          sx={{ marginTop: "-5px" }}
        >
          {`${Math.round(value * 10)}%`} {/* Usa Math.round para garantir que o cálculo de percentagem seja correto */}
        </Typography>
      </Box>
    </Box>
  );
};

export default FilmRate;
