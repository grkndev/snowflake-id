/**
 * The default epoch timestamp used for Snowflake ID generation.
 * Set to 2021-01-01T00:00:00Z (1609459200000 in milliseconds since Unix epoch).
 */
const DEFAULT_EPOCH = 1609459200000;

/**
 * Options for customizing Snowflake ID generation.
 */
interface SnowflakeOptions {
  /** Custom epoch timestamp (in milliseconds since Unix epoch) */
  epoch?: number;
  /** Node ID (0-1023) for distributed systems */
  nodeId?: number;
  /** Initial sequence number (0-4095) */
  sequence?: number;
}
interface RandomIdOptions {
  useChars: boolean;
  useNumbers: boolean;
}

let globalSequence = 0;
let lastTimestamp = -1;

/**
 * Generates a Snowflake ID.
 *
 * @param {SnowflakeOptions} options - Custom options for ID generation
 * @param {number} [options.epoch=DEFAULT_EPOCH] - Custom epoch timestamp
 * @param {number} [options.nodeId=1] - Node ID for distributed systems
 * @param {number} [options.sequence] - Initial sequence number
 * @returns {string} The generated Snowflake ID as a string
 * @throws {Error} If nodeId is invalid or if the clock moves backwards
 */
export function generateSnowflakeId(options: SnowflakeOptions = {}): string {
  const {
    epoch = DEFAULT_EPOCH,
    nodeId = 1,
    sequence: initialSequence,
  } = options;

  if (nodeId < 0 || nodeId > 1023) {
    throw new Error("Node ID must be between 0 and 1023");
  }

  if (epoch < 0 || epoch > Date.now()) {
    throw new Error("Epoch must be a valid timestamp not in the future");
  }

  let timestamp = Date.now();
  let sequence =
    typeof initialSequence === "number" ? initialSequence : globalSequence;

  if (timestamp < lastTimestamp) {
    throw new Error("Clock moved backwards. Refusing to generate id");
  }

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) & 4095;
    if (sequence === 0) {
      timestamp = waitNextMillis(lastTimestamp);
    }
  } else {
    sequence = typeof initialSequence === "number" ? initialSequence : 0;
  }

  lastTimestamp = timestamp;
  globalSequence = sequence;

  const id =
    (BigInt(timestamp - epoch) << 22n) |
    (BigInt(nodeId) << 12n) |
    BigInt(sequence);

  return id.toString();
}

/**
 * Waits until the next millisecond.
 *
 * @param {number} lastTimestamp - The last timestamp generated
 * @returns {number} The next available timestamp
 */
function waitNextMillis(lastTimestamp: number): number {
  let timestamp = Date.now();
  while (timestamp <= lastTimestamp) {
    timestamp = Date.now();
  }
  return timestamp;
}

/**
 * Parses a Snowflake ID into its component parts.
 *
 * @param {string} id - The Snowflake ID to parse
 * @param {number} [epoch=DEFAULT_EPOCH] - The epoch used in ID generation
 * @returns {{timestamp: Date, nodeId: number, sequence: number}} Parsed components of the Snowflake ID
 */
export function parseSnowflakeId(
  id: string,
  epoch: number = DEFAULT_EPOCH
): {
  timestamp: Date;
  nodeId: number;
  sequence: number;
} {
  const snowflake = BigInt(id);

  const timestamp = Number(snowflake >> 22n) + epoch;
  const nodeId = Number((snowflake >> 12n) & 1023n);
  const sequence = Number(snowflake & 4095n);

  return {
    timestamp: new Date(timestamp),
    nodeId,
    sequence,
  };
}

/**
 * Generates a random ID with a specified length.
 * @param {RandomIdOptions} options - Custom options for ID generation
 * @param {number} [lenght=6] - The length of the random ID
 * @param {boolean} [options.useChars=false] - Use characters in the ID
 * @param {boolean} [options.useNumbers=true] - Use numbers in the ID
 * @returns {string} The generated random ID (example: "aBc123")
 */
export function randomId(
  length: number = 6,
  options: RandomIdOptions = { useChars: false, useNumbers: true }
): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  let result = "";
  let characters = "";

  if (options.useChars) characters += chars;
  if (options.useNumbers) characters += numbers;

  if (characters.length === 0) {
    throw new Error("At least one of useChars or useNumbers must be true");
  }

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
export default generateSnowflakeId;
