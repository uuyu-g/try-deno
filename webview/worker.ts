import { serve } from "https://deno.land/std@0.152.0/http/server.ts";

(self as any).onmessage = async (e: any) => {
  switch (e.data.command) {
    case "serve": {
      const { port } = e.data;
      serve((_req) => new Response("Hello, world"), { port: port });
      break;
    }
    case "quit": {
      self.close();
      break;
    }
  }
};
