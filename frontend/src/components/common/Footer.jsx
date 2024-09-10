import React from "react";
import { Container } from "./Container";
import { Paper, Stack, Typography, Link} from "@mui/material";



export const Footer = () => {
    return (
        <Container>
            <Paper square={true} sx={{backgroundImage: "unset", padding: "2rem"}}>
                <Stack alignItems={"center"} justifyContent={"center"} direction={{xs: "column", md: "row"}} sx={{height: "max-content"}}>
                <Typography>
                        Desenvolvido por {' '}
                        <Link href="https://github.com/gesser0102" target="_blank" rel="noopener noreferrer" color="inherit" sx={{fontWeight: "bold", textDecoration: "none"}}>
                            @Rodrigo Gesser
                        </Link>
                    </Typography>
                </Stack>

            </Paper>
        </Container>
    );
}