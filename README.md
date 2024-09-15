# Snowflake ID Generator

A simple Snowflake ID generator for JavaScript and TypeScript projects.

## Installation

```bash
npm install @grkndev/snowflakeid
```

## Usage

### JavaScript

```javascript
const generateSnowflakeId = require('@grkndev/snowflakeid').default;

const id = generateSnowflakeId();
console.log(id);

// With custom node ID
const customId = generateSnowflakeId(5);
console.log(customId);
```

### TypeScript

```typescript
import generateSnowflakeId from '@grkndev/snowflakeid';

const id = generateSnowflakeId();
console.log(id);

// With custom node ID
const customId = generateSnowflakeId(5);
console.log(customId);
```

## API

### generateSnowflakeId(nodeId?: number): string

Generates a Snowflake ID.

- `nodeId` (optional): A number between 0 and 1023 representing the node ID. Default is 1.

Returns a string representation of the generated Snowflake ID.

## License

MIT