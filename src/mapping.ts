import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer as TransferEvent,
  CryptoZooBaseAnimal as AnimalContract,
  hatched
} from "../generated/CryptoZooBaseAnimal/CryptoZooBaseAnimal"

import { 
  /*ExampleEntity, */HatchedEvent, CryptoZooBaseAnimal, ZooKeeper 
} from "../generated/schema"

/*
export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.isBurningActive(...)
  // - contract.isHatchingActive(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenByIndex(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.tokenURI(...)
  // - contract.totalSupply(...)
}
*/


export function handleTransfer(event: TransferEvent): void {
  let token = CryptoZooBaseAnimal.load(event.params.tokenId.toString());
  if (!token) {
   token = new CryptoZooBaseAnimal(event.params.tokenId.toString());
   token.creator = event.params.to.toHexString();
   token.tokenID = event.params.tokenId;
   token.createdAtTimestamp = event.block.timestamp;
  
   let tokenContract = AnimalContract.bind(event.address);
   token.metadataURI = tokenContract.tokenURI(event.params.tokenId);
  }
  token.owner = event.params.to.toHexString();
  token.save();
  
  let user = ZooKeeper.load(event.params.to.toHexString());
  if (!user) {
   user = new ZooKeeper(event.params.to.toHexString());
   user.save();
  }
}

export function handlehatched(event: hatched): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = HatchedEvent.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new HatchedEvent(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }
  entity.tokenID = event.params.tokenId

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // BigInt and BigDecimal math are supported
  entity.hatchedAtTimestamp = event.block.timestamp

  // Entity fields can be set based on event parameters
  entity.owner = event.params.toAddress
  entity.contractAddress = event.params.contractAddress

  // Entities can be written to the store with `.save()`
  entity.save()
}
