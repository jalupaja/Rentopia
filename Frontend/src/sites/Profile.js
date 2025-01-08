import Appbar from "../components/Appbar";
import { useState } from "react";
import Footer from "../components/Footer";
import {
    Avatar,
    Box,
    Button,
    Paper,
    styled, List, Fab, Input, Tabs, Tab
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import * as React from "react";
import DeviceListItem from "../components/DeviceListItem";
import { FrameStyle } from "./Register";
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HandymanIcon from '@mui/icons-material/Handyman';
import AddDeviceDialog from "../components/AddDeviceDialog";
import EditProfileDialog from "../components/EditProfileDialog";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {ReturnHomeWhenLoggedOut} from "../helper/BackendHelper";

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center'
}));

const fabStyle = {
    alignSelf: "flex-start",
    margin: "2% 0 0 5%",
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ width: '100%' }}
            {...other}

        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ProfileSite() {
    ReturnHomeWhenLoggedOut();

    const [authUser, setAuthUser] = useState(null);
    const [openAddItem, setOpenAddItem] = React.useState(false);
    const [openEditProfile, setOpenEditProfile] = React.useState(false);
    const [openChangePassword, setOpenChangePassword] = React.useState(false);
    const [oName, setOName] = React.useState("");
    const [tabValue, setTabValue] = React.useState(0);
    const [deviceList, setDeviceList] = React.useState([]);
    const [bookmarkList, setBookmarkList] = React.useState([]);
    const [historyList, setHistoryList] = React.useState([]);
    const { t } = useTranslation("", { keyPrefix: "profile" });

    const handleAddDialogOpen = (name) => {
        setOName(name);
        setOpenAddItem(true);
    }

    const handleAddDialogClose = () => {
        setOpenAddItem(false);
    }

    const handleEditDialogOpen = () => {
        setOpenEditProfile(true);
    }

    const handleEditDialogClose = () => {
        setOpenEditProfile(false);
    }
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    }

    const handleRemoveBookmark = (id) => {
        setBookmarkList(bookmarkList.filter(bookmark => bookmark.id !== id));
        //TODO: DB Remove Bookmark
    }

    const handleDeleteTool = (id) => {
        setDeviceList(deviceList.filter(device => device.id !== id));
        //TODO: DB Remove Tool
    }

    return (
        <React.Fragment>
            <Box sx={{ ...FrameStyle }}>
                <Appbar authUser={authUser} />
                <Box sx={{ width: '100%' }}>
                    <Grid container direction='row' columnSpacing={3} margin={'2% 10%'} sx={{ justifyContent: 'center' }}>
                        <Grid container columns={2} rowSpacing={2} direction='column' width={"49%"}>
                            <Item sx={{ boxShadow: 3, display: 'flex', flexDirection : "column", height: 'min-content', maxHeight: 'min-content' }}>
                                <Box sx={{display : "flex", flexDirection : "row"}}>
                                    <Avatar
                                        sx={{ width: 100, height: 100, margin: '24px' }}
                                        alt={t("user")}
                                    />
                                    <Box>
                                        <Input
                                            fullWidth
                                            disabled
                                            defaultValue={t("name")}
                                            sx={{ alignSelf: 'center', margin: '24px 0 12px 0' }}
                                        />
                                        <Input
                                            fullWidth
                                            disabled
                                            defaultValue={t("prename")}
                                            sx={{ alignSelf: 'center', margin: '12px 0 12px 0' }}
                                        />
                                    </Box>
                                    <Box sx={{ margin: ' 0 24px 24px 24px', justifyContent : "flex-end" }}>
                                        <Input
                                            fullWidth
                                            disabled
                                            defaultValue={t("company")}
                                            sx={{ alignSelf: 'center', margin: '24px 0 12px 0' }}
                                        />
                                        <Input
                                            fullWidth
                                            disabled
                                            defaultValue={t("email")}
                                            sx={{ alignSelf: 'center', margin: '12px 0 12px 0' }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{display : "flex", justifyContent : "flex-start"}}>
                                    <Button sx={{ marginRight : '24px'}}
                                            variant={"contained"}
                                            onClick={handleEditDialogOpen}>
                                        {t("edit_profile")}
                                    </Button>
                                    <Button
                                        variant={"contained"}
                                        onClick={() => setOpenChangePassword(!openChangePassword)}>
                                        {t("change_password")}
                                    </Button>
                                </Box>
                            </Item>
                        </Grid>
                        <Grid width={"49%"}>
                            <Item
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: 3
                                }}
                            >
                                <Tabs value={tabValue}
                                    onChange={handleTabChange}
                                    aria-label={t("profile_tabs")}
                                    sx={{ width: '100%' }}
                                >
                                    <Tab icon={<HandymanIcon />} label={t("your_tools")} {...a11yProps(0)} />
                                    <Tab icon={<BookmarksIcon />} label={t("bookmarks")}  {...a11yProps(1)} />
                                    <Tab icon={<HistoryIcon />} label={t("rent_history")} {...a11yProps(1)} />
                                </Tabs>
                                <CustomTabPanel value={tabValue} index={0}>
                                    <List sx={{ overflow: 'auto', height: '50vh', width: '90%' }}>
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            //*Your Tools*//
                                            <div>
                                                <DeviceListItem
                                                    DeviceName={t("insert_device")}
                                                    DeviceId={index}
                                                    handleOpenDeviceEdit={() => handleAddDialogOpen(t("tool_nr") + index)}
                                                    handleAddDialogClose={() => handleAddDialogClose(index)}
                                                    tabValue={tabValue}
                                                />
                                            </div>))
                                        }
                                    </List>
                                    <Fab color="primary" aria-label="add" style={fabStyle} onClick={() => handleAddDialogOpen(oName)}>
                                        <AddIcon />
                                    </Fab>
                                </CustomTabPanel>
                                <CustomTabPanel value={tabValue} index={1}>
                                    <List sx={{ overflow: 'auto', height: '50vh', width: '90%' }}>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            //*Bookmarks*//
                                            <div>
                                                <DeviceListItem
                                                    DeviceName={t("insert_device")}
                                                    DeviceId={index}
                                                    handleRemoveBookmark={() => handleDeleteTool(index)}
                                                    tabValue={tabValue}
                                                />
                                            </div>))
                                        }
                                    </List>
                                    <Fab style={fabStyle} sx={{ visibility: "hidden" }}>
                                        <AddIcon />
                                    </Fab>
                                </CustomTabPanel>
                                <CustomTabPanel value={tabValue} index={2}>
                                    <List sx={{ overflow: 'auto', height: '50vh', width: '90%' }}>
                                        {Array.from({ length: 10 }).map((_, index) => (
                                            //*Rent Tools*//
                                            <div>
                                                <DeviceListItem
                                                    DeviceName={t("insert_device")}
                                                    DeviceId={index}
                                                    tabValue={tabValue}
                                                />
                                            </div>))
                                        }
                                    </List>
                                    <Fab style={fabStyle} sx={{ visibility: "hidden" }}>
                                        <AddIcon />
                                    </Fab>
                                </CustomTabPanel>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
                <Box flex={"auto"} />
                <Footer />
                <div>
                    {openAddItem ? (
                        <AddDeviceDialog open={openAddItem} handleAddDialogClose={handleAddDialogClose} iName={oName} /> //TODO: pass device datatype
                    ) : ('')}
                </div>
                <EditProfileDialog open={openEditProfile} handleEditDialogClose={handleEditDialogClose} />
                <ChangePasswordDialog open={openChangePassword} handleEditDialogClose={() => setOpenChangePassword(false)} />
            </Box>
        </React.Fragment>
    )
}

export default ProfileSite;
