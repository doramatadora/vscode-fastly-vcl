# Development

## Building and running this extension

```term
gh repo clone doramatadora/vscode-fastly-vcl
cd vscode-fastly-vcl
npm i
```

### Debugging

1. Open this folder in VS Code.
1. Press `Cmd+Shift+B` to start compiling the client and server in watch mode.
1. Press `Cmd+Shift+D` to switch to the **Run and Debug View** in the sidebar.
1. Select `Fastly VCL Client` from the drop down.
1. Press **▷** to run the launch config with the debugger attached (`F5`).
1. In the [Extension Development Host](https://code.visualstudio.com/api/get-started/your-first-extension#:~:text=Then%2C%20inside%20the%20editor%2C%20press%20F5.%20This%20will%20compile%20and%20run%20the%20extension%20in%20a%20new%20Extension%20Development%20Host%20window.) instance of VSCode, open a document in `Fastly VCL` language mode. 
1. Save the file with a `.vcl` extension. 
1. Use it as a scratchpad to try out all the features!

### Packaging and installation

Run the following command to compile the VSCode extension as a `.vsix` file.

```term
npm run package
```

1. Press `Cmd+Shift+X` to go to the VS Code extension tab.
1. Click the ellipsis (above "Search Extensions in Marketplace") and pick `Install from VSIX...` from the dropdown.
1. Install the `.vsix` file you created.

![How to install a VSIX](https://github.com/doramatadora/vscode-fastly-vcl/assets/12828487/090175b9-ae10-4982-a6b8-81f42998e587)

## Functionality

The Fastly VCL LSP server works for `.vcl` files. The server is still in an early state. It is usable but many advanced features have not yet been implemented.

### Supported protocol features
- [ ] textDocument/codeAction
- [x] textDocument/completion (incl. completion/resolve)
- [ ] textDocument/definition
- [x] textDocument/didChange (incremental)
- [x] textDocument/didClose
- [x] textDocument/didOpen
- [x] textDocument/didSave
- [ ] textDocument/documentHighlight
- [x] textDocument/documentSymbol
- [ ] textDocument/executeCommand
- [ ] textDocument/formatting
- [x] textDocument/hover
- [ ] textDocument/inlayHint (no support for inlayHint/resolve or workspace/inlayHint/refresh)
- [ ] textDocument/prepareCallHierarchy
- [ ] callHierarchy/incomingCalls
- [ ] callHierarchy/outgoingCalls
- [ ] textDocument/prepareRename
- [ ] textDocument/rangeFormatting
- [ ] textDocument/references
- [ ] textDocument/rename
- [ ] textDocument/selectionRange
- [x] textDocument/signatureHelp
- [ ] workspace/symbol
- [x] workspace/didChangeConfiguration
- [ ] workspace/executeCommand
