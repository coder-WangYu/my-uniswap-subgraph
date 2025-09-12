import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { PoolCreated } from "../generated/schema"
import { PoolCreated as PoolCreatedEvent } from "../generated/PoolManager/PoolManager"
import { handlePoolCreated } from "../src/pool-manager"
import { createPoolCreatedEvent } from "./pool-manager-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let token0 = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let token1 = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let index = BigInt.fromI32(234)
    let tickLower = 123
    let tickUpper = 123
    let fee = 123
    let pool = Address.fromString("0x0000000000000000000000000000000000000001")
    let newPoolCreatedEvent = createPoolCreatedEvent(
      token0,
      token1,
      index,
      tickLower,
      tickUpper,
      fee,
      pool
    )
    handlePoolCreated(newPoolCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("PoolCreated created and stored", () => {
    assert.entityCount("PoolCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "PoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token0",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "PoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token1",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "PoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "index",
      "234"
    )
    assert.fieldEquals(
      "PoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tickLower",
      "123"
    )
    assert.fieldEquals(
      "PoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tickUpper",
      "123"
    )
    assert.fieldEquals(
      "PoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "fee",
      "123"
    )
    assert.fieldEquals(
      "PoolCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pool",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
