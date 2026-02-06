# Material Design Migration Specification

## Overview
This track aims to apply Google's Material Design 3 (Material You) system to the application using `@mui/material`.

## Requirements

### 1. Theming
- Implement a custom theme using `createTheme` from MUI.
- Define primary, secondary, and error colors consistent with Material You.
- Use `Roboto` font for typography.
- Enable `CssBaseline` for consistent resets.

### 2. Layout
- Replace custom sidebar with `Drawer` (persistent or permanent).
- Replace top bar with `AppBar`.
- Use `Toolbar` for vertical alignment.

### 3. Components
- Replace all HTML elements (`div`, `input`, `button`, `select`) with corresponding MUI components:
    - `Button` (Contained, Outlined, Text).
    - `TextField` (Outlined).
    - `Select` (Standard or Outlined).
    - `Table`, `TableContainer`, `TableHead`, `TableRow`, `TableCell`.
    - `Card`, `CardContent`, `CardActions`.
    - `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`.
    - `Typography` for all text.
    - `Grid` or `Box` for layout.

### 4. Icons
- Switch to `@mui/icons-material` where appropriate, or keep Lucide if style matches. (Start with keeping Lucide inside MUI components for simplicity, or replace if needed). *Correction: Plan says `npm install @mui/icons-material`, so we should use them.*

### 5. Responsiveness
- Ensure all layouts are responsive using MUI Grid system (`Grid` component).
