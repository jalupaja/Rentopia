import Appbar from "../components/Appbar";
import {useState} from "react";
import Footer from "../components/Footer";
import {
    Avatar,
    Box,
    Button,
    Paper,
    TextField,
    styled, List, Typography, Fab, Input
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import * as React from "react";
import DeviceListItem from "../components/DeviceListItem";
import {FrameStyle} from "./RegisterPage";
import AddIcon from '@mui/icons-material/Add';
import AddDeviceDialog from "../components/AddDeviceDialog";
import EditProfileDialog from "../components/EditProfileDialog";

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center'
}));

const fabStyle = {
    alignSelf: "flex-start",
    margin: "2% 0 0 5%",
};

function ProfilePage() {

    const [authUser, setAuthUser] = useState(null);
    const [openAddItem, setOpenAddItem] = React.useState(false);
    const [openEditProfile, setOpenEditProfile] = React.useState(false);
    const [oName, setOName] = React.useState("");

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

    return (
        <React.Fragment>
            <Box sx = {{ ...FrameStyle}}>
                <Appbar authUser={authUser}/>
                <Box sx={{width: '100%'}}>
                    <Grid container direction='row' columnSpacing={3} margin={'2% 10%'} sx={{justifyContent: 'center'}}>
                        <Grid container columns={2} rowSpacing={2} direction='column' width={"49%"}>
                            <Item sx={{boxShadow: 3, display: 'flex', height: 'min-content', maxHeight: 'min-content'}}>
                                <Avatar
                                    sx={{ width: 100, height: 100, margin: '24px'}}
                                    alt="User"
                                />
                                <Box>
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="Name"
                                        sx={{ alignSelf: 'center', margin: '24px 0 12px 0'}}
                                    />
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="Prename"
                                        sx={{ alignSelf: 'center', margin: '12px 0 12px 0'}}
                                    />
                                </Box>
                                <Box sx={{margin: ' 0 24px 24px 24px'}}>
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="Company"
                                        sx={{ alignSelf: 'center', margin: '24px 0 12px 0'}}
                                    />
                                    <Input
                                        fullWidth
                                        disabled
                                        defaultValue="Email"
                                        sx={{ alignSelf: 'center', margin: '12px 0 12px 0'}}
                                    />
                                    <Button
                                        variant={"contained"}
                                        onClick={handleEditDialogOpen}
                                        sx={{float: "right"}}>Edit Profile
                                    </Button>
                                </Box>
                            </Item>
                            <Item sx={{boxShadow: 3}}>
                                <Grid>
                                2
                                </Grid>
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
                                <Typography variant={'h5'}>Your Tools</Typography>
                                <List sx={{overflow: 'auto', height: '50vh', width: '90%'}}>
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <div>
                                            <DeviceListItem
                                                DeviceName={"Insert Device Name here"}
                                                DeviceId={index}
                                                handleOpenDeviceEdit={() => handleAddDialogOpen("Tool Nr " + index)} />
                                        </div>))
                                    }
                                </List>
                                <Fab color="primary" aria-label="add" style={fabStyle} onClick={() => handleAddDialogOpen(oName)}>
                                    <AddIcon />
                                </Fab>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
                <Box flex={"auto"}/>
                <Footer/>
                <div>
                    {openAddItem ? (
                        <AddDeviceDialog open={openAddItem} handleAddDialogClose={handleAddDialogClose} iName={oName}/> //TODO: pass device datatype
                    ) : ('')}
                </div>
                <EditProfileDialog open={openEditProfile} handleEditDialogClose={handleEditDialogClose}/>
            </Box>
        </React.Fragment>
    )
}

export default ProfilePage;