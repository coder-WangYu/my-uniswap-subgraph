import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { PoolCreated } from "../generated/PoolManager/PoolManager"

export function createPoolCreatedEvent(
  token0: Address,
  token1: Address,
  index: BigInt,
  tickLower: i32,
  tickUpper: i32,
  fee: i32,
  pool: Address
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("token0", ethereum.Value.fromAddress(token0))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("token1", ethereum.Value.fromAddress(token1))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("tickLower", ethereum.Value.fromI32(tickLower))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("tickUpper", ethereum.Value.fromI32(tickUpper))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "fee",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(fee))
    )
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("pool", ethereum.Value.fromAddress(pool))
  )

  return poolCreatedEvent
}
