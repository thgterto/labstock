import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { Batch, CatalogItem, Location } from '../types';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  RemoveCircle as RemoveCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import BatchForm from '../components/BatchForm';

const Batches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBatches(db.getBatches());
    setCatalog(db.getCatalog());
    setLocations(db.getLocations());
  };

  const getCatalogItemName = (id: string) => {
    return catalog.find(c => c.id === id)?.name || 'Item Desconhecido';
  };

  const getLocationName = (id: string) => {
    return locations.find(l => l.id === id)?.name || 'Local Desconhecido';
  };

  const filteredBatches = batches.filter(batch => {
    const itemName = getCatalogItemName(batch.catalogId).toLowerCase();
    const lot = batch.lotNumber.toLowerCase();
    const search = searchTerm.toLowerCase();
    return itemName.includes(search) || lot.includes(search);
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lote?')) {
      db.deleteBatch(id);
      loadData();
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBatch(undefined);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    loadData();
    setIsModalOpen(false);
  };

  const handleConsume = (batch: Batch) => {
    const amountStr = prompt(`Quantidade Atual: ${batch.quantity} ${batch.unit}\nQuanto deseja consumir?`);
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Quantidade inválida');
      return;
    }

    if (amount > batch.quantity) {
      alert('Não é possível consumir mais que a quantidade disponível');
      return;
    }

    const newQuantity = batch.quantity - amount;
    const updatedBatch = { ...batch, quantity: newQuantity };

    if (newQuantity === 0) {
       // Ask if user wants to delete or keep as empty
       if (confirm('O lote está vazio. Deseja excluí-lo?')) {
         db.deleteBatch(batch.id);
       } else {
         db.updateBatch(updatedBatch);
       }
    } else {
      db.updateBatch(updatedBatch);
    }
    loadData();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Gerenciamento de Lotes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Rastreie lotes de inventário, validades e localizações.
            </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ borderRadius: 2 }}
        >
          Adicionar Lote
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
        <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar por nome do item ou número do lote..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    size="small"
                />
            </Grid>
            <Grid>
                <Button startIcon={<FilterListIcon />} color="inherit">
                    Filtros
                </Button>
            </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="batches table">
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome do Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Número do Lote</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Localização</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Validade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBatches.map((batch) => {
               const isExpired = batch.expiryDate && batch.expiryDate < Date.now();
               return (
                  <TableRow
                    key={batch.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="subtitle2" fontWeight="medium">{getCatalogItemName(batch.catalogId)}</Typography>
                    </TableCell>
                    <TableCell>{batch.lotNumber}</TableCell>
                    <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                            {batch.quantity} <Typography component="span" variant="caption" color="text.secondary">{batch.unit}</Typography>
                        </Typography>
                    </TableCell>
                    <TableCell>{getLocationName(batch.locationId)}</TableCell>
                    <TableCell>
                        {batch.expiryDate ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: isExpired ? 'error.main' : 'text.secondary' }}>
                                <EventIcon fontSize="small" />
                                <Typography variant="body2" fontWeight={isExpired ? 'bold' : 'regular'}>
                                    {new Date(batch.expiryDate).toLocaleDateString()}
                                </Typography>
                                {isExpired && <WarningIcon fontSize="small" />}
                            </Box>
                        ) : <Typography variant="caption" color="text.disabled">-</Typography>}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                            batch.qaStatus === 'approved' ? 'Aprovado' :
                            batch.qaStatus === 'quarantine' ? 'Quarentena' :
                            batch.qaStatus === 'rejected' ? 'Rejeitado' :
                            batch.qaStatus === 'expired' ? 'Vencido' : batch.qaStatus
                        }
                        size="small"
                        color={
                            batch.qaStatus === 'approved' ? 'success' :
                            batch.qaStatus === 'quarantine' ? 'warning' :
                            batch.qaStatus === 'rejected' ? 'error' : 'default'
                        }
                        variant={batch.qaStatus === 'approved' ? 'filled' : 'outlined'}
                        sx={{ borderRadius: 1, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                        <Tooltip title="Consumir">
                            <IconButton size="small" color="success" onClick={() => handleConsume(batch)}>
                                <RemoveCircleIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton size="small" color="primary" onClick={() => handleEdit(batch)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                            <IconButton size="small" color="error" onClick={() => handleDelete(batch.id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                  </TableRow>
               );
            })}
            {filteredBatches.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum lote encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <BatchForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialBatch={editingBatch}
        />
      )}
    </Container>
  );
};

export default Batches;
