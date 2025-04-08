import { describe, it, expect } from "vitest";
import {
  slugify,
  resolveObjectPath,
  extractNumber,
  transformEmptyValues,
  replaceString,
} from "../src";
import { error } from "console";

describe("slugify", () => {
  it("should convert string to slug format", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
});

describe("resolveObjectPath", () => {
  it("should get nested value from object", () => {
    const data1 = {
      user: { name: "John", addresses: [{ city: "NY" }, { city: "LA" }] },
    };
    const data2 = [
      { name: "John", addresses: [{ city: "NY" }, { city: "LA" }] },
    ];
    expect(resolveObjectPath(data1, "user.name")).toBe("John");
    expect(resolveObjectPath(data1, "user.addresses.city")).toEqual([
      "NY",
      "LA",
    ]);
    expect(resolveObjectPath(data2, "name")).toEqual(["John"]);
    expect(resolveObjectPath(data2, "addresses.city")).toEqual(["NY", "LA"]);
  });
});

describe("extractNumber", () => {
  it("should extract number from string", () => {
    expect(extractNumber("Price is $123.45")).toBe(12345);
    expect(extractNumber("Price is $123.45", { allowDecimals: true })).toBe(
      123.45
    );
    expect(extractNumber("Temperature is -5°C", { allowNegative: true })).toBe(
      -5
    );
    expect(extractNumber("No numbers here", { defaultValue: -1 })).toBe(-1);
  });
});

describe("transformEmptyValues", () => {
  it("should convert empty strings to null", () => {
    expect(transformEmptyValues({ name: "", age: 25 })).toEqual({
      name: null,
      age: 25,
    });
    expect(
      transformEmptyValues({ name: "", age: 25 }, { replaceWith: undefined })
    ).toEqual({ name: null, age: 25 });
    expect(
      transformEmptyValues({ tags: [] }, { processEmptyArrays: true })
    ).toEqual({ tags: null });
    expect(
      transformEmptyValues({ count: 0 }, { isEmptyFn: (value) => value === 0 })
    ).toEqual({ count: null });
  });
});

describe("replaceString", () => {
  it("should replace multiple strings", () => {
    expect(replaceString("Hello :name!", { ":name": "John" })).toBe(
      "Hello John!"
    );
    expect(
      replaceString("price: $price tax: $tax", {
        $price: 100,
        $tax: 10,
      })
    ).toBe("price: 100 tax: 10");
    expect(
      replaceString("TEST test", { test: "done" }, { ignoreCase: false })
    ).toBe("TEST done");
    expect(
      replaceString("TEST test", { test: "done" }, { replaceAll: false })
    ).toBe("done test");
    expect(() =>
      replaceString("1 + 1 = 2", { "+": "plus" }, { escapeRegex: false })
    ).toThrow();
  });
});
