import { useState, useEffect } from "react";
import { useSelector } from "react-redux"
import { Paper, Box, LinearProgress, CircularProgress } from "@mui/material";

export const LoadingProgress = () => {
    const { globalLoading } = useSelector(state => state.globalLoading);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if(globalLoading) {
            setLoading(true);
        } else {
            setTimeout(() => {
                setLoading(false);
            },3000);
            
        };
    }, [globalLoading]);
    
    return (
        <>
            <Paper sx={{
                opacity: isLoading ? 1 : 0,
                pointerEvents: isLoading ? 'auto' : 'none',
                position: "fixed",
                width: "100vw",
                height: "100vh",
                zIndex: 9999
            }}>
                
                <LinearProgress sx={{position: "absolute"}}/>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <CircularProgress/>
                </Box>
            </Paper>
        </>
    );



}
