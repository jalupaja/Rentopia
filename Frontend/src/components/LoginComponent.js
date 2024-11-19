import {Button, Stack, TextField, Link, styled} from "@mui/material";

const InputWrapper = styled('div')({
    margin : 5
});
function LoginComponent(){
    return (
        <Stack>
            <InputWrapper>
                <TextField id="prenameTextfield" label="Prename" variant="outlined" />
            </InputWrapper>
            <InputWrapper>
                <TextField id="nameTextfield" label="Name" variant="outlined" />
            </InputWrapper>
            <InputWrapper>
                <TextField id="prenameTextfield" label="Email" variant="outlined" />
            </InputWrapper>
            <InputWrapper>
                <Button variant="contained">Login</Button>
            </InputWrapper>
            <Link to="/register">Register</Link>
        </Stack>
    )
}

export default LoginComponent