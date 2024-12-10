import Appbar from "../components/Appbar";
import {useState} from "react";
import Footer from "../components/Footer";
import {
    Avatar,
    Box,
    Button,
    Paper,
    TextField,
    styled, List, Typography, Fab
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import * as React from "react";
import DeviceListItem from "../components/DeviceListItem";
import {FrameStyle} from "./RegisterPage";
import AddIcon from '@mui/icons-material/Add';
import AddDeviceDialog from "../components/AddDeviceDialog";

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
    const [open, setOpen] = React.useState(false);

    const handleAddDialogOpen = () => {
        setOpen(true);
    }

    const handleAddDialogClose = () => {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <Box sx = {{ ...FrameStyle}}>
                <Appbar authUser={authUser}/>
                <Box sx={{width: '100%'}}>
                    <Grid container direction='row' columnSpacing={3} margin={'2% 10%'} sx={{justifyContent: 'center'}}>
                        <Grid container columns={2} rowSpacing={2} direction='column' width={"49%"}>
                            <Item>
                                <Grid container spacing={2} alignItems="center">
                                    <Avatar
                                            sx={{ width: 100, height: 100 }}
                                            alt="User"
                                    />
                                    <Grid item display={'grid'}>
                                        <TextField
                                            label="Company"
                                            variant="outlined"
                                        />
                                        <TextField
                                            label="Name"
                                            variant="outlined"
                                        />
                                        <Button sx={{ justifySelf: 'flex-end'}} variant={"outlined"}> Change Profile</Button>
                                    </Grid>
                                </Grid>
                            </Item>
                            <Item>
                                <Grid>
                                2
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid width={"49%"}>
                            <Item sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Typography variant={'h5'}>Your Tools</Typography>
                                <List sx={{overflow: 'auto', height: '50vh', width: '90%'}}>
                                    {Array.from({ length: 10 }).map((_, index) => (
                                        <div>
                                            <DeviceListItem DeviceName={"Insert Device Name here"} DeviceId={index}/>
                                        </div>))
                                    }
                                </List>
                                <Fab color="primary" aria-label="add" style={fabStyle} onClick={handleAddDialogOpen}>
                                    <AddIcon />
                                </Fab>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
                <Box flex={"auto"}/>
                <Footer/>
                <AddDeviceDialog open={open} handleAddDialogClose={handleAddDialogClose}/>
            </Box>
        </React.Fragment>
    )
}

export default ProfilePage;