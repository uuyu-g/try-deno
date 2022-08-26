import { assertEquals } from "https://deno.land/std@0.151.0/testing/asserts.ts";
import { get } from "./util.ts";

const refToPath = (path: string): string => {
  return path.replace("#/", "").replaceAll("/", ".");
};

Deno.test("refToPath", () => {
  const ref = "#/components/schemas/res_get_users";
  const path = refToPath(ref);
  assertEquals(path, "components.schemas.res_get_users");
});

export const schemaToExample = (schema: any, data?: any): any => {
  if (schema["$ref"]) {
    return schemaToExample(get(data, refToPath(schema["$ref"])));
  }
  if (schema["example"]) {
    return schema["example"];
  }
  if (schema["type"] === "array") {
    return [schemaToExample(schema["items"])];
  }
  if (schema["type"] === "object") {
    return Object.keys(schema["properties"]).reduce((res, key) => {
      res[key] = schemaToExample(schema["properties"][key]);
      return res;
    }, {} as any);
  }
  if (schema["type"] === "integer") {
    return 0;
  }
  if (schema["type"] === "boolean") {
    return true;
  }
  return schema["type"];
};

Deno.test("schemaToExample()", () => {
  const schema = {
    type: "object",
    properties: { name: { type: "string" } },
  };
  const example = schemaToExample(schema);
  assertEquals(example, { name: "string" });
});

Deno.test("schemaToExample() with example", () => {
  const schema = {
    type: "object",
    properties: { name: { type: "string", example: "taro" } },
  };
  const example = schemaToExample(schema);
  assertEquals(example, { name: "taro" });
});

Deno.test("schemaToExample() real world", () => {
  const schema = {
    title: "res_get_users",
    description: "GET /usersのレスポンスモデル",
    "x-tags": ["users"],
    "x-examples": {},
    type: "object",
    properties: {
      list: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            nickname: { type: "string" },
            likeFood: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
              },
            },
            year: { type: "integer" },
          },
          required: ["name", "nickname", "year"],
        },
      },
    },
    required: ["list"],
  };
  const example = schemaToExample(schema);
  assertEquals(example, {
    list: [
      {
        likeFood: [{ name: "string" }],
        name: "string",
        nickname: "string",
        year: 0,
      },
    ],
  });
});
