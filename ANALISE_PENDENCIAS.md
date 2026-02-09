# Análise de Pendências - LabControl 2.0 Web

## 1. Gerenciamento de Catálogo (CRUD)
*   **Edição (Update):**
    *   **Status:** Pendente.
    *   **Descrição:** Não existe funcionalidade para editar um Item de Catálogo existente (ex: corrigir nome, alterar estoque mínimo). O botão de opções (`MoreHorizontal`) na tabela de Inventário não possui ações implementadas.
*   **Exclusão (Delete):**
    *   **Status:** Pendente.
    *   **Descrição:** Não é possível excluir Itens de Catálogo.

## 2. Gerenciamento de Lotes (CRUD)
*   **Validação de Formulário:**
    *   **Status:** Bug / Pendência de UX.
    *   **Descrição:** O botão de salvar no modal de criação/edição de lotes está fora da tag `<form>`, o que impede que a validação nativa do HTML (atributos `required`) funcione corretamente antes da submissão.
*   **Edição/Exclusão:**
    *   **Status:** Implementado (em `Batches.tsx`), mas desconectado do Histórico.

## 3. Gerenciamento de Locais (CRUD)
*   **CRUD Completo:**
    *   **Status:** Pendente.
    *   **Descrição:** Os locais (`Locations`) são hardcoded no código (`INITIAL_LOCATIONS` em `storageService.ts`). Não há interface para criar, editar ou excluir locais de armazenamento (salas, armários, freezers).

## 4. Importação e Exportação de Dados
*   **Importação em Massa (CSV/Excel):**
    *   **Status:** Pendente.
    *   **Descrição:** Não há funcionalidade para importar dados de planilhas. A entrada de dados é exclusivamente manual, item por item.
*   **Exportação:**
    *   **Status:** Parcial.
    *   **Descrição:** Existe um backup em JSON proprietário, mas não há exportação em formatos intercambiáveis (CSV) para relatórios externos.
    *   **Nota:** A funcionalidade de "Restaurar Backup" em `Settings.tsx` é apenas uma simulação (mock) e não processa o arquivo real.

## 5. Visualização e Matriz de Armazenamento
*   **Lógica de Preenchimento da Matriz:**
    *   **Status:** Primitiva / Pendente.
    *   **Descrição:** A visualização em grade (`StorageMatrix.tsx`) preenche os espaços sequencialmente baseada na lista de lotes. Não há suporte para definir posições físicas reais (ex: Prateleira A, Posição 3). Se um item for removido do meio, os outros deslizam, o que não reflete a realidade física.
*   **Filtros e Ordenação:**
    *   **Status:** Básico.
    *   **Descrição:** As listagens possuem busca simples por texto, mas carecem de filtros avançados (por categoria, data de validade, local) e ordenação nas colunas.

## 6. Histórico e Rastreabilidade
*   **Implementação Real:**
    *   **Status:** Pendente.
    *   **Descrição:** A página `History.tsx` exibe dados mockados (`MOCK_HISTORY`). As ações realizadas no sistema (criar lote, consumir item) não geram registros de log no banco de dados (`storageService`), tornando a rastreabilidade inexistente.
