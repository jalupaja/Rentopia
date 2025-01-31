import { Avatar, Box, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Divider } from "@mui/material";
import { Logout } from "../helper/BackendHelper.js";
import * as React from "react";
import { PersonAdd, Settings } from "@mui/icons-material";
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MenuComponent({ authUser }) {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { t } = useTranslation("", { keyPrefix: "profile_menu" });

    //todo change
    let adminPanel = null;
    if (authUser.role === "ADMIN") {
        adminPanel =
            <MenuItem onClick={() => navigate("/helpCenter/ADM")}>
                <ListItemIcon>
                    <AdminPanelSettingsIcon fontSize="small" />
                </ListItemIcon>
                {t("admin_tickesystem")}
            </MenuItem>
    }
    const userNameLetter = authUser.name[0];
    return (
        <Box>
            <Tooltip title={t("account_settings")}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>{userNameLetter}</Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
               slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
        <MenuItem onClick={() => navigate("/profilePage")}>
            <Avatar /> {t("profile")}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/chat")}>
            <ListItemIcon>
                <ChatIcon fontSize="small" />
            </ListItemIcon>
            {t("chat")}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/helpCenter")}>
            <ListItemIcon>
                <HelpCenterIcon fontSize="small" />
            </ListItemIcon>
            {t("ticketsystem")}
        </MenuItem>
        {adminPanel}
        <Divider />
        <MenuItem onClick={() => {Logout();  window.location.reload();}}>
            <ListItemIcon>
                <LogoutIcon/>
            </ListItemIcon>
            Logout
        </MenuItem>
    </Menu>
        </Box>
    );
}

export default MenuComponent;
