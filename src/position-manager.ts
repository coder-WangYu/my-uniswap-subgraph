import {
  IncreaseLiquidity,
  DecreaseLiquidity,
  Transfer,
  PositionManager,
} from "../generated/PositionManager/PositionManager";
import { Positions } from "../generated/schema";
import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import { createOrLoadToken } from "./pool-manager";

export function handleTransfer(event: Transfer): void {
  let position = new Positions(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  position.blockNumber = event.block.number;
  position.blockTimestamp = event.block.timestamp;
  position.transactionHash = event.transaction.hash;

  position.tokenId = event.params.tokenId;
  position.owner = event.params.to;
  position.changeType = "transfer";

  // 调用 getAllPositions 函数获取所有位置信息
  let positionManager = PositionManager.bind(event.address);
  let allPositionsResult = positionManager.try_getAllPositions();

  if (!allPositionsResult.reverted) {
    let allPositions = allPositionsResult.value;
    log.info("Found {} positions for tokenId: {}", [
      BigInt.fromI32(allPositions.length).toString(),
      event.params.tokenId.toString(),
    ]);

    // 查找匹配的位置
    let found = false;
    for (let i = 0; i < allPositions.length; i++) {
      let pos = allPositions[i];
      if (pos.id.equals(event.params.tokenId)) {
        log.info(
          "Found matching position: liquidity={}, tickLower={}, tickUpper={}",
          [
            pos.liquidity.toString(),
            pos.tickLower.toString(),
            pos.tickUpper.toString(),
          ]
        );

        // 保存position数据
        position.fee = pos.fee;
        position.liquidity = pos.liquidity;
        position.amount0 = pos.tokensOwed0;
        position.amount1 = pos.tokensOwed1;
        position.tickLower = pos.tickLower;
        position.tickUpper = pos.tickUpper;

        // 创建或更新token0信息
        let token0 = createOrLoadToken(pos.token0);
        token0.save();

        // 创建或更新token1信息
        let token1 = createOrLoadToken(pos.token1);
        token1.save();

        position.token0 = token0.id
        position.token1 = token1.id

        found = true;
        break;
      }
    }

    if (!found) {
      log.warning("No matching position found for tokenId: {}", [
        event.params.tokenId.toString(),
      ]);
    }
  } else {
    log.warning("Failed to call getAllPositions for tokenId: {}", [
      event.params.tokenId.toString(),
    ]);
  }

  position.save();
}

export function handleIncrease(event: IncreaseLiquidity): void {
  log.info("IncreaseLiquidity", [event.params.tokenId.toString()]);
}

export function handleDecrease(event: DecreaseLiquidity): void {
  log.info("DecreaseLiquidity", [event.params.tokenId.toString()]);
}
