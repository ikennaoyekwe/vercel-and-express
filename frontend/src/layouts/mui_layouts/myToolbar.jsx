import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MyIcon from '../../assets/images/menu.png';
import SearchIcon from '../../assets/images/search.png';
import {useState} from "react";
import {Drawer, List, ListItem, ListItemText, useMediaQuery} from "@mui/material";

export default function MyToolbar() {

    const [open, setOpen] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:900px')

    const changeOpenState = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open);
    }

    const ButtonsBox = (
        <Box>
            <Button color="inherit" sx={{color: 'black'}}>Login</Button>
            <Button color="inherit" sx={{color: 'black'}}>Register</Button>
            <Button color="inherit" sx={{color: 'black'}}>Main Page</Button>
        </Box>
    )

    const DrawerContent = (
        <Box
            role="presentation"
            onClick={changeOpenState(false)}
            sx={{cursor:'pointer'}}
        >
            <List>
                <ListItem button>
                    <ListItemText primary="Login" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Register" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Main Page"></ListItemText>
                </ListItem>
            </List>
        </Box>
    )

    return (
        <React.Fragment>
            <AppBar position="static" sx={{backgroundColor: '#E8EAF6', borderRadius: 10}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={changeOpenState(true)}
                    >
                        <img src={MyIcon} alt="Logo" width="24" height="24"/>
                    </IconButton>

                    {/* Search Box */}
                    <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center'}}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search..."
                            sx={{
                                backgroundColor: '#fff',
                                borderRadius: '4px',
                                mr: 2,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <IconButton>
                                        <img src={SearchIcon} width="24" height="24"/>
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                    {!isSmallScreen && ButtonsBox}
                </Toolbar>
            </AppBar>
            <Drawer anchor="top" open={open} onClose={changeOpenState(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '80vw',
                            maxWidth: '80vw',
                            boxSizing: 'border-box',
                            margin:'auto',
                        },
                    }}>
                {DrawerContent}
            </Drawer>
        </React.Fragment>
    );
}