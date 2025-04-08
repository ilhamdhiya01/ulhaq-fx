/**
 * Convert string to URL-friendly slug
 * @param text - Text to convert
 * @returns Slugified string
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

/**
 * Gets a nested value from an object using a dot-notation path
 * @template T - The expected type of the nested value
 * @template D - The type of the data object
 * @param {D} data - The object to traverse
 * @param {string} path - Dot-notation path (e.g., "user.address.street")
 * @returns {T | T[] | undefined} - The nested value, array of values (for array traversal), or undefined if not found
 * @example
 * const data = { user: { name: "John", addresses: [{ city: "NY" }, { city: "LA" }] } };
 * resolveObjectPath(data, "user.name") // "John"
 * resolveObjectPath(data, "user.addresses.city") // ["NY", "LA"]
 */
export const resolveObjectPath = <
  T = unknown,
  D extends Record<string, any> = Record<string, any>
>(
  data: D,
  path: string
): T | T[] | undefined => {
  if (!data) return undefined;
  if (!path) return data as unknown as T;

  const keys = path.split(".");
  if (keys.some((key) => !key)) return undefined; // Invalid path format check

  const traverse = (current: any, keyLeft: string[]): any => {
    if (current === null || current === undefined) return undefined;

    // Handle array of objects
    if (Array.isArray(current)) {
      const results = current
        .map((item) => traverse(item, [...keyLeft]))
        .filter(Boolean);
      return results.length ? results.flat() : undefined;
    }

    const [firstKey, ...restKeys] = keyLeft;
    const next = current[firstKey];

    if (next === undefined) return undefined;
    if (restKeys.length === 0) return next;

    return traverse(next, restKeys);
  };

  return traverse(data, keys);
};

/**
 * Extracts numbers from a string with configurable options.
 *
 * @param {string} str - The string to extract numbers from
 * @param {ExtractNumberOptions} options - Configuration options
 * @returns {number} The extracted number
 *
 * @example
 * extractNumber("Price is $123.45")  // Returns: 12345
 * extractNumber("Price is $123.45", { allowDecimals: true })  // Returns: 123.45
 * extractNumber("Temperature is -5°C", { allowNegative: true })  // Returns: -5
 * extractNumber("No numbers here", { defaultValue: -1 })  // Returns: -1
 *
 * @throws {TypeError} If input is not a string
 */
export const extractNumber = (
  str: string,
  options: ExtractNumberOptions = {}
): number => {
  // Input validation
  if (typeof str !== "string") {
    throw new TypeError("Input must be a string");
  }

  // Default options
  const {
    allowDecimals = false,
    allowNegative = false,
    defaultValue = 0,
  } = options;

  // Early return for empty string
  if (!str.trim()) return defaultValue;

  // Build regex pattern based on options
  const pattern = [
    allowNegative ? "-?" : "", // Optional negative sign
    "\\d+", // Digits
    allowDecimals ? "(?:\\.\\d+)?" : "", // Optional decimal part
  ].join("");

  const regex = new RegExp(pattern, "g");
  const matches = str.match(regex);

  if (!matches) return defaultValue;

  // Join all matches and convert to number
  const number = matches.join("");
  const result = allowDecimals ? parseFloat(number) : parseInt(number, 10);

  return isNaN(result) ? defaultValue : result;
};

/**
 * Recursively converts empty string values to null (or specified value) in an object or array
 * while maintaining the original structure.
 *
 * @template T - Type of input object
 * @param {T} input - Object or array to process
 * @param {ConversionOptions} options - Configuration options
 * @returns {T} New object with empty strings converted to null (or specified value)
 *
 * @example
 * // Basic usage
 * transformEmptyValues({ name: "", age: 25 }) // { name: null, age: 25 }
 *
 * // With custom replacement
 * transformEmptyValues({ name: "" }, { replaceWith: undefined }) // { name: undefined }
 *
 * // With empty array processing
 * transformEmptyValues({ tags: [] }, { processEmptyArrays: true }) // { tags: null }
 *
 * // With custom empty check
 * transformEmptyValues(
 *   { count: 0 },
 *   { isEmptyFn: (value) => value === 0 }
 * ) // { count: null }
 *
 * @throws {TypeError} If input is not an object or array
 */
