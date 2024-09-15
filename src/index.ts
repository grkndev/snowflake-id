const EPOCH = 1609459200000; // 2021-01-01T00:00:00Z
let sequence = 0;
let lastTimestamp = -1;

export function generateSnowflakeId(nodeId: number = 1): string {
  if (nodeId < 0 || nodeId > 1023) {
    throw new Error('Node ID must be between 0 and 1023');
  }

  let timestamp = Date.now();

  if (timestamp < lastTimestamp) {
    throw new Error('Clock moved backwards. Refusing to generate id');
  }

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) & 4095;
    if (sequence === 0) {
      timestamp = waitNextMillis(lastTimestamp);
    }
  } else {
    sequence = 0;
  }

  lastTimestamp = timestamp;

  const id = ((timestamp - EPOCH) << 22) |
             (nodeId << 12) |
             sequence;

  return id.toString();
}

function waitNextMillis(lastTimestamp: number): number {
  let timestamp = Date.now();
  while (timestamp <= lastTimestamp) {
    timestamp = Date.now();
  }
  return timestamp;
}

export default generateSnowflakeId;