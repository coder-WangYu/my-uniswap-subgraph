import { Token, TokenDayData } from "../../generated/schema"
import { ERC20 } from "../../generated/PoolManager/ERC20"
import { BigInt, BigDecimal, Address, log } from "@graphprotocol/graph-ts"

export function createOrLoadToken(tokenAddress: Address, timestamp: BigInt): Token {
  let token = Token.load(tokenAddress)
  if (!token) {
    token = new Token(tokenAddress)
    let tokenContract = ERC20.bind(tokenAddress)
    
    // 获取代币基础信息
    let nameResult = tokenContract.try_name()
    let symbolResult = tokenContract.try_symbol()
    let decimalsResult = tokenContract.try_decimals()
    let totalSupplyResult = tokenContract.try_totalSupply()
    
    // 设置代币信息，如果调用失败则使用默认值
    token.name = nameResult.reverted ? "Unknown" : nameResult.value
    token.symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value
    token.decimals = decimalsResult.reverted ? 18 : decimalsResult.value
    token.totalSupply = totalSupplyResult.reverted ? BigInt.fromI32(0) : totalSupplyResult.value
    
    // 初始化统计字段
    token.totalVolumeUSD = BigDecimal.fromString("0")
    token.totalLiquidityUSD = BigDecimal.fromString("0")
    token.txCount = BigInt.fromI32(0)
    token.priceUSD = null
    token.createdAt = timestamp
    token.updatedAt = timestamp
    
    log.info("Created new token: {} - {} ({})", [
      token.name,
      token.symbol,
      tokenAddress.toHexString()
    ])
  } else {
    // 更新现有代币的时间戳
    token.updatedAt = timestamp
  }
  
  return token
}

export function updateTokenDayData(
  tokenAddress: Address,
  timestamp: BigInt,
  volumeUSD: BigDecimal
): TokenDayData {
  let dayID = timestamp.toI32() / 86400 // 获取天数
  let dayStartTimestamp = dayID * 86400
  let tokenDayID = tokenAddress.toHexString() + "-" + dayID.toString()
  
  let tokenDayData = TokenDayData.load(tokenDayID)
  if (!tokenDayData) {
    tokenDayData = new TokenDayData(tokenDayID)
    tokenDayData.token = tokenAddress
    tokenDayData.date = dayStartTimestamp
    tokenDayData.volumeUSD = BigDecimal.fromString("0")
    tokenDayData.volumeETH = BigDecimal.fromString("0")
    tokenDayData.txCount = BigInt.fromI32(0)
    tokenDayData.liquidityUSD = BigDecimal.fromString("0")
    tokenDayData.priceChangeUSD = BigDecimal.fromString("0")
    tokenDayData.priceChangePercent = BigDecimal.fromString("0")
  }
  
  // 更新统计数据
  tokenDayData.volumeUSD = tokenDayData.volumeUSD.plus(volumeUSD)
  tokenDayData.txCount = tokenDayData.txCount.plus(BigInt.fromI32(1))
  
  return tokenDayData
}

export function calculateTokenPrice(
  amountIn: BigInt,
  amountOut: BigInt,
  decimalsIn: i32,
  decimalsOut: i32
): BigDecimal {
  // 简化的价格计算，实际应用中可能需要更复杂的逻辑
  let amountInDecimal = amountIn.toBigDecimal().div(
    BigDecimal.fromString("10").pow(decimalsIn as u8)
  )
  let amountOutDecimal = amountOut.toBigDecimal().div(
    BigDecimal.fromString("10").pow(decimalsOut as u8)
  )
  
  if (amountInDecimal.equals(BigDecimal.fromString("0"))) {
    return BigDecimal.fromString("0")
  }
  
  return amountOutDecimal.div(amountInDecimal)
}

export function convertToUSD(
  amount: BigInt,
  decimals: i32,
  priceUSD: BigDecimal | null
): BigDecimal {
  if (priceUSD == null) {
    return BigDecimal.fromString("0")
  }
  
  let amountDecimal = amount.toBigDecimal().div(
    BigDecimal.fromString("10").pow(decimals as u8)
  )
  
  return amountDecimal.times(priceUSD as BigDecimal)
}
