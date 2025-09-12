import { PoolCreated as PoolCreatedEvent } from "../generated/PoolManager/PoolManager"
import { PoolCreated } from "../generated/schema"

export function handlePoolCreated(event: PoolCreatedEvent): void {
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
}
