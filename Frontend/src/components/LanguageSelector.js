import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Popover, Typography, TextField, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
    const { t, i18n } = useTranslation("", { keyPrefix: "languageselector" });
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ];

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        setAnchorEl(null);
    };

    const filteredLanguages = languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ marginLeft: 'auto' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={handleOpen}
            >
                <Box sx={{ fontSize: '24px', marginRight: 1 }}>{currentLanguage.flag}</Box>
            </Box>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2, minWidth: 200 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {t("select_language")}
                    </Typography>
                    <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder={t("search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <List>
                        {filteredLanguages.map((lang) => (
                            <ListItem
                                button
                                sx={{ cursor: 'pointer' }}
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                selected={lang.code === i18n.language}
                            >
                                <ListItemIcon>{lang.flag}</ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: lang.code === i18n.language ? 'bold' : 'normal',
                                            }}
                                        >
                                            {lang.name}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Popover>
        </Box>
    );
};

export default LanguageSelector;
