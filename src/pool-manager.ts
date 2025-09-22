import { PoolCreated } from "../generated/PoolManager/PoolManager"
import { Pools, Tokens } from "../generated/schema"
import { BigInt, Address, BigDecimal } from "@graphprotocol/graph-ts"
import { ERC20 } from "../generated/PoolManager/ERC20"

export function handlePoolCreated(event: PoolCreated): void {
  // 保存PoolCreated事件
  let pool = new Pools(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  // 创建或更新token0信息
  let token0 = createOrLoadToken(event.params.token0)
  token0.save()

  // 创建或更新token1信息
  let token1 = createOrLoadToken(event.params.token1)
  token1.save()

  pool.token0 = token0.id
  pool.token1 = token1.id
  pool.fee = event.params.fee
  pool.id = event.params.pool

  pool.blockNumber = event.block.number
  pool.blockTimestamp = event.block.timestamp
  pool.transactionHash = event.transaction.hash

  pool.save()
}

// 创建或读取代币
export function createOrLoadToken(tokenAddress: Address): Tokens {
  let token = Tokens.load(tokenAddress)

  if (!token) {
    token = new Tokens(tokenAddress)
    let tokenContract = ERC20.bind(tokenAddress)
    
    // 获取代币基础信息
    let nameResult = tokenContract.try_name()
    let symbolResult = tokenContract.try_symbol()
    let decimalsResult = tokenContract.try_decimals()
    let totalSupplyResult = tokenContract.try_totalSupply()
    
    // 设置代币信息，如果调用失败则使用默认值
    token.id = tokenAddress
    token.name = nameResult.reverted ? "Unknown" : nameResult.value
    token.symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value
    token.decimals = decimalsResult.reverted ? 18 : decimalsResult.value
    token.totalSupply = totalSupplyResult.reverted ? BigInt.fromI32(0) : totalSupplyResult.value
    
    // 初始化统计字段
    token.totalVolumeUSD = BigDecimal.fromString("0")
    token.totalLiquidityUSD = BigDecimal.fromString("0")
  }
  
  return token
}
