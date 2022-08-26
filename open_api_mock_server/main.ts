import { assertEquals } from "https://deno.land/std@0.151.0/testing/asserts.ts";
import * as YAML from "https://deno.land/std@0.152.0/encoding/yaml.ts";
import { schemaToExample } from "./schemaToExample.ts";

const specYaml = await Deno.readTextFile("./openapi.yml");
const spec: any = YAML.parse(specYaml);

const convertToURLpattern = (path: string) => {
  return path.replaceAll("{", ":").replaceAll("}", "");
};

Deno.test("convert to URLpattern", () => {
  const path = "/users/{id}";
  const urlPattern = convertToURLpattern(path);
  assertEquals(urlPattern, "/users/:id");
});

const matchPath = (path: string) => {
  return Object.keys(spec.paths).find((p) => {
    const pattern = new URLPattern({ pathname: convertToURLpattern(p) });
    return pattern.test({ pathname: path });
  });
};

Deno.test("matchPath", () => {
  const path = "/users/hoge";
  const matched = matchPath(path);
  assertEquals(matched, "/users/{id}");
});

const controller = (path: string, method: "get" | "post") => {
  const content = spec.paths[path][method].responses["200"].content["application/json"];
  return content["example"] ?? content["schema"];
};

const schema = controller("/users/{id}", "get");

console.log(schemaToExample(schema, spec));
