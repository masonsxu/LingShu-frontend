import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import type {
  ChannelModel,
  DestinationConfig,
  FilterConfig,
  HTTPDestinationConfig,
  HTTPSourceConfig,
  PythonScriptFilterConfig,
  PythonScriptTransformerConfig,
  SourceConfig,
  TCPDestinationConfig,
  TCPSourceConfig,
  TransformerConfig,
} from '../api/channels';
import {
  createChannel,
  getChannelById,
  updateChannel,
} from '../api/channels';

const ChannelForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<ChannelModel>({
    name: '',
    description: '',
    enabled: true,
    source: { type: 'http', path: '', method: 'POST' },
    filters: [],
    transformers: [],
    destinations: [{ type: 'http', url: '', method: 'POST' }],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getChannelById(id)
        .then((data) => {
          setChannel(data);
        })
        .catch((err) => {
          setError('Failed to load channel for editing.');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setChannel((prev) => ({
      ...prev,
      [name]: type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value,
    }));
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setChannel((prev) => ({
      ...prev,
      source: {
        ...prev.source,
        [name as string]: value,
      } as SourceConfig,
    }));
  };

  const handleSourceTypeChange = (e: SelectChangeEvent) => {
    const newType = e.target.value as SourceConfig['type'];
    let newSource: SourceConfig;
    if (newType === 'http') {
      newSource = { type: 'http', path: '', method: 'POST' };
    } else if (newType === 'tcp') {
      newSource = { type: 'tcp', port: 0, host: '0.0.0.0', use_mllp: false };
    } else {
      newSource = { type: 'http', path: '', method: 'POST' }; // Default
    }
    setChannel((prev) => ({ ...prev, source: newSource }));
  };

  const handleFilterChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFilters = [...(channel.filters || [])];
    newFilters[index] = { ...newFilters[index], [name]: value } as FilterConfig;
    setChannel((prev) => ({ ...prev, filters: newFilters }));
  };

  const addFilter = () => {
    setChannel((prev) => ({
      ...prev,
      filters: [...(prev.filters || []), { type: 'python_script', script: '' }],
    }));
  };

  const removeFilter = (index: number) => {
    setChannel((prev) => ({
      ...prev,
      filters: (prev.filters || []).filter((_, i) => i !== index),
    }));
  };

  const handleTransformerChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newTransformers = [...(channel.transformers || [])];
    newTransformers[index] = { ...newTransformers[index], [name]: value } as TransformerConfig;
    setChannel((prev) => ({ ...prev, transformers: newTransformers }));
  };

  const addTransformer = () => {
    setChannel((prev) => ({
      ...prev,
      transformers: [...(prev.transformers || []), { type: 'python_script', script: '' }],
    }));
  };

  const removeTransformer = (index: number) => {
    setChannel((prev) => ({
      ...prev,
      transformers: (prev.transformers || []).filter((_, i) => i !== index),
    }));
  };

  const handleDestinationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    const newDestinations = [...channel.destinations];
    newDestinations[index] = { ...newDestinations[index], [name as string]: value } as DestinationConfig;
    setChannel((prev) => ({ ...prev, destinations: newDestinations }));
  };

  const handleDestinationTypeChange = (index: number, e: SelectChangeEvent) => {
    const newType = e.target.value as DestinationConfig['type'];
    const newDestinations = [...channel.destinations];
    let newDestination: DestinationConfig;
    if (newType === 'http') {
      newDestination = { type: 'http', url: '', method: 'POST' };
    } else if (newType === 'tcp') {
      newDestination = { type: 'tcp', host: '', port: 0, use_mllp: false };
    } else {
      newDestination = { type: 'http', url: '', method: 'POST' }; // Default
    }
    newDestinations[index] = newDestination;
    setChannel((prev) => ({ ...prev, destinations: newDestinations }));
  };

  const addDestination = () => {
    setChannel((prev) => ({
      ...prev,
      destinations: [...prev.destinations, { type: 'http', url: '', method: 'POST' }],
    }));
  };

  const removeDestination = (index: number) => {
    setChannel((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateChannel(id, channel);
      } else {
        await createChannel(channel);
      }
      navigate('/channels');
    } catch (err) {
      setError('Failed to save channel.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, letterSpacing: 1, mb: 3, textAlign: 'center' }}>
        {id ? t('edit_channel') : t('create_channel')}
      </Typography>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: 6, width: '100%', mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('channel_name')}
            name="name"
            value={channel.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          {!id && (
            <TextField
              label={t('channel_id')}
              name="id"
              value={channel.id || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              helperText={t('channel_id_helper')}
              InputLabelProps={{ sx: { fontWeight: 600 } }}
            />
          )}
          <TextField
            label={t('description')}
            name="description"
            value={channel.description || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            InputLabelProps={{ sx: { fontWeight: 600 } }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={channel.enabled}
                onChange={handleChange}
                name="enabled"
                color="primary"
              />
            }
            label={<span style={{ fontWeight: 600 }}>{t('enabled')}</span>}
            sx={{ mt: 1, mb: 2 }}
          />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* Source Configuration */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2, letterSpacing: 0.5 }}>
            {t('source_configuration')}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ fontWeight: 600 }}>{t('source_type')}</InputLabel>
            <Select
              value={channel.source.type}
              label="Source Type"
              onChange={handleSourceTypeChange}
            >
              <MenuItem value="http">{t('http_listener')}</MenuItem>
              <MenuItem value="tcp">{t('tcp_listener')}</MenuItem>
            </Select>
          </FormControl>

          {channel.source.type === 'http' && (
            <Box sx={{ ml: 2 }}>
              <TextField
                label={t('path')}
                name="path"
                value={(channel.source as HTTPSourceConfig).path}
                onChange={handleSourceChange}
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>{t('method')}</InputLabel>
                <Select
                  value={(channel.source as HTTPSourceConfig).method}
                  label={t('method')}
                  name="method"
                  onChange={handleSourceChange}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {channel.source.type === 'tcp' && (
            <Box sx={{ ml: 2 }}>
              <TextField
                label={t('port')}
                name="port"
                type="number"
                value={(channel.source as TCPSourceConfig).port}
                onChange={handleSourceChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={t('host')}
                name="host"
                value={(channel.source as TCPSourceConfig).host || ''}
                onChange={handleSourceChange}
                fullWidth
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={(channel.source as TCPSourceConfig).use_mllp || false}
                    onChange={(e) => handleSourceChange({ target: { name: 'use_mllp', value: e.target.checked } } as unknown as React.ChangeEvent<HTMLInputElement>)}
                    name="use_mllp"
                    color="primary"
                  />
                }
                label={t('use_mllp')}
              />
            </Box>
          )}

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* Filters Configuration */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2, letterSpacing: 0.5 }}>
            {t('filters')}
          </Typography>
          {channel.filters?.map((filter, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, ml: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Filter {index + 1} (Python Script)</Typography>
                <IconButton onClick={() => removeFilter(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Python Script"
                name="script"
                value={(filter as PythonScriptFilterConfig).script}
                onChange={(e) => handleFilterChange(index, e)}
                fullWidth
                margin="normal"
                multiline
                rows={6}
                required
                helperText="Return _passed = True to allow message, _passed = False to filter out. 'message' variable is available."
              />
            </Paper>
          ))}
          <Button startIcon={<AddIcon />} onClick={addFilter} variant="outlined" sx={{ mt: 2, borderRadius: 3, fontWeight: 600 }}>
            {t('add_filter')}
          </Button>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* Transformers Configuration */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2, letterSpacing: 0.5 }}>
            {t('transformers')}
          </Typography>
          {channel.transformers?.map((transformer, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, ml: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Transformer {index + 1} (Python Script)</Typography>
                <IconButton onClick={() => removeTransformer(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <TextField
                label="Python Script"
                name="script"
                value={(transformer as PythonScriptTransformerConfig).script}
                onChange={(e) => handleTransformerChange(index, e)}
                fullWidth
                margin="normal"
                multiline
                rows={6}
                required
                helperText="Set _transformed_message = new_message. 'message' variable is available."
              />
            </Paper>
          ))}
          <Button startIcon={<AddIcon />} onClick={addTransformer} variant="outlined" sx={{ mt: 2, borderRadius: 3, fontWeight: 600 }}>
            {t('add_transformer')}
          </Button>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          {/* Destinations Configuration */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2, letterSpacing: 0.5 }}>
            {t('destinations')}
          </Typography>
          {channel.destinations.map((destination, index) => (
            <Paper key={index} elevation={1} sx={{ p: { xs: 1, md: 2 }, mb: 2, mx: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">{t('destination_n', { n: index + 1 })}</Typography>
                <IconButton onClick={() => removeDestination(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>{t('destination_type')}</InputLabel>
                <Select
                  value={destination.type}
                  label={t('destination_type')}
                  onChange={(e) => handleDestinationTypeChange(index, e as SelectChangeEvent)}
                >
                  <MenuItem value="http">{t('http_sender')}</MenuItem>
                  <MenuItem value="tcp">{t('tcp_sender')}</MenuItem>
                </Select>
              </FormControl>

              {destination.type === 'http' && (
                <Box sx={{ ml: 2 }}>
                  <TextField
                    label={t('url') + ' *'}
                    name="url"
                    value={(destination as HTTPDestinationConfig).url}
                    onChange={(e) => handleDestinationChange(index, e)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>{t('method')}</InputLabel>
                    <Select
                      value={(destination as HTTPDestinationConfig).method}
                      label={t('method')}
                      name="method"
                      onChange={(e) => handleDestinationChange(index, e as SelectChangeEvent)}
                    >
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                      <MenuItem value="PUT">PUT</MenuItem>
                      <MenuItem value="DELETE">DELETE</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label={t('headers_json')}
                    name="headers"
                    value={JSON.stringify((destination as HTTPDestinationConfig).headers || {})}
                    onChange={(e) => {
                      try {
                        const headers = JSON.parse(e.target.value);
                        handleDestinationChange(index, { target: { name: 'headers', value: headers } } as React.ChangeEvent<HTMLInputElement>);
                      } catch (err) {
                        // Handle invalid JSON input
                        console.error("Invalid JSON for headers", err);
                      }
                    }}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    helperText={t('headers_helper')}
                  />
                </Box>
              )}

              {destination.type === 'tcp' && (
                <Box sx={{ ml: 2 }}>
                  <TextField
                    label={t('host')}
                    name="host"
                    value={(destination as TCPDestinationConfig).host}
                    onChange={(e) => handleDestinationChange(index, e)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label={t('port')}
                    name="port"
                    type="number"
                    value={(destination as TCPDestinationConfig).port}
                    onChange={(e) => handleDestinationChange(index, e)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={(destination as TCPDestinationConfig).use_mllp || false}
                        onChange={(e) => handleDestinationChange(index, { target: { name: 'use_mllp', value: e.target.checked } } as unknown as React.ChangeEvent<HTMLInputElement>)}
                        name="use_mllp"
                        color="primary"
                      />
                    }
                    label={t('use_mllp')}
                  />
                </Box>
              )}
            </Paper>
          ))}
          <Button startIcon={<AddIcon />} onClick={addDestination} variant="outlined" sx={{ mt: 2, borderRadius: 3, fontWeight: 600 }}>
            {t('add_destination')}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2, fontWeight: 600 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit" disabled={loading}
              sx={{ borderRadius: 3, fontWeight: 700, minWidth: 160, py: 1.2, fontSize: '1.1rem', boxShadow: 3 }}>
              {loading ? <CircularProgress size={24} /> : (id ? t('save_changes') : t('create'))}
            </Button>
            <Button variant="outlined" sx={{ borderRadius: 3, fontWeight: 600, minWidth: 120, py: 1.2, fontSize: '1.05rem' }} onClick={() => navigate('/channels')}>
              {t('cancel')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ChannelForm;
