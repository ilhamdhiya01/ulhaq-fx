# ulhaq-fx

A lightweight TypeScript utility library providing a collection of powerful, type-safe functions for common programming tasks.

## Installation

```bash
# Using npm
npm install ulhaq-fx

# Using yarn
yarn add ulhaq-fx
```

## Available Functions

### slugify

Converts a string to a URL-friendly slug.

```typescript
const slug = slugify("Hello World");
console.log(slug); // Output: hello-world
```

### resolveObjectPath

Retrieves a nested value from an object using a dot-notation path.

```typescript
const data = {
  user: { name: "John", addresses: [{ city: "NY" }, { city: "LA" }] },
};
const name = resolveObjectPath(data, "user.name");
console.log(name); // Output: John

const cities = resolveObjectPath(data, "user.addresses.city");
console.log(cities); // Output: ["NY", "LA"]

const data2 = [
  { name: "John", addresses: [{ city: "NY" }, { city: "LA" }] },
  { name: "Doe", addresses: [{ city: "NY" }, { city: "LA" }] },
];

console.log(resolveObjectPath(data2, "addresses.city"));
// Output: ["NY", "LA"]

console.log(resolveObjectPath(data2, "name"));
// Output: ["John", "Doe"]
```

### extractNumber

Extracts numbers from a string with configurable options.

```typescript
const number = extractNumber("Price is $123.45");
console.log(number); // Output: 12345

const numberWithDecimals = extractNumber("Price is $123.45", {
  allowDecimals: true,
});
console.log(numberWithDecimals); // Output: 123.45

const negativeNumber = extractNumber("Temperature is -5°C", {
  allowNegative: true,
});
console.log(negativeNumber); // Output: -5

const defaultValue = extractNumber("No numbers here", { defaultValue: -1 });
console.log(defaultValue); // Output: -1
```

### transformEmptyValues

Recursively converts empty string values to null (or specified value) in an object or array
while maintaining the original structure.

```typescript
const data = {
  name: "",
  age: 25,
  address: {
    street: "  ",
    city: "New York",
  },
  tags: [],
  scores: [100, "", { value: "" }],
};

console.log(
  convertEmptyToNull(data, {
    processEmptyArrays: true,
    replaceWith: undefined,
  })
);
// Output: { name: null, age: 25, address: { street: null, city: "New York" }, tags: null, scores: [100, null, { value: null }] }

const data2 = [
  {
    name: "",
    age: 25,
    money: [100, "", { value: "" }],
  },
];

console.log(
  convertEmptyToNull(data2, {
    isEmptyFn: (val) => typeof val === "number",
  })
);
// Output: [{ name: "", age: null, money: [null, "", { value: "" }] }]
```

### replaceString

Replaces multiple strings based on a mapping object.

```typescript
console.log(
  replaceString("Hello :first! aku <last> dan dia :other", {
    ":first": "John",
    "<last>": "Doe",
    ":other": false,
  })
);
// Output: "Hello John! aku Doe dan dia false"

console.log(
  replaceString("Total: $price (tax: $tax)", {
    $price: 99.99,
    $tax: "10%",
  })
);
// Output: "Total: 99.99 (tax: 10%)"

console.log(
  replaceString(
    "TEST test",
    { test: "done" },
    {
      ignoreCase: false,
    }
  )
);
// Output: "TEST done"

console.log(
  replaceString("1 + 1 = 2", { "+": "plus" }, { escapeRegex: false })
);
// Output: "Error: Invalid replacement value"
```

## License

MIT

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Authors

- [Ilham Dhiya Ulhaq](https://github.com/ilham-dhiya-ulhaq)

## Disclaimer

This project is not affiliated with any company or organization.

## License

MIT
