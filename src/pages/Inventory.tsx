import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { CatalogItem } from '../types';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import CatalogForm from '../components/CatalogForm';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for Edit/View modes
  const [editingItem, setEditingItem] = useState<CatalogItem | undefined>(undefined);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const data = db.getInventorySummary();
    setItems(data);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    loadItems();
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (item: CatalogItem) => {
    setEditingItem(item);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item do catálogo?')) {
      db.deleteCatalogItem(id);
      loadItems();
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.casNumber?.includes(searchTerm)
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Catálogo de Inventário
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas definições de químicos e equipamentos.
            </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ borderRadius: 2 }}
        >
          Adicionar Item
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
        <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar por nome, CAS ou código..."
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
        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome do Item</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CAS / Specs</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>GHS</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Estoque Total</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle2" fontWeight="medium">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.id}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.category === 'CHEMICAL' ? 'Químico' : item.category === 'EQUIPMENT' ? 'Equipamento' : item.category}
                    size="small"
                    color={item.category === 'CHEMICAL' ? 'secondary' : 'default'}
                    variant={item.category === 'CHEMICAL' ? 'filled' : 'outlined'}
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>{item.casNumber || item.molecularFormula || '-'}</TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {item.ghsPictograms?.length > 0 ? (
                        item.ghsPictograms.map((p: string) => (
                          <Tooltip key={p} title={p}>
                              <Box
                                component="span"
                                sx={{
                                    width: 24,
                                    height: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'error.50',
                                    border: '1px solid',
                                    borderColor: 'error.200',
                                    color: 'error.main',
                                    borderRadius: 0.5,
                                    fontSize: 10,
                                    fontWeight: 'bold'
                                }}
                              >
                                {p.replace('GHS','')}
                              </Box>
                          </Tooltip>
                        ))
                      ) : (
                        <Typography variant="caption" color="text.disabled">-</Typography>
                      )}
                    </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium">
                    {item.totalQuantity} <Typography component="span" variant="caption" color="text.secondary">Unidades/L</Typography>
                  </Typography>
                  {item.totalQuantity < item.minStockLevel && (
                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5, color: 'error.main' }}>
                         <WarningIcon sx={{ fontSize: 14 }} />
                         <Typography variant="caption" fontWeight="bold">Estoque Baixo</Typography>
                       </Box>
                  )}
                </TableCell>
                <TableCell align="right">
                    <Tooltip title="Ver Detalhes">
                        <IconButton size="small" onClick={() => handleView(item)}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(item)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum item encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isModalOpen && (
        <CatalogForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialItem={editingItem}
          readonly={isViewMode}
        />
      )}
    </Container>
  );
};

export default Inventory;
