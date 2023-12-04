class Block {
  constructor({ data, timestamp, lastHash, hash }) {
    this.data = data;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
  }
}

export default Block;