export const transformEmptyValues = <T extends Record<string, any> | any[]>(
  input: T,
  options: ConversionOptions = {}
): T => {
  // Validate input
  if (input === null || typeof input !== "object") {
    throw new TypeError("Input must be an object or array");
  }

  // Default options
  const {
    replaceWith = null,
    trimStrings = true,
    processEmptyArrays = false,
    isEmptyFn,
  } = options;

  // Custom empty check function
  const isEmpty = (value: any): boolean => {
    if (isEmptyFn) return isEmptyFn(value);

    if (typeof value === "string") {
      return trimStrings ? value.trim() === "" : value === "";
    }

    if (processEmptyArrays && Array.isArray(value)) {
      return value.length === 0;
    }

    return false;
  };

  // Check if input is empty first
  if (isEmpty(input)) {
    return replaceWith as T;
  }

  // Handle arrays
  if (Array.isArray(input)) {
    return input.map((item) =>
      typeof item === "object" && item !== null
        ? transformEmptyValues(item, options)
        : isEmpty(item)
        ? replaceWith
        : item
    ) as T;
  }

  // Handle objects
  const result = {} as T;

  for (const [key, value] of Object.entries(input)) {
    result[key as keyof T] =
      typeof value === "object" && value !== null
        ? transformEmptyValues(value, options)
        : isEmpty(value)
        ? replaceWith
        : value;
  }

  return result;
};

/**
 * Replaces multiple strings based on a mapping object.
 *
 * @param {string} text - The text to perform replacements on
 * @param {ReplacementValues} replacements - Object mapping strings to their replacements
 * @param {ReplaceOptions} options - Configuration options
 * @returns {string} Text with all replacements applied
 *
 * @example
 * // Basic usage
 * replaceString("Hello :name!", { ":name": "John" }) // "Hello John!"
 *
 * // Multiple replacements
 * replaceString("price: $price tax: $tax", {
 *   "$price": 100,
 *   "$tax": 10
 * }) // "price: 100 tax: 10"
 *
 * // Case sensitive
 * replaceString("TEST test", { "test": "done" }, {
 *   ignoreCase: false
 * }) // "TEST done"
 *
 * // With regex characters
 * replaceString("1 + 1 = 2", { "+": "plus" }) // "1 plus 1 = 2"
 *
 * @throws {TypeError} If input text is not a string
 * @throws {TypeError} If replacements is not an object
 */
export const replaceString = (
  text: string,
  replacements: Record<string, string | number | boolean>,
  options: ReplaceOptions = {}
): string => {
  // Input validation
  if (typeof text !== "string") {
    throw new TypeError("Input text must be a string");
  }

  if (!replacements || typeof replacements !== "object") {
    throw new TypeError("Replacements must be an object");
  }

  // Early return for empty cases
  if (!text || Object.keys(replacements).length === 0) {
    return text;
  }

  // Default options
  const { ignoreCase = true, replaceAll = true, escapeRegex = true } = options;

  // Convert all values to strings
  const stringReplacements = Object.entries(replacements).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: String(value),
    }),
    {} as Record<string, string>
  );

  // Escape special regex characters if needed
  const escapeRegexStr = (str: string): string => {
    return escapeRegex ? str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : str;
  };

  // Build the regex pattern
  const pattern = Object.keys(stringReplacements).map(escapeRegexStr).join("|");

  // Create regex with appropriate flags
  const flags = `${replaceAll ? "g" : ""}${ignoreCase ? "i" : ""}`;
  const regex = new RegExp(pattern, flags);

  // Perform replacement
  return text.replace(regex, (matched) => {
    // Handle case sensitivity
    const key = ignoreCase
      ? Object.keys(stringReplacements).find(
          (k) => k.toLowerCase() === matched.toLowerCase()
        )
      : matched;

    return key ? stringReplacements[key] : matched;
  });
};
