import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { Batch, CatalogItem, Location } from '../types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, LocalPharmacy, Inventory as InventoryIcon, Event as EventIcon } from '@mui/icons-material';

interface BatchFormProps {
  onClose: () => void;
  onSave: () => void;
  initialBatch?: Batch;
}

const BatchForm: React.FC<BatchFormProps> = ({ onClose, onSave, initialBatch }) => {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState<Partial<Batch>>({
    catalogId: '',
    lotNumber: '',
    quantity: 0,
    unit: 'L', // Default to L, but should probably infer from item
    locationId: '',
    qaStatus: 'quarantine', // Default for new batches
    expiryDate: undefined,
  });

  const [expiryDateString, setExpiryDateString] = useState('');

  useEffect(() => {
    setCatalog(db.getCatalog());
    setLocations(db.getLocations());

    if (initialBatch) {
      setFormData(initialBatch);
      if (initialBatch.expiryDate) {
        setExpiryDateString(new Date(initialBatch.expiryDate).toISOString().split('T')[0]);
      }
    }
  }, [initialBatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.catalogId || !formData.lotNumber || !formData.locationId) return;

    const batchToSave: Batch = {
      ...formData,
      id: initialBatch?.id || `BAT-${Date.now()}`,
      expiryDate: expiryDateString ? new Date(expiryDateString).getTime() : undefined,
    } as Batch;

    if (initialBatch) {
      db.updateBatch(batchToSave);
    } else {
      db.addBatch(batchToSave);
    }

    onSave();
  };

  return (
    <Dialog
        open={true}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
            sx: { borderRadius: 3 }
        }}
    >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
                {initialBatch ? 'Editar Lote' : 'Receber Novo Lote'}
            </Typography>
            <IconButton onClick={onClose} aria-label="close">
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                        <InputLabel id="catalog-label">Item do Catálogo</InputLabel>
                        <Select
                            labelId="catalog-label"
                            id="catalog"
                            value={formData.catalogId}
                            label="Item do Catálogo"
                            onChange={(e) => setFormData({...formData, catalogId: e.target.value})}
                            disabled={!!initialBatch}
                            required
                        >
                            <MenuItem value=""><em>Selecione um Item...</em></MenuItem>
                            {catalog.map(item => (
                                <MenuItem key={item.id} value={item.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalPharmacy fontSize="small" color="primary" />
                                        {item.name} <Typography variant="caption" color="text.secondary">({item.id})</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        margin="dense"
                        id="lotNumber"
                        label="Número do Lote"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.lotNumber}
                        onChange={(e) => setFormData({...formData, lotNumber: e.target.value})}
                        required
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        margin="dense"
                        id="expiryDate"
                        label="Validade"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={expiryDateString}
                        onChange={(e) => setExpiryDateString(e.target.value)}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        margin="dense"
                        id="quantity"
                        label="Quantidade"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                        required
                        inputProps={{ min: 0, step: "any" }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="unit-label">Unidade</InputLabel>
                        <Select
                            labelId="unit-label"
                            id="unit"
                            value={formData.unit}
                            label="Unidade"
                            onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        >
                            <MenuItem value="L">L</MenuItem>
                            <MenuItem value="mL">mL</MenuItem>
                            <MenuItem value="g">g</MenuItem>
                            <MenuItem value="kg">kg</MenuItem>
                            <MenuItem value="units">unidades</MenuItem>
                            <MenuItem value="pcs">pçs</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="status-label">Status de QA</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={formData.qaStatus}
                            label="Status de QA"
                            onChange={(e) => setFormData({...formData, qaStatus: e.target.value as Batch['qaStatus']})}
                        >
                            <MenuItem value="quarantine">Quarentena</MenuItem>
                            <MenuItem value="approved">Aprovado</MenuItem>
                            <MenuItem value="rejected">Rejeitado</MenuItem>
                            <MenuItem value="expired">Vencido</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                        <InputLabel id="location-label">Localização</InputLabel>
                        <Select
                            labelId="location-label"
                            id="location"
                            value={formData.locationId}
                            label="Localização"
                            onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                            required
                        >
                            <MenuItem value=""><em>Selecione a Localização...</em></MenuItem>
                            {locations.map(loc => (
                                <MenuItem key={loc.id} value={loc.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <InventoryIcon fontSize="small" color="action" />
                                        {loc.name} <Typography variant="caption" color="text.secondary">({loc.code})</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} color="inherit">
                Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained">
                {initialBatch ? 'Atualizar Lote' : 'Receber Lote'}
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default BatchForm;
