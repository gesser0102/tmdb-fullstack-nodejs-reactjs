import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

export const Logo = () => {
    return (
        <Typography fontWeight={"700"} fontSize={"1.5rem"}>
            Fav<span style={{color: useTheme().palette.primary.main}}>Movies</span>
        </Typography>
    );
};

