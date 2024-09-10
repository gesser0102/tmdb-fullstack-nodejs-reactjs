import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export const Container = ({ header, children }) => {

    return (
        <Box sx={{        
          marginX: "auto",
          color: "text.primary"
        }}>
          <Stack spacing={2}>
            {header && (
              <Box sx={{
                position: "relative",
                paddingX: { xs: "20px", md: 0 },
                maxWidth: "1366px",
                marginX: "auto",
                width: "100%"
              }}>
                <Typography variant="h6" fontWeight="700" textTransform="uppercase">
                  {header}
                </Typography>
              </Box>
            )}
            {children}
          </Stack>
        </Box>
      );
    };