import {Box, Container, Grid, Typography} from "@mui/material";
import { BottomNavigation } from '@mui/material';

const FooterStyle = {
    position : "fixed",
    bottom: "0",
    paddingBottom : "o"
}

function Footer(){
    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                paddingTop: "1rem",
                paddingBottom: "0",
                position : "fixed",
                bottom : "0",
                backgroundColor : "lightblue"
            }}
        >
            <Container maxWidth="lg">
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <Typography color="black" variant="h5">
                            Rentopia
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="textSecondary" variant="subtitle1">
                            {`${new Date().getFullYear()} | React | Material UI | React Router`}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Footer;