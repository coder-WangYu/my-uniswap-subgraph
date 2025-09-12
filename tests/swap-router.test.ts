import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Swap } from "../generated/schema"
import { Swap as SwapEvent } from "../generated/SwapRouter/SwapRouter"
import { handleSwap } from "../src/swap-router"
import { createSwapEvent } from "./swap-router-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let zeroForOne = "boolean Not implemented"
    let amountIn = BigInt.fromI32(234)
    let amountInRemaining = BigInt.fromI32(234)
    let amountOut = BigInt.fromI32(234)
    let newSwapEvent = createSwapEvent(
      sender,
      zeroForOne,
      amountIn,
      amountInRemaining,
      amountOut
    )
    handleSwap(newSwapEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("Swap created and stored", () => {
    assert.entityCount("Swap", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Swap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Swap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "zeroForOne",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "Swap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountIn",
      "234"
    )
    assert.fieldEquals(
      "Swap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountInRemaining",
      "234"
    )
    assert.fieldEquals(
      "Swap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountOut",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
