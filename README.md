# [Experimental] Fastly VCL language support for Visual Studio Code

> 🩷 Please leave feedback via [Github issues](https://github.com/doramatadora/vscode-fastly-vcl/issues) 🩷

This is a WIP by [Dora](https://github.com/doramatadora). The aim is to publish a Language Server for [Fastly VCL](https://developer.fastly.com/learning/vcl/using). For now, I'm building this out in the context of a VSCode extension. Follow along for:

- [x] Syntax highlighting
- [x] Diagnostics regenerated on each file change or configuration change
- [x] Completions
- [x] Boilerplate snippets
- [x] Signature help
- [x] Contextual autocomplete
- [ ] Step-over debugging
- [ ] Go to definition
- [ ] Server-side syntax highlighting
- [ ] Config flow to turn features on/off, with `.vclrc`

## Functionality

The Fastly VCL Language Server works for `.vcl` files.

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

```term
npm run publish
```
(Don't worry, you won't be publishing anything. You'll get a `.vsix` file.)

1. Press `Cmd+Shift+X` to go to the VS Code extension tab.
1. Click the ellipsis (above "Search Extensions in Marketplace") and go with `Install from VSIX...`
1. Install the `.vsix` file you created.

![How to install a VSIX](https://github.com/doramatadora/vscode-fastly-vcl/assets/12828487/090175b9-ae10-4982-a6b8-81f42998e587)
