import {Avatar, Box, Input} from "@mui/material";
import * as React from "react";
import {useTranslation} from "react-i18next";

function ProfileOverview({user = {}}){
    const { t } = useTranslation("", { keyPrefix: "profile" });

    console.log(user.name);
    if(!user.name){
        user = {
            name : "",
            email : "",
            location : {country : ""},
            company : ""
        }
    }
    return (
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
                    value={user.name}
                />
                <Input
                    fullWidth
                    disabled
                    defaultValue={t("email")}
                    sx={{ alignSelf: 'center', margin: '12px 0 12px 0' }}
                    value={user.email}
                />
            </Box>
            <Box sx={{ margin: ' 0 24px 24px 24px', justifyContent : "flex-end" }}>
                <Input
                    fullWidth
                    disabled
                    defaultValue={t("company")}
                    sx={{ alignSelf: 'center', margin: '24px 0 12px 0'}}
                    value={user.company}
                />
                <Input
                    fullWidth
                    disabled
                    defaultValue={t("country")}
                    sx={{ alignSelf: 'center', margin: '12px 0 12px 0' }}
                    value={user.location.country}
                />
            </Box>
        </Box>
    );
}

export default ProfileOverview;