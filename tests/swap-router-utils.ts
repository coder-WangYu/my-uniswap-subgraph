import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { Swap } from "../generated/SwapRouter/SwapRouter"

export function createSwapEvent(
  sender: Address,
  zeroForOne: boolean,
  amountIn: BigInt,
  amountInRemaining: BigInt,
  amountOut: BigInt
): Swap {
  let swapEvent = changetype<Swap>(newMockEvent())

  swapEvent.parameters = new Array()

  swapEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "zeroForOne",
      ethereum.Value.fromBoolean(zeroForOne)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amountIn",
      ethereum.Value.fromUnsignedBigInt(amountIn)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amountInRemaining",
      ethereum.Value.fromUnsignedBigInt(amountInRemaining)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amountOut",
      ethereum.Value.fromUnsignedBigInt(amountOut)
    )
  )

  return swapEvent
}
