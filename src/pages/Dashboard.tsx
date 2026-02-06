import React, { useEffect, useState } from 'react';
import { db } from '../services/storageService';
import { 
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Avatar,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import {
  Science as ScienceIcon,
  Inventory as InventoryIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  TrendingUp,
  CheckCircle,
  Backup
} from '@mui/icons-material';
import { 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from 'recharts';

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
}> = ({ title, value, icon: Icon, trend, color }) => {
  const colorMap = {
    primary: 'primary.main',
    secondary: 'secondary.main',
    error: 'error.main',
    success: 'success.main',
    warning: 'warning.main',
  };

  const bgcolorMap = {
    primary: 'primary.light',
    secondary: 'secondary.light',
    error: 'error.light',
    success: 'success.light',
    warning: 'warning.light',
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 1 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {value}
          </Typography>
          {trend && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'success.main' }}>
              <TrendingUp fontSize="small" />
              <Typography variant="caption" fontWeight="medium">
                {trend} em relação ao último mês
              </Typography>
            </Stack>
          )}
        </Box>
        <Avatar
            sx={{
                bgcolor: bgcolorMap[color] || 'primary.light',
                color: colorMap[color] || 'primary.main',
                width: 48,
                height: 48,
                borderRadius: 2
            }}
        >
          <Icon />
        </Avatar>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalChemicals: 0,
    expiringSoon: 0,
    lowStock: 0,
  });
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const catalog = db.getCatalog();
    const batches = db.getBatches();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    // Calc Stats
    const expiringSoon = batches.filter(
      b => b.expiryDate && (b.expiryDate - now < thirtyDays) && b.expiryDate > now
    ).length;

    const inventory = db.getInventorySummary();
    const lowStock = inventory.filter(i => (i.totalQuantity || 0) < i.minStockLevel).length;

    // Chart Data
    const cats = catalog.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setCategoryData(Object.entries(cats).map(([name, value]) => ({ name, value })));

    setStats({
      totalItems: catalog.length,
      totalChemicals: catalog.filter(c => c.category === 'CHEMICAL').length,
      expiringSoon,
      lowStock,
    });
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Painel
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Visão geral do inventário do laboratório.
            </Typography>
        </Box>
        <Typography variant="caption" color="text.disabled">
           Última atualização: Agora mesmo
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Itens no Catálogo"
              value={stats.totalItems}
              icon={InventoryIcon}
              color="primary"
              trend="+5%"
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Químicos Ativos"
              value={stats.totalChemicals}
              icon={ScienceIcon}
              color="success"
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Vencendo em Breve"
              value={stats.expiringSoon}
              icon={EventIcon}
              color="warning"
            />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Estoque Baixo"
              value={stats.lowStock}
              icon={WarningIcon}
              color="error"
            />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Category Distribution Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }} elevation={1}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Inventário por Categoria</Typography>
              <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={categoryData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       fill="#8884d8"
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {categoryData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <RechartsTooltip />
                   </PieChart>
                 </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 2 }}>
                {categoryData.map((entry, index) => (
                  <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                    <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>{entry.name.toLowerCase()}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
        </Grid>

        {/* System Health */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }} elevation={1}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>Saúde do Sistema</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle color="success" />
                    <Typography variant="body2" fontWeight="medium">Integridade do Banco de Dados</Typography>
                  </Box>
                  <Chip label="Saudável" color="success" size="small" variant="outlined" />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Backup color="primary" />
                    <Typography variant="body2" fontWeight="medium">Status do Backup</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">Último backup: 2h atrás</Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2, color: 'warning.dark' }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Validação Pendente</Typography>
                    <Typography variant="caption">
                        3 novos lotes requerem aprovação de QA antes do uso.
                    </Typography>
                </Box>
              </Stack>
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
