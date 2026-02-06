import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { CatalogItem, Category } from '../types';
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
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { Science as ScienceIcon, Close as CloseIcon, LocalPharmacy, Construction, Hardware } from '@mui/icons-material';

interface CatalogFormProps {
  onClose: () => void;
  onSave: () => void;
  initialItem?: CatalogItem;
  readonly?: boolean;
}

const CatalogForm: React.FC<CatalogFormProps> = ({ onClose, onSave, initialItem, readonly = false }) => {
  const [formData, setFormData] = useState<Partial<CatalogItem>>({
    name: '',
    category: 'CHEMICAL',
    minStockLevel: 0,
    ghsPictograms: [],
    ghsHazards: [],
    description: '',
    casNumber: '',
    molecularFormula: '',
  });

  useEffect(() => {
    if (initialItem) {
      setFormData(initialItem);
    }
  }, [initialItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readonly) return;
    if (!formData.name) return;

    const itemToSave: CatalogItem = {
      ...formData,
      id: initialItem?.id || `CAT-${Date.now()}`,
    } as CatalogItem;

    if (initialItem) {
      db.updateCatalogItem(itemToSave);
    } else {
      db.addCatalogItem(itemToSave);
    }

    onSave();
  };

  const handleChange = (field: keyof CatalogItem, value: any) => {
    if (readonly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGhsPictogram = (pictogram: string) => {
      if (readonly) return;
      const current = formData.ghsPictograms || [];
      const updated = current.includes(pictogram)
        ? current.filter(p => p !== pictogram)
        : [...current, pictogram];
      handleChange('ghsPictograms', updated);
  };

  const AVAILABLE_GHS = ['GHS01', 'GHS02', 'GHS03', 'GHS04', 'GHS05', 'GHS06', 'GHS07', 'GHS08', 'GHS09'];

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
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} component="div">
            <Typography variant="h6" fontWeight="bold" component="div">
                {readonly ? 'Detalhes do Item' : initialItem ? 'Editar Item' : 'Adicionar Novo Item'}
            </Typography>
            <IconButton onClick={onClose} aria-label="close">
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <TextField
                        autoFocus={!readonly && !initialItem}
                        margin="dense"
                        id="name"
                        label="Nome do Item"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={readonly}
                        required={!readonly}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel id="category-label">Categoria</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={formData.category}
                            label="Categoria"
                            onChange={(e) => handleChange('category', e.target.value as Category)}
                            disabled={readonly}
                        >
                            <MenuItem value="CHEMICAL"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocalPharmacy fontSize="small" /> Químico</Box></MenuItem>
                            <MenuItem value="EQUIPMENT"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Hardware fontSize="small" /> Equipamento</Box></MenuItem>
                            <MenuItem value="GLASSWARE"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ScienceIcon fontSize="small" /> Vidraria</Box></MenuItem>
                            <MenuItem value="TOOL"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Construction fontSize="small" /> Ferramenta</Box></MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                     <TextField
                        margin="dense"
                        id="minStock"
                        label="Estoque Mínimo"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.minStockLevel}
                        onChange={(e) => handleChange('minStockLevel', parseInt(e.target.value) || 0)}
                        disabled={readonly}
                    />
                </Grid>

                {formData.category === 'CHEMICAL' && (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2, border: '1px solid', borderColor: 'primary.100' }}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LocalPharmacy color="primary" fontSize="small" />
                                <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                                    Propriedades Químicas
                                </Typography>
                             </Box>
                             <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        size="small"
                                        label="Número CAS"
                                        fullWidth
                                        value={formData.casNumber || ''}
                                        onChange={(e) => handleChange('casNumber', e.target.value)}
                                        disabled={readonly}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField
                                        size="small"
                                        label="Fórmula Molecular"
                                        fullWidth
                                        value={formData.molecularFormula || ''}
                                        onChange={(e) => handleChange('molecularFormula', e.target.value)}
                                        disabled={readonly}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" display="block" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                                        Perigos GHS
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {readonly ? (
                                            formData.ghsPictograms?.length ? (
                                                formData.ghsPictograms.map(p => (
                                                    <Chip
                                                        key={p}
                                                        label={p}
                                                        color="error"
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                ))
                                            ) : <Typography variant="caption" fontStyle="italic">Nenhum perigo detectado</Typography>
                                        ) : (
                                            AVAILABLE_GHS.map(p => (
                                                <Chip
                                                    key={p}
                                                    label={p}
                                                    clickable
                                                    onClick={() => toggleGhsPictogram(p)}
                                                    color={formData.ghsPictograms?.includes(p) ? 'error' : 'default'}
                                                    variant={formData.ghsPictograms?.includes(p) ? 'filled' : 'outlined'}
                                                />
                                            ))
                                        )}
                                    </Box>
                                </Grid>
                             </Grid>
                        </Box>
                    </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                    <TextField
                        margin="dense"
                        id="description"
                        label="Descrição"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        disabled={readonly}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} color="inherit">
                {readonly ? 'Fechar' : 'Cancelar'}
            </Button>
            {!readonly && (
                <Button onClick={handleSubmit} variant="contained" disabled={!formData.name}>
                    {initialItem ? 'Salvar Alterações' : 'Salvar Item'}
                </Button>
            )}
        </DialogActions>
    </Dialog>
  );
};

export default CatalogForm;
