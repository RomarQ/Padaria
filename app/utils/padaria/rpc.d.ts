import { GraphQLClient } from 'graphql-request'
import { BakingRight } from './baker.d'

export interface RPCInterface extends TezariaSettingsProps {
  ready: boolean
  apiClient: GraphQLClient
  network: string
  networkEpoch: string
  networkConstants: NetworkConstants
  load: (options: TezariaSettingsProps) => Promise<boolean>
  setCurrentNetwork: () => Promise<void>
  setNetworkConstants: () => Promise<void>
  getCurrentHead: () => Promise<BlockProps>
  getCurrentLevel: (chainId?: string, blockId?: string) => Promise<LevelProps>
  getCurrentCycle: (chainId?: string, blockId?: string) => Promise<number>
  getBlockHeader: (blockId: string) => Promise<BlockHeaderProps>
  getBlockMetadata: (blockId: string) => Promise<BlockMetadataProps>
  getBakingRights: (
    pkh: string,
    level: number,
    maxPriority?: number,
    chainId?: string,
    blockId?: string
  ) => Promise<BakingRight[]>
  queryNode: (
    path: string,
    method: QueryType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args?: Record<string, any> | string
  ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryAPI: (query: string, variables?: Record<string, any>) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryRequest: (options: RequestOptions, args?: any) => Promise<any>
  queryStreamRequest: (
    options: RequestOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb: (res: any, resolve: () => void) => void
  ) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Promise<any>
  getBalance: (pkh: string) => Promise<number>
  getContract: (pkh: string) => Promise<ContractProps>
  getManager: (contract: string) => Promise<{ key: string; manager: string }>
  getCounter: (pkh: string) => Promise<number>
  getEndorsementOperations: (
    blockId: string
  ) => Promise<UnsignedOperationProps[]>
  getPredecessors: (blockId: string, length: number) => Promise<string[]>
  getBlock: (blockId: string) => Promise<BlockProps>
  getBlockOperations: (blockId: string) => Promise<UnsignedOperationProps[][]>
  getBlockHash: (blockId: string) => Promise<string>
  getPendingOperations: () => Promise<UnsignedOperationProps[][]>
  monitorOperations: (
    callback: (operations: any, resolve: () => void) => void
  ) => Promise<void>
  monitorHeads: (
    chainId: string,
    callback: (header: BlockHeaderProps, resolve: () => void) => void
  ) => Promise<void>
  monitorValidBlocks: (
    chainId: string,
    callback: (header: BlockHeaderProps, resolve: () => void) => void
  ) => Promise<void>
  getEndorsingPower: (
    chainID: string,
    endorsementOp: EndorsementOperationProps
  ) => Promise<number>
  emmyDelay: (priority: number) => number
  emmyPlusDelay: (priority: number, endorsingPower: number) => number
  endorsingPower: (endorsements: EndorsementOperationProps[]) => Promise<number>
  verifyNodeCommits: () => Promise<TezosCommitProps>
}

interface RequestOptions {
  hostname: string
  port: number
  timeout?: number
  path: string
  method: string
  key?: string
  cert?: string
  headers?: {
    [index: string]: string
  }
  requestCert?: boolean
  rejectUnauthorized?: boolean
}

declare type QueryType = 'GET' | 'POST'

export interface NetworkConstants {
  block_reward?: string
  block_security_deposit?: string
  blocks_per_commitment?: number
  blocks_per_cycle?: number
  blocks_per_roll_snapshot?: number
  blocks_per_voting_period?: number
  cost_per_byte?: string
  endorsement_reward?: string
  endorsement_security_deposit?: string
  endorsers_per_block?: number
  hard_gas_limit_per_block?: string
  hard_gas_limit_per_operation?: string
  hard_storage_limit_per_operation?: string
  max_operation_data_length?: number
  max_proposals_per_delegate?: number
  max_revelations_per_block?: number
  michelson_maximum_type_size?: number
  nonce_length?: number
  origination_size?: number
  preserved_cycles?: number
  proof_of_work_nonce_size?: number
  proof_of_work_threshold?: string
  seed_nonce_revelation_tip?: string
  time_between_blocks?: string[]
  tokens_per_roll?: string
  // New Zeronet constants
  delay_per_missing_endorsement?: string
  quorum_max?: number
  quorum_min?: number
  min_proposal_quorum?: number
  initial_endorsers?: number
}

export interface TezosCommitProps {
  updated: boolean
  currentCommitHash: string
  lastCommitHash: string
  commitsBehind: number
  author: string
  date: string
  message: string
}
