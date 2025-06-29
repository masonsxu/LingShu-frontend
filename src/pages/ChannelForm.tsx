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
import React, { useEffect, useState } from 'react';
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

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setChannel((prev) => ({
      ...prev,
      source: {
        ...prev.source,
        [name as string]: value,
      } as SourceConfig,
    }));
  };

  const handleSourceTypeChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
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

  const handleDestinationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    const newDestinations = [...channel.destinations];
    newDestinations[index] = { ...newDestinations[index], [name as string]: value } as DestinationConfig;
    setChannel((prev) => ({ ...prev, destinations: newDestinations }));
  };

  const handleDestinationTypeChange = (index: number, e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {id ? 'Edit Channel' : 'Create New Channel'}
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Channel Name"
            name="name"
            value={channel.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          {!id && (
            <TextField
              label="Channel ID"
              name="id"
              value={channel.id || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              helperText="Unique identifier for the channel. Cannot be changed after creation."
            />
          )}
          <TextField
            label="Description"
            name="description"
            value={channel.description || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
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
            label="Enabled"
          />

          <Divider sx={{ my: 4 }} />

          {/* Source Configuration */}
          <Typography variant="h5" gutterBottom>Source Configuration</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Source Type</InputLabel>
            <Select
              value={channel.source.type}
              label="Source Type"
              onChange={handleSourceTypeChange}
            >
              <MenuItem value="http">HTTP Listener</MenuItem>
              <MenuItem value="tcp">TCP Listener</MenuItem>
            </Select>
          </FormControl>

          {channel.source.type === 'http' && (
            <Box sx={{ ml: 2 }}>
              <TextField
                label="Path"
                name="path"
                value={(channel.source as HTTPSourceConfig).path}
                onChange={handleSourceChange}
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Method</InputLabel>
                <Select
                  value={(channel.source as HTTPSourceConfig).method}
                  label="Method"
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
                label="Port"
                name="port"
                type="number"
                value={(channel.source as TCPSourceConfig).port}
                onChange={handleSourceChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Host"
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
                    onChange={(e) => handleSourceChange({ target: { name: 'use_mllp', value: e.target.checked } } as React.ChangeEvent<HTMLInputElement>)}
                    name="use_mllp"
                    color="primary"
                  />
                }
                label="Use MLLP"
              />
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Filters Configuration */}
          <Typography variant="h5" gutterBottom>Filters</Typography>
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
          <Button startIcon={<AddIcon />} onClick={addFilter} variant="outlined" sx={{ mt: 2 }}>
            Add Filter
          </Button>

          <Divider sx={{ my: 4 }} />

          {/* Transformers Configuration */}
          <Typography variant="h5" gutterBottom>Transformers</Typography>
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
          <Button startIcon={<AddIcon />} onClick={addTransformer} variant="outlined" sx={{ mt: 2 }}>
            Add Transformer
          </Button>

          <Divider sx={{ my: 4 }} />

          {/* Destinations Configuration */}
          <Typography variant="h5" gutterBottom>Destinations</Typography>
          {channel.destinations.map((destination, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, ml: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Destination {index + 1}</Typography>
                <IconButton onClick={() => removeDestination(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>Destination Type</InputLabel>
                <Select
                  value={destination.type}
                  label="Destination Type"
                  onChange={(e) => handleDestinationTypeChange(index, e)}
                >
                  <MenuItem value="http">HTTP Sender</MenuItem>
                  <MenuItem value="tcp">TCP Sender</MenuItem>
                </Select>
              </FormControl>

              {destination.type === 'http' && (
                <Box sx={{ ml: 2 }}>
                  <TextField
                    label="URL"
                    name="url"
                    value={(destination as HTTPDestinationConfig).url}
                    onChange={(e) => handleDestinationChange(index, e)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Method</InputLabel>
                    <Select
                      value={(destination as HTTPDestinationConfig).method}
                      label="Method"
                      name="method"
                      onChange={(e) => handleDestinationChange(index, e)}
                    >
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                      <MenuItem value="PUT">PUT</MenuItem>
                      <MenuItem value="DELETE">DELETE</MenuItem>
                    </Select>
                  </FormControl>
                  {/* Headers can be added here as a JSON string or key-value pairs */}
                  <TextField
                    label="Headers (JSON)"
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
                    helperText={'Enter headers as a JSON object, e.g., {"Content-Type": "application/json"}'}
                  />
                </Box>
              )}

              {destination.type === 'tcp' && (
                <Box sx={{ ml: 2 }}>
                  <TextField
                    label="Host"
                    name="host"
                    value={(destination as TCPDestinationConfig).host}
                    onChange={(e) => handleDestinationChange(index, e)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Port"
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
                        onChange={(e) => handleDestinationChange(index, { target: { name: 'use_mllp', value: e.target.checked } } as React.ChangeEvent<HTMLInputElement>)}
                        name="use_mllp"
                        color="primary"
                      />
                    }
                    label="Use MLLP"
                  />
                </Box>
              )}
            </Paper>
          ))}
          <Button startIcon={<AddIcon />} onClick={addDestination} variant="outlined" sx={{ mt: 2 }}>
            Add Destination
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (id ? 'Save Changes' : 'Create Channel')}
            </Button>
            <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate('/channels')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ChannelForm;
