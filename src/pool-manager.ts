import { PoolCreated as PoolCreatedEvent } from "../generated/PoolManager/PoolManager"
import { PoolCreated } from "../generated/schema"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { createOrLoadToken } from "./utils/token-utils"

export function handlePoolCreated(event: PoolCreatedEvent): void {
  // 保存PoolCreated事件
  let entity = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token0 = event.params.token0
  entity.token1 = event.params.token1
  entity.index = event.params.index
  entity.tickLower = event.params.tickLower
  entity.tickUpper = event.params.tickUpper
  entity.fee = event.params.fee
  entity.pool = event.params.pool

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // 创建或更新token0信息
  let token0 = createOrLoadToken(event.params.token0, event.block.timestamp)
  token0.save()

  // 创建或更新token1信息
  let token1 = createOrLoadToken(event.params.token1, event.block.timestamp)
  token1.save()
}
