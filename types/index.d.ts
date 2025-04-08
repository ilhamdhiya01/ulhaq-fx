/**
 * Configuration options for number extraction
 */
interface ExtractNumberOptions {
  /**
   * Allow decimal numbers in extraction
   * @default false
   */
  allowDecimals?: boolean;

  /**
   * Allow negative numbers in extraction
   * @default false
   */
  allowNegative?: boolean;

  /**
   * Default value to return if no numbers found
   * @default 0
   */
  defaultValue?: number;
}

/**
 * Configuration options for empty value conversion
 */
interface ConversionOptions {
  /**
   * Custom value to replace empty strings with
   * @default null
   */
  replaceWith?: any;

  /**
   * Whether to trim strings before checking if they're empty
   * @default true
   */
  trimStrings?: boolean;

  /**
   * Whether to process empty arrays as well
   * @default false
   */
  processEmptyArrays?: boolean;

  /**
   * Custom function to determine if a value should be considered empty
   * @param value - The value to check
   * @returns boolean indicating if the value is considered empty
   */
  isEmptyFn?: (value: any) => boolean;
}

/**
 * Configuration options for string replacement
 */
interface ReplaceOptions {
  /**
   * Whether to ignore case when matching
   * @default true
   */
  ignoreCase?: boolean;

  /**
   * Whether to replace all occurrences
   * @default true
   */
  replaceAll?: boolean;

  /**
   * Whether to escape special regex characters in search strings
   * @default true
   */
  escapeRegex?: boolean;
}
