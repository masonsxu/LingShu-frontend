import { AddCircle as AddIcon, Assessment as DashboardIcon, PlayArrow as PlayIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { AppBar, Box, Button, Card, CardContent, Container, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { getChannels, type ChannelModel } from './api/channels';
import ChannelForm from './pages/ChannelForm';
import ChannelsList from './pages/ChannelsList';
import MessageTest from './pages/MessageTest';

function Home() {
  const { t } = useTranslation();
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await getChannels();
        setChannels(data);
      } catch (err) {
        console.error('Failed to fetch channels for dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  const enabledChannels = channels.filter(c => c.enabled);
  const disabledChannels = channels.filter(c => !c.enabled);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
        {t('welcome')}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DashboardIcon />
              {t('total_channels')}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {loading ? '...' : channels.length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: 'success.main', color: 'success.contrastText' }}>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlayIcon />
              {t('enabled_channels')}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {loading ? '...' : enabledChannels.length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ bgcolor: 'warning.main', color: 'warning.contrastText' }}>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon />
              {t('disabled_channels')}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {loading ? '...' : disabledChannels.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: 'info.main', color: 'info.contrastText' }}>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon />
              {t('quick_actions')}
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/channels/new"
              sx={{ mt: 1, bgcolor: 'white', color: 'info.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              {t('create_new_channel')}
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {t('system_overview')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('dashboard_description')}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to="/channels"
              fullWidth
              sx={{ py: 2 }}
            >
              {t('manage_channels')}
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/channels/new"
              fullWidth
              sx={{ py: 2 }}
            >
              {t('create_new_channel')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {!loading && channels.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('recent_channels')}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              {channels.slice(0, 4).map((channel) => (
                <Card variant="outlined" key={channel.id}>
                  <CardContent>
                    <Typography variant="h6" component="div" noWrap>
                      {channel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {channel.enabled ? t('enabled') : t('disabled')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {channel.source.type.toUpperCase()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

function App() {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language || 'zh');
  const handleLangChange = (event: SelectChangeEvent<string>) => {
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
        <Route path="/channels/test/:id" element={<MessageTest />} />
      </Routes>
    </Router>
  )
}

export default App