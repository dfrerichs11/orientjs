"use strict";

var Long = require('../../../long').Long,
    constants = require('./constants');

/**
 * Parse data to 4 bytes which represents integer value.
 *
 * @fixme this is a super misleading function name and comment!
 *
 * @param  {Mixed} data  The data.
 * @return {Buffer}      The buffer containing the data.
 */
function writeByte (data) {
  return new Buffer([data]);
}

/**
 * Parse data to 4 bytes which represents integer value.
 *
 * @param  {Mixed} data  The data to write.
 * @return {Buffer}      The buffer containing the data.
 */
function writeInt (data) {
  var buf = new Buffer(constants.BYTES_INT);
  buf.writeInt32BE(data, 0);
  return buf;
}

/**
 * Parse data to 8 bytes which represents a long value.
 *
 * @param  {Mixed} data  The data to write.
 * @return {Buffer}      The buffer containing the data.
 */
function writeLong (data) {
  var buf = new Buffer(constants.BYTES_LONG),
      value = Long.fromNumber(data);

  buf.fill(0);
  buf.writeInt32BE(value.high_, 0);
  buf.writeInt32BE(value.low_, constants.BYTES_INT);

  return buf;
}

/**
 * Parse data to 2 bytes which represents short value.
 *
 * @param  {Mixed} data  The data to write.
 * @return {Buffer}      The buffer containing the data.
 */
function writeShort (data) {
  var buf = new Buffer(constants.BYTES_SHORT);
  buf.writeInt16BE(data, 0);
  return buf;
}

/**
 * Write bytes to a buffer
 * @param  {Mixed} data  The data to write.
 * @return {Buffer}      The buffer containing the data.
 */
function writeBytes (data) {
  var length = data.length,
      buf = new Buffer(constants.BYTES_INT + length);
  buf.writeInt32BE(length, 0);
  data.copy(buf, constants.BYTES_INT);
  return buf;
}

/**
 * Parse string data to buffer with UTF-8 encoding.
 *
 * @param  {Mixed} data  The data to write.
 * @return {Buffer}      The buffer containing the data.
 */
function writeString (data) {
  if (data === null) {
      return writeInt(-1);
  }
  var stringBuf = encodeString(data),
      length = stringBuf.length,
      buf = new Buffer(constants.BYTES_INT + length);
  buf.writeInt32BE(length, 0);
  stringBuf.copy(buf, constants.BYTES_INT, 0, stringBuf.length);
  return buf;
}

function encodeString (data) {
  var length = data.length,
      output = new Buffer(length * 3), // worst case, all chars could require 3-byte encodings.
      j = 0, // index output
      i, c;

  for (i = 0; i < length; i++) {
    c = data.charCodeAt(i);
    if (c < 0x80) {
      // 7-bits done in one byte.
      output[j++] = c;
    }
    else if (c < 0x800) {
      // 8-11 bits done in 2 bytes
      output[j++] = (0xC0 | c >> 6);
      output[j++] = (0x80 | c & 0x3F);
    }
    else {
      // 12-16 bits done in 3 bytes
      output[j++] = (0xE0 | c >> 12);
      output[j++] = (0x80 | c >> 6 & 0x3F);
      output[j++] = (0x80 | c & 0x3F);
    }
  }
  return output.slice(0, j);
}

exports.writeByte = writeByte;
exports.writeBoolean = writeByte;
exports.writeBytes = writeBytes;
exports.writeShort = writeShort;
exports.writeInt = writeInt;
exports.writeLong = writeLong;
exports.writeString = writeString;