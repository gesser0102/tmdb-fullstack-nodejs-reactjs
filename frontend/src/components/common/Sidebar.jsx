import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import { muiConfigs } from "../../configs/styleConfigs";



const Sidebar = ({ open, toggleSidebar }) => {

  const { appState } = useSelector((state) => state.appState);


  const sidebarWidth = muiConfigs.size.sidebarWith;

  const drawer = (
    <>
      <List sx={{ paddingX: "20px", marginTop: "45px"}}>
        {menuConfigs.main.map((item, index) => (
          <ListItemButton
            key={index}
            sx={{
              borderRadius: "10px",
              marginY: 1,
              backgroundColor: appState.includes(item.state) ? "primary.contrastText" : "inherit",
            }}
            component={Link}
            to={item.path}
            onClick={() => toggleSidebar(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText disableTypography primary={<Typography textTransform="uppercase">
              {item.display}
            </Typography>} />
          </ListItemButton>
        ))}

      </List>
    </>
  );

  return (
    <Drawer
      open={open}
      onClose={() => toggleSidebar(false)}
      sx={{
        "& .MuiDrawer-Paper": {
          boxSizing: "border-box",
          widh: sidebarWidth,
          borderRight: "0px",
        }
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;