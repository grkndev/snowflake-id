import generateSnowflakeId from '../src/index';

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

  it('should accept a custom node ID', () => {
    const id1 = generateSnowflakeId(1);
    const id2 = generateSnowflakeId(2);
    expect(id1).not.toBe(id2);
  });

  it('should throw an error for invalid node IDs', () => {
    expect(() => generateSnowflakeId(-1)).toThrow();
    expect(() => generateSnowflakeId(1024)).toThrow();
  });

  it('should generate IDs with correct structure', () => {
    const id = generateSnowflakeId();
    const idNumber = parseInt(id, 10);
    
    // Timestamp part (first 41 bits) should be non-zero
    expect(idNumber >> 22).not.toBe(0);
    
    // Node ID part (next 10 bits) should be within range
    const nodeId = (idNumber & 0x3FF000) >> 12;
    expect(nodeId).toBeGreaterThanOrEqual(0);
    expect(nodeId).toBeLessThanOrEqual(1023);
    
    // Sequence part (last 12 bits) should be within range
    const sequence = idNumber & 0xFFF;
    expect(sequence).toBeGreaterThanOrEqual(0);
    expect(sequence).toBeLessThanOrEqual(4095);
  });
});