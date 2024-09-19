import { generateSnowflakeId, parseSnowflakeId } from '../src/index';

describe('Snowflake ID Generator', () => {
  describe('generateSnowflakeId', () => {
    it('should generate a string', () => {
      const id = generateSnowflakeId();
      expect(typeof id).toBe('string');
    });

    it('should generate unique IDs', () => {
      const id1 = generateSnowflakeId();
      const id2 = generateSnowflakeId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs in ascending order', () => {
      const id1 = generateSnowflakeId();
      const id2 = generateSnowflakeId();
      expect(BigInt(id2)).toBeGreaterThan(BigInt(id1));
    });

    it('should accept custom options', () => {
      const customEpoch = 1609459200000; // 2021-01-01T00:00:00Z
      const customNodeId = 42;
      const customSequence = 100;

      const id = generateSnowflakeId({ epoch: customEpoch, nodeId: customNodeId, sequence: customSequence });
      const parsed = parseSnowflakeId(id, customEpoch);

      expect(parsed.nodeId).toBe(customNodeId);
      expect(parsed.sequence).toBe(customSequence);
    });

    it('should throw an error for invalid node IDs', () => {
      expect(() => generateSnowflakeId({ nodeId: -1 })).toThrow();
      expect(() => generateSnowflakeId({ nodeId: 1024 })).toThrow();
    });

    it('should throw an error for invalid epochs', () => {
      expect(() => generateSnowflakeId({ epoch: -1 })).toThrow();
      expect(() => generateSnowflakeId({ epoch: Date.now() + 1000 })).toThrow();
    });

    it('should generate IDs with correct structure', () => {
      const id = generateSnowflakeId();
      const idNumber = BigInt(id);
      
      // Timestamp part (first 41 bits) should be non-zero
      expect(idNumber >> 22n).not.toBe(0n);
      
      // Node ID part (next 10 bits) should be within range
      const nodeId = Number((idNumber & 0x3FF000n) >> 12n);
      expect(nodeId).toBeGreaterThanOrEqual(0);
      expect(nodeId).toBeLessThanOrEqual(1023);
      
      // Sequence part (last 12 bits) should be within range
      const sequence = Number(idNumber & 0xFFFn);
      expect(sequence).toBeGreaterThanOrEqual(0);
      expect(sequence).toBeLessThanOrEqual(4095);
    });
  });

  describe('parseSnowflakeId', () => {
    it('should correctly parse a generated ID', () => {
      const customEpoch = 1609459200000; // 2021-01-01T00:00:00Z
      const customNodeId = 42;
      const id = generateSnowflakeId({ epoch: customEpoch, nodeId: customNodeId });
      const parsed = parseSnowflakeId(id, customEpoch);

      expect(parsed.nodeId).toBe(customNodeId);
      expect(parsed.timestamp).toBeInstanceOf(Date);
      expect(parsed.timestamp.getTime()).toBeGreaterThanOrEqual(customEpoch);
      expect(parsed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(parsed.sequence).toBeGreaterThanOrEqual(0);
      expect(parsed.sequence).toBeLessThanOrEqual(4095);
    });

    it('should use the default epoch if not provided', () => {
      const id = generateSnowflakeId();
      const parsed = parseSnowflakeId(id);

      expect(parsed.timestamp.getTime()).toBeGreaterThanOrEqual(1609459200000);
      expect(parsed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Snowflake ID Generator Performance', () => {
    it('should generate 10000 IDs quickly', () => {
      const start = Date.now();
      for (let i = 0; i < 10000; i++) {
        generateSnowflakeId();
      }
      const end = Date.now();
      const duration = end - start;
      
      console.log(`Generated 10000 IDs in ${duration}ms`);
      expect(duration).toBeLessThan(1000); // Should take less than 1 second
    });
  });
});