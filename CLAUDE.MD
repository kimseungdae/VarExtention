# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VSCode extension project that provides variable documentation tooltips. The extension:

- Shows variable descriptions from `info_doc/var-doc.json` when hovering over variables in `.ts`, `.js`, `.vue` files
- Displays workspace usage locations for the hovered variable
- Uses markdown tooltips with clickable file links

## Architecture

The extension follows standard VSCode extension structure:
- `package.json` - Extension manifest with activation events and contributions
- `src/extension.ts` - Main extension entry point with hover provider registration
- `info_doc/var-doc.json` - Variable documentation mapping file

Key components:
- **HoverProvider**: Registered for TypeScript, JavaScript, and Vue files using `vscode.languages.registerHoverProvider`
- **Variable Documentation**: JSON-based mapping of variable names to descriptions
- **Workspace Search**: Uses `vscode.workspace.findFiles` with text search to locate variable usage
- **Tooltip Rendering**: Uses `vscode.MarkdownString` for rich tooltip content with file links

## Development Commands

Since this is a VSCode extension project, typical commands would be:
- `npm install` - Install dependencies
- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch mode for development
- `F5` in VSCode - Launch extension development host
- `npm run package` - Package extension with vsce

## Key Technical Details

- Uses `vscode.languages.registerHoverProvider` for hover functionality
- Variable documentation stored in JSON format at `info_doc/var-doc.json`
- Supports workspace-wide variable usage search
- Tooltip content includes variable description and usage locations
- File links in tooltips use VSCode's command API for navigation
- Performance considerations for large workspace searches

## Configuration

Extension may support user settings for:
- Custom `info_doc` directory path
- File type inclusions/exclusions for hover support
- Search optimization settings