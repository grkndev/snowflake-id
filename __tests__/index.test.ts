import {
  generateSnowflakeId,
  parseSnowflakeId,
  randomId,
  uuid,
} from "../src/index";

describe("Snowflake ID Generator", () => {
  describe("generateSnowflakeId", () => {
    it("should generate a string", () => {
      const id = generateSnowflakeId();
      expect(typeof id).toBe("string");
    });

    it("should generate unique IDs", () => {
      const id1 = generateSnowflakeId();
      const id2 = generateSnowflakeId();
      expect(id1).not.toBe(id2);
    });

    it("should generate IDs in ascending order", () => {
      const id1 = generateSnowflakeId();
      const id2 = generateSnowflakeId();
      expect(BigInt(id2)).toBeGreaterThan(BigInt(id1));
    });

    it("should accept custom options", () => {
      const customEpoch = 1609459200000; // 2021-01-01T00:00:00Z
      const customNodeId = 42;
      const customSequence = 100;

      const id = generateSnowflakeId({
        epoch: customEpoch,
        nodeId: customNodeId,
        sequence: customSequence,
      });
      const parsed = parseSnowflakeId(id, customEpoch);

      expect(parsed.nodeId).toBe(customNodeId);
      expect(parsed.sequence).toBeGreaterThanOrEqual(customSequence);
      expect(parsed.sequence).toBeLessThanOrEqual(customSequence + 1);
    });

    it("should throw an error for invalid node IDs", () => {
      expect(() => generateSnowflakeId({ nodeId: -1 })).toThrow();
      expect(() => generateSnowflakeId({ nodeId: 1024 })).toThrow();
    });

    it("should throw an error for invalid epochs", () => {
      expect(() => generateSnowflakeId({ epoch: -1 })).toThrow();
      expect(() => generateSnowflakeId({ epoch: Date.now() + 1000 })).toThrow();
    });

    it("should generate IDs with correct structure", () => {
      const id = generateSnowflakeId();
      const idNumber = BigInt(id);

      // Timestamp part (first 41 bits) should be non-zero
      expect(idNumber >> 22n).not.toBe(0n);

      // Node ID part (next 10 bits) should be within range
      const nodeId = Number((idNumber & 0x3ff000n) >> 12n);
      expect(nodeId).toBeGreaterThanOrEqual(0);
      expect(nodeId).toBeLessThanOrEqual(1023);

      // Sequence part (last 12 bits) should be within range
      const sequence = Number(idNumber & 0xfffn);
      expect(sequence).toBeGreaterThanOrEqual(0);
      expect(sequence).toBeLessThanOrEqual(4095);
    });
  });

  describe("parseSnowflakeId", () => {
    it("should correctly parse a generated ID", () => {
      const customEpoch = 1609459200000; // 2021-01-01T00:00:00Z
      const customNodeId = 42;
      const id = generateSnowflakeId({
        epoch: customEpoch,
        nodeId: customNodeId,
      });
      const parsed = parseSnowflakeId(id, customEpoch);

      expect(parsed.nodeId).toBe(customNodeId);
      expect(parsed.timestamp).toBeInstanceOf(Date);
      expect(parsed.timestamp.getTime()).toBeGreaterThanOrEqual(customEpoch);
      expect(parsed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(parsed.sequence).toBeGreaterThanOrEqual(0);
      expect(parsed.sequence).toBeLessThanOrEqual(4095);
    });

    it("should use the default epoch if not provided", () => {
      const id = generateSnowflakeId();
      const parsed = parseSnowflakeId(id);

      expect(parsed.timestamp.getTime()).toBeGreaterThanOrEqual(1609459200000);
      expect(parsed.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe("Snowflake ID Generator Performance", () => {
    it("should generate 10000 IDs quickly", () => {
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

  describe("randomId", () => {
    it("should generate a string", () => {
      const id = randomId(6);
      expect(typeof id).toBe("string");
    });
    it("should generate unique IDs", () => {
      const id1 = randomId(6);
      const id2 = randomId(6);
      expect(id1).not.toBe(id2);
    });
    it("should generate IDs with the correct length", () => {
      const id = randomId(10);
      expect(id.length).toBe(10);
    });
    it("should generate IDs with only characters", () => {
      const id = randomId(10, { useChars: true, useNumbers: false });
      expect(id).toMatch(/^[a-zA-Z]+$/);
    });
    it("should generate IDs with only numbers", () => {
      const id = randomId(10, { useChars: false, useNumbers: true });
      expect(id).toMatch(/^[0-9]+$/);
    });
    it("should generate IDs with characters and numbers", () => {
      const id = randomId(10, { useChars: true, useNumbers: true });
      expect(id).toMatch(/^[a-zA-Z0-9]+$/);
    });
    it("should throw an error for invalid options", () => {
      expect(() =>
        randomId(10, { useChars: false, useNumbers: false })
      ).toThrow();
    });
  });

  describe("randomId Performance", () => {
    it("should generate 10000 IDs quickly", () => {
      const start = Date.now();
      for (let i = 0; i < 10000; i++) {
        randomId(6);
      }
      const end = Date.now();
      const duration = end - start;

      console.log(`Generated 10000 IDs in ${duration}ms`);
      expect(duration).toBeLessThan(1000); // Should take less than 1 second
    });
  });

  describe("UUID", () => {
    it("should generate a string", () => {
      const id = uuid(4);
      expect(typeof id).toBe("string");
    });
    it("should generate unique IDs", () => {
      const id1 = uuid(4);
      const id2 = uuid(4);
      expect(id1).not.toBe(id2);
    });
    it("should generate IDs with the correct length", () => {
      const split = 4;
      const id = uuid(split);
      expect(id.length).toBe(split * 8 + split - 1);
    });
  });

  describe("UUID Performance", () => {
    it("should generate 10000 IDs quickly", () => {
      const start = Date.now();
      for (let i = 0; i < 10000; i++) {
        uuid(4);
      }
      const end = Date.now();
      const duration = end - start;

      console.log(`Generated 10000 UUIDs in ${duration}ms`);
      expect(duration).toBeLessThan(1000); // Should take less than 1 second
    });
  });
});
