import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { hyperionTestnet } from '@/config/wagmi';
import { 
  CONTRACT_ADDRESSES, 
  SOULBOUND_IDENTITY_NFT_ABI, 
  DAO_REGISTRY_ABI,
  DAO_FACTORY_ABI,
  AI_ORACLE_ABI,
  AI_VOTING_MODULE_ABI,
  PROPOSAL_REGISTRY_ABI,
  PROPOSAL_METADATA_ABI,
  GOVERNANCE_TOKEN_ABI 
} from '@/config/contracts';

export function useSoulboundIdentityNFT() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: isVerified } = useReadContract({
    address: CONTRACT_ADDRESSES.SOULBOUND_IDENTITY_NFT,
    abi: SOULBOUND_IDENTITY_NFT_ABI,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
    chainId: hyperionTestnet.id,
  });

  const { data: identity } = useReadContract({
    address: CONTRACT_ADDRESSES.SOULBOUND_IDENTITY_NFT,
    abi: SOULBOUND_IDENTITY_NFT_ABI,
    functionName: 'getIdentity',
    args: address ? [address] : undefined,
    chainId: hyperionTestnet.id,
  });

  const mintIdentity = async (verificationHash: string, metadataURI: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.SOULBOUND_IDENTITY_NFT,
      abi: SOULBOUND_IDENTITY_NFT_ABI,
      functionName: 'mintIdentity',
      args: [address, verificationHash as `0x${string}`, metadataURI],
      account: address,
      chain: hyperionTestnet,
    });
  };

  return {
    isVerified: isVerified || false,
    identity,
    mintIdentity,
  };
}

export function useDAORegistry() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: allDAOs } = useReadContract({
    address: CONTRACT_ADDRESSES.DAO_REGISTRY,
    abi: DAO_REGISTRY_ABI,
    functionName: 'getAllDAOs',
    args: [0n, 100n],
    chainId: hyperionTestnet.id,
  });

  const { data: userDAOs } = useReadContract({
    address: CONTRACT_ADDRESSES.DAO_REGISTRY,
    abi: DAO_REGISTRY_ABI,
    functionName: 'getUserDAOs',
    args: address ? [address] : undefined,
    chainId: hyperionTestnet.id,
  });

  const joinDAO = async (daoId: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.DAO_REGISTRY,
      abi: DAO_REGISTRY_ABI,
      functionName: 'joinDAO',
      args: [BigInt(daoId)],
      account: address,
      chain: hyperionTestnet,
    });
  };

  const checkMembership = (daoId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.DAO_REGISTRY,
      abi: DAO_REGISTRY_ABI,
      functionName: 'checkMembership',
      args: address ? [address, BigInt(daoId)] : undefined,
      chainId: hyperionTestnet.id,
    });
  };

  return {
    allDAOs: allDAOs || [],
    userDAOs: userDAOs || [],
    joinDAO,
    checkMembership,
  };
}

export function useGovernanceToken() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE_TOKEN,
    abi: GOVERNANCE_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: hyperionTestnet.id,
  });

  const { data: votingPower } = useReadContract({
    address: CONTRACT_ADDRESSES.GOVERNANCE_TOKEN,
    abi: GOVERNANCE_TOKEN_ABI,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    chainId: hyperionTestnet.id,
  });

  const delegate = async (delegatee: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.GOVERNANCE_TOKEN,
      abi: GOVERNANCE_TOKEN_ABI,
      functionName: 'delegate',
      args: [delegatee as `0x${string}`],
      account: address,
      chain: hyperionTestnet,
    });
  };

  return {
    balance: balance || BigInt(0),
    votingPower: votingPower || BigInt(0),
    delegate,
  };
}

export function useAIOracle() {
  const getAnalysis = (proposalId: string) => {
    const { data } = useReadContract({
      address: CONTRACT_ADDRESSES.AI_ORACLE,
      abi: AI_ORACLE_ABI,
      functionName: 'getAnalysis',
      args: [proposalId as `0x${string}`],
      chainId: hyperionTestnet.id,
    });
    return { data };
  };

  const getPrediction = (proposalId: string) => {
    const { data } = useReadContract({
      address: CONTRACT_ADDRESSES.AI_ORACLE,
      abi: AI_ORACLE_ABI,
      functionName: 'getPrediction',
      args: [proposalId as `0x${string}`],
      chainId: hyperionTestnet.id,
    });
    return { data };
  };

  return {
    getAnalysis,
    getPrediction,
  };
}

