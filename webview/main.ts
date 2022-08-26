import { Webview } from "https://deno.land/x/webview@0.7.3/mod.ts";

const html = /*html*/ `
<html>
  <body>
  <h1>Hello from deno v${Deno.version.deno}</h1>
  <button onclick="press('I was pressed!', 123, new Date()).then(log);">
  Press me!
  </button>
  </body>
</html>
`;

const webview = new Webview();

webview.navigate(`data:text/html,${encodeURIComponent(html)}`);

let counter = 0;
// Create and bind `press` to the webview javascript instance.
// This functions in addition to logging its parameters also returns
// a value from deno land to webview land.
webview.bind("press", (a, b, c) => {
  console.log(a, b, c);

  return { times: counter++ };
});

// Bind the `log` function in the webview to the parent instances `console.log`
webview.bind("log", (...args) => console.log(...args));

webview.run();
