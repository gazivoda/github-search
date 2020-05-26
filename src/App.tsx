import React, { Fragment } from 'react';
import GithubSearch from './components/github-search-container';
import './App.css'
import { AppBar, Typography, Toolbar, createMuiTheme, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#0097dc' },
        secondary: { main: '#3a3c45' }
    },
    typography: {
        fontFamily: 'BlenderPro',
    },
});

const App = () =>
    <div>
        <ThemeProvider theme={theme}>
            <AppBar className="app-bar" position="static">
                <img className="logo" src="../../assets/logo.png" alt="Logo" />
                <Toolbar>
                    <Typography variant="h6">
                        Github Search
          </Typography>
                </Toolbar>
            </AppBar>
            <GithubSearch />
        </ThemeProvider>
    </div>;

export default App;
