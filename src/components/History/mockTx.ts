import { AmmOperation } from 'ergo-dex-sdk/build/module/amm/models/ammOperation';

const mock =
  '{"txId":"4c8d0755d596c41163bd80e8268767a3f0c028e03659664d2e16a3ea0bf00988","boxId":"bdb07b0c71ba1977df53c5287a5c30550e6ec9cd657ce3c4c7d6fda55d15d9d9","status":"submitted","summary":{"from":{"asset":{"id":"f45c4f0d95ce1c64defa607d94717a9a30c00fdd44827504be20db19f4dce36f","name":"TERG","decimals":0},"amount":100},"to":{"id":"f302c6c042ada3566df8e67069f8ac76d10ce15889535141593c168f3c59e776"},"poolId":"51ee3a4e30d0e763d3f1759be12239b1ff163068a5eae699d2e667f9effb348d"}}';

const mockOperation = JSON.parse(mock);

mockOperation.summary.from.amount = BigInt(mockOperation.summary.from.amount);

export default mockOperation;
