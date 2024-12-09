import Appbar from "./Appbar";
import {useState} from "react";
import Footer from "./Footer";
import {
    Avatar,
    Box,
    Button,
    Paper,
    TextField,
    styled, List, Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import * as React from "react";
import DeviceListItem from "./DeviceListItem";
import {FrameStyle} from "./RegisterPage";

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center'
}));

function ProfilePage() {

    const [authUser, setAuthUser] = useState(null);

    return (
        <Box sx = {{ ...FrameStyle}}>
            <Appbar authUser={authUser}/>
            <Box sx={{width: '80%', display: 'grid', justifySelf: 'center'}}>
                <Grid container direction='row' columnSpacing={3}>
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
                        <Item sx={{maxHeight: 'fit-content'}} >
                            <Typography>Your Tools</Typography>
                            <List sx={{overflow: 'auto', maxHeight: '50%', minHeight: '50%', width: '90%'}}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div>
                                        <DeviceListItem DeviceName={"Insert Device Name here"} DeviceId={index}/>
                                    </div>))
                                }
                            </List>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
            <Box flex={"auto"}/>
            <Footer/>
        </Box>
    )
}

export default ProfilePage;