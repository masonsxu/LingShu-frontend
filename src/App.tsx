import { AppBar, Button, Container, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ChannelForm from './pages/ChannelForm';
import ChannelsList from './pages/ChannelsList';

function Home() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('welcome')}
      </Typography>
      <Typography variant="body1">
        {t('home_desc')}
      </Typography>
    </Container>
  )
}

function App() {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language || 'zh');
  const handleLangChange = (event: any) => {
    const lng = event.target.value;
    setLang(lng);
    i18n.changeLanguage(lng);
  };
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('title')}
          </Typography>
          <Button color="inherit" component={Link} to="/">
            {t('home')}
          </Button>
          <Button color="inherit" component={Link} to="/channels">
            {t('channels')}
          </Button>
          <Select
            value={lang}
            onChange={handleLangChange}
            size="small"
            sx={{
              ml: 2, color: 'white', borderColor: 'white', minWidth: 90, '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '.MuiSvgIcon-root': { color: 'white' }
            }}
            variant="outlined"
          >
            <MenuItem value="zh">中文</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/channels" element={<ChannelsList />} />
        <Route path="/channels/new" element={<ChannelForm />} />
        <Route path="/channels/edit/:id" element={<ChannelForm />} />
      </Routes>
    </Router>
  )
}

export default App