import { Swap as SwapEvent } from "../generated/SwapRouter/SwapRouter"
import { Swap, Token, TokenDayData } from "../generated/schema"
import { ERC20 } from "../generated/SwapRouter/ERC20"
import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts"

export function handleSwap(event: SwapEvent): void {
  // 保存Swap事件
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

  // 更新代币统计信息
  updateTokenStats(event)
}

function updateTokenStats(event: SwapEvent): void {
  // 注意：这里需要根据实际的SwapRouter事件参数来确定token0和token1
  // 由于Swap事件可能不直接包含token地址，我们可能需要从其他方式获取
  // 这里提供一个框架，您可能需要根据实际的合约事件调整
  
  let amountIn = event.params.amountIn
  let amountOut = event.params.amountOut
  let zeroForOne = event.params.zeroForOne
  
  // 计算交易量（这里简化处理，实际需要根据代币精度和价格计算USD价值）
  let volumeUSD = amountIn.toBigDecimal().div(BigDecimal.fromString("1000000000000000000")) // 假设18位精度
  
  // 更新日度数据
  updateTokenDayData(event.block.timestamp, volumeUSD)
}

function updateTokenDayData(timestamp: BigInt, volumeUSD: BigDecimal): void {
  let dayID = timestamp.toI32() / 86400 // 获取天数
  let dayStartTimestamp = dayID * 86400
  let dayIDString = dayID.toString()
  
  // 这里需要根据实际的代币地址来更新对应的TokenDayData
  // 由于Swap事件可能不直接包含token地址，这个函数需要根据实际情况调整
  
  log.info("Updating token day data for day: {}, volume: {}", [
    dayIDString,
    volumeUSD.toString()
  ])
}
