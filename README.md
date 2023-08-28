# [Experimental] Fastly VCL language support for Visual Studio Code

This is the unofficial, work-in-progress [Language Server Protocol (LSP)](https://github.com/Microsoft/language-server-protocol) implementation for [Fastly VCL](https://developer.fastly.com/learning/vcl/using). You can install the official Fastly extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=fastly.vscode-fastly-vcl).

> Feedback and feature requests: [Github issues](https://github.com/doramatadora/vscode-fastly-vcl/issues)

## Functionality

This extension is still in an early state. It is usable but many advanced features have not yet been implemented. Currently supported features:

- [x] Syntax highlighting
- [x] Diagnostics
- [x] Completions
- [x] Boilerplate snippets
- [x] Signature help
- [x] Documentation on hover

### Syntax highlighting

![Syntax highlighting](https://github.com/doramatadora/vscode-fastly-vcl/assets/12828487/b6d6af32-9dcc-4148-a90b-9ceb56cdeb3c)

### Diagnostics (with [falco](https://github.com/ysugimoto/falco))

![Diagnostics](https://github.com/doramatadora/vscode-fastly-vcl/assets/12828487/844e7f9d-63d7-4d32-9716-5a8e6cc871f5)

### Contextual completions

Completions include:
* VCL functions
* VCL variables
* HTTP headers
* Subroutine snippets
* Fastly macros

![Completions](https://github.com/doramatadora/vscode-fastly-vcl/assets/12828487/79a02caa-6307-4785-b717-a9b508aee4f5)

### Signature help

![Signature help](https://github.com/doramatadora/vscode-fastly-vcl/assets/12828487/e52612d1-4429-4371-8da1-4f7aa352a56b)

### Documentation on hover

![Hover](https://github.com/doramatadora/vscode-fastly-vcl/assets/12828487/73c0148f-f7bc-4708-a34f-2aad17fde9da)


