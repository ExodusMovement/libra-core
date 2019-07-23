import bigInt from 'big-integer'

function checkBounds(buf: Buffer, offset: number, byteLength: number) {
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined)
    boundsError(offset, buf.length - (byteLength + 1));
}

function checkInt(value: bigint, min: bigint, max: bigint, buf: Buffer, offset: number, byteLength: number) {
  if (value > max || value < min) {
    throw new Error('ERR_OUT_OF_RANGE');
  }
  checkBounds(buf, offset, byteLength);
}

function boundsError(value: number, length: number) {
  if (Math.floor(value) !== value) {
    throw new Error('ERR_OUT_OF_RANGE');
  }

  if (length < 0)
    throw new Error('ERR_BUFFER_OUT_OF_BOUNDS');

  throw new Error('ERR_OUT_OF_RANGE');
}

// Write integers.
function writeBigU_Int64LE(buf: Buffer, value: bigint, offset: number, min: bigint, max: bigint) {
  checkInt(value, min, max, buf, offset, 7);

  let lo = Number(bigInt(value.toString()).and('0xffffffff').toString())
  // let lo = Number(value & 0xffffffffn);
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  lo = lo >> 8;
  buf[offset++] = lo;
  let hi = Number(bigInt(value.toString()).shiftRight(32))
  // let hi = Number(value >> 32n & 0xffffffffn);
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  hi = hi >> 8;
  buf[offset++] = hi;
  return offset;
}

export function writeBigUInt64LE(buf: Buffer, value: bigint, offset: number = 0) {
  return writeBigU_Int64LE(buf, value, offset, BigInt(0), BigInt(0xffffffffffffffff));
}