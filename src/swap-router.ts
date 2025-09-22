import { Swap as SwapEvent } from "../generated/SwapRouter/SwapRouter"
import { Swaps } from "../generated/schema"
import { ERC20 } from "../generated/SwapRouter/ERC20"
import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts"

export function handleSwap(event: SwapEvent): void {
  // 保存Swap事件
  let swap = new Swaps(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  swap.sender = event.params.sender
  swap.amountIn = event.params.amountIn
  swap.amountOut = event.params.amountOut

  swap.blockNumber = event.block.number
  swap.blockTimestamp = event.block.timestamp
  swap.transactionHash = event.transaction.hash

  swap.save()
}
