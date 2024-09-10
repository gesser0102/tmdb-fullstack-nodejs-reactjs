import { useSelector, useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Button, IconButton, Toolbar} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import { setAuthModalOpen } from "../../redux/loginModalSlice";
import { Logo } from "./Logo";
import UserMenu from "./UserMenu";
import Sidebar from "./Sidebar";



export const NavBar = () => {
    const { user } = useSelector((state) => state.user);
    const { appState } = useSelector((state) => state.appState);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const dispatch = useDispatch();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
            
                <AppBar elevation={0} >
                    <Toolbar sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        {/* Logo section */}
                        <Box sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "center" },
                            mt: 2,
                            mb:2,   // Centralize in mobile, align left in desktop
                        }}>
                            <IconButton
                                color="inherit"
                                sx={{ mr: 2, display: { md: "none" } }}
                                onClick={toggleSidebar}
                            >
                                <MenuIcon />
                            </IconButton >
                            <Link to={"/"} style={{ color: "inherit", textDecoration: "none" }} >
                             <Logo />
                            </Link>
                        </Box>

                        {/* Main menu section */}
                        <Box sx={{ flex: 2, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
                            {menuConfigs.main.map((item, index) => (
                                <Button
                                    key={index}
                                    sx={{
                                        color: appState.includes(item.state) ? "primary.contrastText" : "inherit",
                                        mr: 2
                                    }}
                                    startIcon={item.icon}
                                    component={Link}
                                    to={item.path}
                                    variant={appState.includes(item.state) ? "contained" : "text"}
                                >
                                    {item.display}
                                </Button>
                            ))}
                        </Box>

                        {/* Sign in section */}
                        <Box sx={{ mb:2, mt: 2, flex: 1, display: "flex", justifyContent: "flex-end" }}>
                            {!user && (
                                <Button
                                    variant="contained"
                                    onClick={() => dispatch(setAuthModalOpen(true))}
                                >
                                    entrar
                                </Button>
                            )}
                            {user && <UserMenu />}
                        </Box>
                        </Toolbar>
                    </AppBar>
               
        </>
    );
};