export function useDAOFactory() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { allDAOs } = useDAORegistry();

  const createDAO = async (config: {
    name: string;
    tokenName: string;
    tokenSymbol: string;
    initialSupply: bigint;
    votingDelay: bigint;
    votingPeriod: bigint;
    proposalThreshold: bigint;
    quorumPercentage: bigint;
    timelockDelay: bigint;
  }) => {
    if (!address) throw new Error('Wallet not connected');
    
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.DAO_FACTORY,
      abi: DAO_FACTORY_ABI,
      functionName: 'createDAO',
      args: [
        config.name,
        config.tokenName,
        config.tokenSymbol,
        config.initialSupply,
        config.votingDelay,
        config.votingPeriod,
        config.proposalThreshold,
        config.quorumPercentage,
        config.timelockDelay
      ],
      account: address,
      chain: hyperionTestnet,
    });
  };

  return {
    allDAOs,
    createDAO,
  };
}

export function useAIVotingModule() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: aiConfig } = useReadContract({
    address: CONTRACT_ADDRESSES.AI_VOTING_MODULE,
    abi: AI_VOTING_MODULE_ABI,
    functionName: 'userAIConfigs',
    args: address ? [address] : undefined,
    chainId: hyperionTestnet.id,
  });

  const configureAIVoting = async (
    enabled: boolean,
    minConfidenceThreshold: bigint,
    votingDelay: bigint
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.AI_VOTING_MODULE,
      abi: AI_VOTING_MODULE_ABI,
      functionName: 'configureAIVoting',
      args: [enabled, minConfidenceThreshold, votingDelay],
      account: address,
      chain: hyperionTestnet,
    });
  };

  return {
    aiConfig: aiConfig || [false, BigInt(70), BigInt(24)] as [boolean, bigint, bigint],
    configureAIVoting,
  };
}

export function useProposalRegistry() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: allProposals } = useReadContract({
    address: CONTRACT_ADDRESSES.PROPOSAL_REGISTRY,
    abi: PROPOSAL_REGISTRY_ABI,
    functionName: 'getAllProposals',
    args: [0n, 100n],
    chainId: hyperionTestnet.id,
  });

  const registerProposal = async (proposal: {
    dao: string;
    proposalId: number;
    title: string;
    description: string;
    category: string;
    deadline: number;
    aiConfidenceScore?: number;
  }) => {
    if (!address) throw new Error('Wallet not connected');
    
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.PROPOSAL_REGISTRY,
      abi: PROPOSAL_REGISTRY_ABI,
      functionName: 'registerProposal',
      args: [
        proposal.dao as `0x${string}`,
        BigInt(proposal.proposalId),
        proposal.title,
        proposal.description,
        proposal.category,
        BigInt(proposal.deadline),
        BigInt(proposal.aiConfidenceScore || 0)
      ],
      account: address,
      chain: hyperionTestnet,
    });
  };

  const getProposalsByCategory = (category: string) => {
    if (!allProposals) return [];
    return allProposals.filter((p: any) => p.category === category);
  };

  return {
    allProposals: allProposals || [],
    registerProposal,
    getProposalsByCategory,
  };
}

export function useProposalMetadata() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const getProposalMetadata = (proposalId: number) => {
    const { data } = useReadContract({
      address: CONTRACT_ADDRESSES.PROPOSAL_METADATA_MODULE,
      abi: PROPOSAL_METADATA_ABI,
      functionName: 'getMetadata',
      args: [BigInt(proposalId)],
      chainId: hyperionTestnet.id,
    });
    return { data };
  };

  const storeProposalMetadata = async (metadata: {
    proposalId: number;
    tags: string[];
    aiConfidenceScore: number;
    enableAIVoting: boolean;
  }) => {
    if (!address) throw new Error('Wallet not connected');
    
    return await writeContractAsync({
      address: CONTRACT_ADDRESSES.PROPOSAL_METADATA_MODULE,
      abi: PROPOSAL_METADATA_ABI,
      functionName: 'storeMetadata',
      args: [
        BigInt(metadata.proposalId),
        metadata.tags,
        BigInt(metadata.aiConfidenceScore),
        metadata.enableAIVoting
      ],
      account: address,
      chain: hyperionTestnet,
    });
  };

  return {
    getProposalMetadata,
    storeProposalMetadata,
  };
}
