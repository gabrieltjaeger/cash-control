export function applyBigIntSerializer() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    return Number(this);
  };
}
