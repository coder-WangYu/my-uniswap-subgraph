import { Swap as SwapEvent } from "../generated/SwapRouter/SwapRouter"
import { Swap } from "../generated/schema"

export function handleSwap(event: SwapEvent): void {
  let entity = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.zeroForOne = event.params.zeroForOne
  entity.amountIn = event.params.amountIn
  entity.amountInRemaining = event.params.amountInRemaining
  entity.amountOut = event.params.amountOut

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
