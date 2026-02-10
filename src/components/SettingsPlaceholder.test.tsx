import { render, screen } from '@testing-library/react';
import SettingsPlaceholder from './SettingsPlaceholder';

describe('SettingsPlaceholder', () => {
  it('renders correctly', () => {
    render(<SettingsPlaceholder />);
    expect(screen.getByText('Configurações do Sistema')).toBeInTheDocument();
    expect(screen.getByText('Configure agendamentos de backup, funções de usuário e conexões de impressora aqui.')).toBeInTheDocument();
  });
});
