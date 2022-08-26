import { getAvailablePortSync } from "https://deno.land/x/port@1.0.0/mod.ts";
import { Webview } from "https://deno.land/x/webview@0.7.3/mod.ts";

const port = getAvailablePortSync();

const worker = new Worker(new URL("./worker.ts", import.meta.url).href, { type: "module" });
worker.postMessage({ command: "serve", port: port });

const webview = new Webview();
webview.navigate(`http://localhost:${port}`);
webview.run();
worker.postMessage({ command: "quit" });
