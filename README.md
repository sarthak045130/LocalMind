# LocalMind

**A local AI chat app for supported browsers and desktop computers.** [Launch the live app](https://sarthak045130.github.io/LocalMind/). Your chats, attached files, and model inference stay on your device. After the first setup, chat works without an internet connection.

LocalMind is an early release. Support depends on the browser, operating system, GPU, and available memory. It cannot run on every device, and the mobile browser install is a web app rather than a native phone app.

## What it does

- Runs Qwen 2.5 Instruct models in the browser with WebLLM and WebGPU.
- Saves chats and attached files in the browser's local storage.
- Searches saved chats and extracted text for relevant context.
- Reads text files, PDFs, and printed English text in images (OCR).
- Includes a basic answer-checking mode, arithmetic helper, and optional Wikipedia search.
- Supports local backup export and import.

## Device support

| Device | How to run it | Requirements and limits |
|---|---|---|
| macOS | Install the website from a supported browser, or use the desktop DMG | WebGPU-capable browser/device; desktop DMG is unsigned |
| Windows | Install the website from Chrome or Edge, or use the desktop installer | WebGPU-capable browser/device; desktop installer is unsigned and x64 only |
| Android | Open the hosted website in Chrome and install it from the browser menu | Recent Chrome, WebGPU support, and enough free memory; this is a PWA, not an APK |
| iPhone / iPad | Open the hosted website in Safari and choose **Add to Home Screen** | Safari 26 or later and a device that exposes WebGPU; use the Small model first. This is a PWA, not an App Store app |
| Linux | Install the website from a supported browser, or use the desktop AppImage / deb | WebGPU-capable browser/device; desktop packages are x64 |

The app checks for WebGPU before loading a model. A device or browser without WebGPU cannot run inference. Even where WebGPU is available, model size and performance depend on the device. Small is the best starting point for phones; the largest model needs substantially more memory.

## Getting started

1. Open the hosted app in a supported browser. The live app is deployed automatically from the main branch.
2. While online, open the app once so the service worker can cache the app shell.
3. Choose a model and press **⬇ Model**. Wait until the status says **Model ready. Chat can now run offline on this device.** The initial model download is roughly 0.4–2 GB, depending on the model.
4. If you plan to use PDF reading or image OCR offline, use each feature once while online so its helper library can be downloaded and cached. Embeddings are optional; memory search falls back to keyword matching if they cannot load.
5. Turn off your connection and try a new chat. Keep the app's site data; clearing it removes local chats and may remove downloaded files. Export backups regularly.

## Privacy and network use

Chats, uploaded files, and prompts are processed in the app and stored in local browser storage. LocalMind does not have a server or account system and does not sync data between devices. Use **Export backup** to move data yourself.

An internet connection is used for the initial app visit, model download, and optional helper-library downloads from jsDelivr, cdnjs, and esm.run. The app's optional **Web search** sends the search terms to Wikipedia. Chat content and attached files are not sent to Wikipedia. The browser and network providers may still see ordinary connection metadata when resources are downloaded.

## Desktop builds

The Electron wrapper is in `desktop/`. To build locally, install Node.js 20 or later, then run:

```sh
cd desktop
npm install
npm run dist
```

GitHub Actions can build Windows x64, macOS x64/arm64, and Linux x64 packages. Tag a release as `v1.0.0` to attach installers to a GitHub Release. The installers are unsigned; operating systems may show warnings. Review the workflow and build output before distributing releases.

The desktop wrapper is an experimental packaging route. WebGPU behavior can differ from the browser version, so test each installer on its target platform before calling it supported.

## Development

The web app is a static site in `web/` and can be served from any HTTPS static host. GitHub Pages deployment is configured in `.github/workflows/pages.yml`. Desktop installer builds are configured in `.github/workflows/desktop.yml`.

## Limitations and licenses

- This is an early prototype and has not been verified on a representative set of Windows, macOS, iPhone, and Android devices.
- First-time setup needs internet. Offline use is available only after the app, selected model, and any optional helpers you need have been downloaded and cached.
- Small local models can make mistakes and are weaker than large hosted models, especially for difficult reasoning, coding, and grading. Treat answer checking as a first pass for a person to review.
- Photo extraction is English OCR, not visual understanding. Handwriting, diagrams, and charts can be misread. PDF scanning is slow on phones and OCR is limited to the first 40 pages.
- The context window is limited; memory retrieval selects a small number of relevant passages rather than including all prior data.
- Browser storage can be cleared by the user, browser settings, or the operating system. Keep backups.
- The app code is MIT licensed. The Qwen model weights and the libraries loaded at runtime have their own licenses and terms. Check those terms before redistribution or commercial use.

## License

The LocalMind source code is available under the MIT License. See [LICENSE](LICENSE). This license does not change the licenses for model weights, runtime libraries, or other third-party assets.
