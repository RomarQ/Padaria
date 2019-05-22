import { OperationsInterface, UnsignedOperationProps, OperationProps, UnsignedOperations } from './operations';
import { PendingOperations } from './operations';

export interface RPCInterface extends UserSettingsType {
    ready: boolean;
    apiClient: any;
    network: string;
    networkEpoch: string;
    networkConstants: NetworkConstants;
    load: (options:UserSettingsType) => Promise<boolean>;
    setCurrentNetwork: () => Promise<void>;
    setNetworkConstants: () => Promise<void>;
    getCurrentHead: () => Promise<BlockProps>;
    getCurrentCycle: () => Promise<number>;
    getBlockHeader: (blockId:string) => Promise<BlockHeaderProps>;
    getBlockMetadata: (blockId:string) => Promise<BlockMetadataProps>;
    queryNode: (path:string, mothod:QueryType, args?:any) => Promise<any>;
    queryTzScan: (path:string, mothod:QueryType, args?:any) => Promise<any>;
    queryAPI: (query:string, variables?:Object<any>) => Promise<any>;
    queryRequest: (options:RequestOptions, args?:any) => Promise<any>;
    queryStreamRequest: (options:RequestOptions, cb:(res:any, resolve:()=>void) => void) => Promise<any>;
    getBalance: (pkh:string) => Promise<number>;
    simulateOperation: (from:string, keys:KeysType, operation:OperationProps) => Promise<OperationProps[]>;
    forgeOperation: (head:BlockHeaderProps, operation:UnsignedOperationProps, skipConfirmation?:boolean) => Promise<UnsignedOperationProps & {forgedConfirmation: string}>;
    preapplyOperations: (operation:UnsignedOperationProps[]) => Promise<UnsignedOperationProps[]>;
    injectOperation: (operation:UnsignedOperationProps) => Promise<UnsignedOperationProps>;
    getContract: (pkh:string) => Promise<{
        manager: string;
        balance: string;
        spendable: boolean;
        delegate: {
            setable: boolean;
            value: string;
        };
        counter: number;
    }>;
    getManager: (pkh:string) => Promise<{key:string, manager:string}>;
    getCounter: (pkh:string) => Promise<number>;
    getEndorsementOperations: (blockId:string) => Promise<UnsignedOperationProps[]>;
    getPredecessors: (blockId:string, length:number) => Promise<string[]>;
    getBlock: (blockId:string) => Promise<BlockProps>;
    getBlockOperations: (blockId:string) => Promise<UnsignedOperationProps[][]>;
    getBlockHash: (blockId:string) => Promise<string>;
    getPendingOperations: () => Promise<UnsignedOperationProps[][]>;
    monitorOperations: (callback: (operations:any, resolve:()=>void) => void) => Promise<void>;
    monitorHeads: (chainId:string, callback: (header:BlockHeaderProps, resolve:()=>void) => void) => Promise<void>;
    monitorValidBlocks: (chainId:string, callback: (header:BlockHeaderProps, resolve:()=>void) => void) => Promise<void>;
};

type RequestOptions = {
    hostname: string;
    port: number;
    timeout?: number;
    path: string;
    method: string;
    key?: string;
    cert?: string;
    headers?: {
        [index: string]: string;
    },
    agent?: any;
    requestCert?: boolean;
    rejectUnauthorized?: boolean;
};

export type QueryType = 
    | 'GET'
    | 'POST';

export type TezosUnitType = {
    char: string;
    unit: number;
}

export type NetworkConstants = {
    block_reward?: string;
    block_security_deposit?: string;
    blocks_per_commitment?: number;
    blocks_per_cycle?: number;
    blocks_per_roll_snapshot?: number;
    blocks_per_voting_period?: number;
    cost_per_byte?: string;
    endorsement_reward?: string;
    endorsement_security_deposit?: string;
    endorsers_per_block?: number;
    hard_gas_limit_per_block?: string;
    hard_gas_limit_per_operation?: string;
    hard_storage_limit_per_operation?: string;
    max_operation_data_length?: number;
    max_proposals_per_delegate?: number;
    max_revelations_per_block?: number;
    michelson_maximum_type_size?: number;
    nonce_length?: number;
    origination_size?: number;
    preserved_cycles?: number;
    proof_of_work_nonce_size?: number;
    proof_of_work_threshold?: string;
    seed_nonce_revelation_tip?: string;
    time_between_blocks?: string[];
    tokens_per_roll?: string;
    // New Zeronet constants
    delay_per_missing_endorsement?: string;
    endorsement_bonus_intercept?: number;
    endorsement_bonus_slope?: number;
    endorsement_reward_priority_bonus?: string;
    minimum_endorsements_per_priority?: number[];
};