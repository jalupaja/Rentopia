import Appbar from "../components/Appbar";
import {useEffect, useState} from "react";
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
import PropTypes from "prop-types";
import FetchBackend, {JWTTokenExists} from "../helper/BackendHelper";

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

    const [authUser, setAuthUser] = useState(undefined);
    const [ownerId, setOwnerId] = useState("");
    const [openAddItem, setOpenAddItem] = React.useState(false);
    const [openEditProfile, setOpenEditProfile] = React.useState(false);
    const [clickedDevice, setClickedDevice] = React.useState(null);
    const [tabValue, setTabValue] = React.useState(0);
    const [deviceList, setDeviceList] = React.useState([]);
    const [bookmarkList, setBookmarkList] = React.useState([]);
    const [historyList, setHistoryList] = React.useState([]);
    const [newDevice, setNewDevice] = React.useState({});

    useEffect(() => {
        if (JWTTokenExists()) {
            FetchBackend('GET', 'user/me', null)
                .then(response => response.json())
                .then(data => { setAuthUser(data); setOwnerId(data.id); })
                .catch(error => console.log(error))
        } else {
            console.log("no JWT token");
        }
    }, []);

    useEffect(() => {
        if(authUser && JWTTokenExists()) {
            setNewDevice({
                id: null,
                title: "",
                description: "",
                price: 0.0,
                category: "",
                ownerId: ownerId,
                isPublic: true,
                location: authUser.location,
            });
            FetchBackend('GET', 'device/all/' + ownerId, null)
                .then(response => response.json())
                .then(data => setDeviceList(data))
                .catch(error => console.log(error))

            FetchBackend('GET', 'device/bookmarks/all/' + ownerId, null)
                .then(response => response ? response.json() : console.log("error " + response))
                .then(data => setBookmarkList(data))
                .catch(error => console.log(error))

            FetchBackend('GET', 'device/rentHistory/all/' + ownerId, null)
                .then(response => response.json())
                .then(data => setHistoryList(data))
                .catch(error => console.log(error))
        }
    }, [ownerId])

    const handleAddDialogOpen = (device) => {
        setClickedDevice(device)
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
        FetchBackend('POST', 'device/bookmarks/remove/' + id, null)
            .then(response => response.json())
            .then(data => { data ? setBookmarkList(data) : console.log(data) })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleDeleteTool = (id) => {
        FetchBackend('POST', 'device/remove/' + id, null)
            .then(response => response.json())
            .then(data => { data ? setDeviceList(data) : console.log("error " + data);})
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <React.Fragment>
            <Box sx={{ ...FrameStyle }}>
                <Appbar authUser={authUser} />
                {authUser ? (
                <Box sx={{ width: '100%' }}>
                    <Grid container direction='row' columnSpacing={3} margin={'2% 10%'} sx={{ justifyContent: 'center' }}>
                        <Grid container columns={2} rowSpacing={2} direction='column' width={"49%"}>
                            <Item sx={{ boxShadow: 3, display: 'flex', height: 'min-content', maxHeight: 'min-content' }}>
                                <Avatar
                                    sx={{ width: 100, height: 100, margin: '24px' }}
                                    alt="User"
                                />
                                <Box>
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="Name"
                                        sx={{ alignSelf: 'center', margin: '24px 0 12px 0' }}
                                        value={authUser.name}
                                    />
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="Email"
                                        sx={{ alignSelf: 'center', margin: '12px 0 12px 0' }}
                                        value={authUser.email}
                                    />
                                </Box>
                                <Box sx={{ margin: ' 0 24px 24px 24px' }}>
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="No Company Set"
                                        sx={{ alignSelf: 'center', margin: '24px 0 12px 0'}}
                                        value={authUser.company}
                                    />
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="Country"
                                        sx={{ alignSelf: 'center', margin: '12px 0 12px 0' }}
                                        value={authUser.location.country}
                                    />
                                    <Button
                                        variant={"contained"}
                                        onClick={handleEditDialogOpen}
                                        sx={{ float: "right" }}>Edit Profile
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
                                    aria-label="Profile Tabs"
                                    sx={{ width: '100%' }}
                                >
                                    <Tab icon={<HandymanIcon />} label="Your Tools" {...a11yProps(0)} />
                                    <Tab icon={<BookmarksIcon />} label="Bookmarks"  {...a11yProps(1)} />
                                    <Tab icon={<HistoryIcon />} label="Rent Histroy" {...a11yProps(1)} />
                                </Tabs>
                                <CustomTabPanel value={tabValue} index={0}>
                                    <List sx={{ overflow: 'auto', height: '50vh', width: '90%' }}>
                                        {deviceList.map((device, index) => (
                                            //*Your Tools*//
                                            <div>
                                                <DeviceListItem
                                                    DeviceName={device.title}
                                                    DeviceId={device.id}
                                                    handleOpenDeviceEdit={() => handleAddDialogOpen(device)}
                                                    handleDeleteTool={() => handleDeleteTool(device.id)}
                                                    tabValue={tabValue}
                                                />
                                            </div>))
                                        }
                                    </List>
                                    <Fab color="primary" aria-label="add" style={fabStyle} onClick={() => handleAddDialogOpen(newDevice)}>
                                        <AddIcon />
                                    </Fab>
                                </CustomTabPanel>
                                <CustomTabPanel value={tabValue} index={1}>
                                    <List sx={{ overflow: 'auto', height: '50vh', width: '90%' }}>
                                        {bookmarkList.map((device, index) => (
                                            //*Bookmarks*//
                                            <div>
                                                <DeviceListItem
                                                    DeviceName={device.title}
                                                    DeviceId={device.id}
                                                    handleRemoveBookmark={() => handleRemoveBookmark(device.id)}
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
                                        {historyList.map((device, index) => (
                                            //*Rent Tools*//
                                            <div>
                                                <DeviceListItem
                                                    DeviceName={device.title}
                                                    DeviceId={device.id}
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
                ) : (<div>Loading...</div>)}
                <Box flex={"auto"} />
                <Footer />
                <div>
                    {openAddItem ? (
                        <AddDeviceDialog open={openAddItem}
                                         handleAddDialogClose={handleAddDialogClose}
                                         iDevice={clickedDevice}
                                         setDeviceList={setDeviceList}
                                         authUser={authUser}
                        />
                    ) : ('')}
                </div>
                {authUser ? (
                    <EditProfileDialog open={openEditProfile}
                                       userData={authUser}
                                       setUserData={setAuthUser}
                                       handleEditDialogClose={handleEditDialogClose}
                    />
                ) : ('')}
            </Box>
        </React.Fragment>
    )
}

export default ProfileSite;
