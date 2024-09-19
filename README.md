# Snowflake ID Generator

A simple and customizable Snowflake ID generator for JavaScript and TypeScript projects.

## Installation

```bash
npm install @grkndev/snowflakeid
```

## Usage

### JavaScript

```javascript
const { generateSnowflakeId, parseSnowflakeId } = require('@grkndev/snowflakeid');

// Generate a Snowflake ID with default options
const id = generateSnowflakeId();
console.log(id);
//=> '79796401721711616'


// Generate a Snowflake ID with custom options
const customId = generateSnowflakeId({ nodeId: 5, epoch: 1609459200000 });
console.log(customId);

// Parse a Snowflake ID
const parsedId = parseSnowflakeId(id);
console.log(parsedId);
```

### TypeScript

```typescript
import { generateSnowflakeId, parseSnowflakeId, SnowflakeOptions } from '@grkndev/snowflakeid';

// Generate a Snowflake ID with default options
const id = generateSnowflakeId();
console.log(id);

// Generate a Snowflake ID with custom options
const options: SnowflakeOptions = { nodeId: 5, epoch: 1609459200000 };
const customId = generateSnowflakeId(options);
console.log(customId);

// Parse a Snowflake ID
const parsedId = parseSnowflakeId(id);
console.log(parsedId);
```

## API

### generateSnowflakeId(options?: SnowflakeOptions): string

Generates a Snowflake ID.

Options:
- `epoch` (optional): Custom epoch timestamp (in milliseconds since Unix epoch). Default is 1609459200000 (2021-01-01T00:00:00Z).
- `nodeId` (optional): Node ID for distributed systems (0-1023). Default is 1.
- `sequence` (optional): Initial sequence number (0-4095).

Returns a string representation of the generated Snowflake ID.

### parseSnowflakeId(id: string, epoch?: number): { timestamp: Date, nodeId: number, sequence: number }

Parses a Snowflake ID into its component parts.

Parameters:
- `id`: The Snowflake ID to parse.
- `epoch` (optional): The epoch used in ID generation. Default is 1609459200000 (2021-01-01T00:00:00Z).

Returns an object containing the parsed components of the Snowflake ID:
- `timestamp`: Date object representing the timestamp of ID generation.
- `nodeId`: The node ID used in ID generation.
- `sequence`: The sequence number used in ID generation.

## Error Handling

The `generateSnowflakeId` function may throw errors in the following cases:
- If the provided `nodeId` is less than 0 or greater than 1023.
- If the provided `epoch` is a negative number or a future timestamp.
- If the system clock moves backwards.

## License

MIT