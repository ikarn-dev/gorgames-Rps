import { AnchorProvider, Program, Idl, Wallet } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import spsIdl from '../constants/sps.json';
import { Sps } from '../types/sps';

export type SpsProgram = Program<Sps>;

const SPS_PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || "E4DyKAucV3EdC2sQDuFYujDcoro3MhSb4FhQ1ZbFGdSi";
const SOLANA_CLUSTER = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://rpc.gorbagana.wtf";

// NOTE: This is a Solana fork using GOR as fee token instead of SOL
// The program may need to be redeployed on this fork for compatibility

const CONNECTION_CONFIG = {
  commitment: 'confirmed' as const,
  confirmTransactionInitialTimeout: 60000,
  disableRetryOnRateLimit: false,
  httpHeaders: {},
  wsEndpoint: undefined, // Disable WebSocket
};

// Shared connection instance
let connection: Connection | null = null;

function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(SOLANA_CLUSTER, CONNECTION_CONFIG);
  }
  return connection;
}

// Create a wrapper for wallets that don't have signAllTransactions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createWalletWrapper(wallet: any): Wallet {
  // Get the actual wallet adapter if it exists
  const adapter = wallet.adapter || wallet;
  
  // Get publicKey from either the wallet or its adapter
  const publicKey = adapter.publicKey;
  if (!publicKey) {
    throw new Error("Wallet must have publicKey");
  }

  // Get signTransaction from either the wallet or its adapter
  const signTransaction = adapter.signTransaction?.bind(adapter);
  if (!signTransaction) {
    throw new Error("Wallet must have signTransaction method");
  }

  // Get signAllTransactions from either the wallet or its adapter, or create fallback
  const signAllTransactions = adapter.signAllTransactions?.bind(adapter) || 
    (async (transactions: Transaction[]): Promise<Transaction[]> => {
      return Promise.all(transactions.map((tx: Transaction) => signTransaction(tx)));
    });

  return {
    publicKey,
    payer: publicKey,
    signTransaction,
    signAllTransactions,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateWallet(wallet: any): asserts wallet is Wallet {
  if (!wallet) {
    throw new Error("Wallet is required but was not provided");
  }
  
  // Get the actual wallet adapter if it exists
  const adapter = wallet.adapter || wallet;
  
  if (!adapter.publicKey) {
    throw new Error("Wallet must have a publicKey");
  }
  
  if (!adapter.signTransaction) {
    throw new Error("Wallet must have signTransaction method");
  }
}

/**
 * Creates an AnchorProvider, which is a wrapper around the Solana Connection
 * and a wallet, required for signing transactions.
 * @param wallet The wallet object (e.g., from @solana/wallet-adapter-react).
 * @returns A configured AnchorProvider instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProvider(wallet: any): AnchorProvider {
  const conn = getConnection();
  
  // Create a proper wallet wrapper
  const walletWrapper = createWalletWrapper(wallet);
  
  return new AnchorProvider(
    conn, 
    walletWrapper, 
    {
      ...AnchorProvider.defaultOptions(),
      commitment: 'confirmed',
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    }
  );
}

/**
 * A convenience function that creates the provider and program in one step.
 * Use this directly with your wallet to avoid TypeScript errors.
 *
 * @param wallet The wallet object from your application (e.g., from useAnchorWallet).
 * @returns The initialized SpsProgram instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProgramFromWallet(wallet: any): Promise<SpsProgram> {
  validateWallet(wallet);
  
  const provider = getProvider(wallet);
  const programId = new PublicKey(SPS_PROGRAM_ID);
  
  try {
    // Try to use deployed IDL first, fall back to local
    const idlToUse = await getIdl(programId, provider);
    
    return await Program.at(programId, provider) as SpsProgram;
  } catch (error) {
    throw new Error(`Failed to initialize program: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function getIdl(programId: PublicKey, provider: AnchorProvider): Promise<Idl> {
  try {
    const deployedIdl = await Program.fetchIdl(programId, provider);
    
    if (deployedIdl) {
      return ensureGameAccountType(deployedIdl);
    }
  } catch (error) {
  }
  
  return spsIdl as Idl;
}

/**
 * Ensures the Game account has proper type definition
 * This is a temporary fix - ideally types should be generated from IDL
 */
function ensureGameAccountType(idl: Idl): Idl {
  if (!idl.accounts || idl.accounts.length === 0) {
    return idl;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameAccount = idl.accounts.find((acc: any) => acc.name === 'Game') as any;
  
  if (gameAccount && !gameAccount.type) {
    gameAccount.type = {
      kind: "struct",
      fields: [
        { name: "player1", type: "pubkey" },
        { name: "player2", type: { option: "pubkey" } },
        { name: "join_code", type: { array: ["u8", 8] } },
        { name: "status", type: { defined: { name: "GameStatus" } } },
        { name: "bet_amount", type: "u64" },
        { name: "rounds_won_p1", type: "u8" },
        { name: "rounds_won_p2", type: "u8" },
        { name: "total_rounds", type: "u8" },
        { name: "created_at", type: "i64" },
        { name: "last_activity", type: "i64" },
        { name: "game_bump", type: "u8" },
        { name: "player1_refunded", type: "bool" },
        { name: "player2_refunded", type: "bool" },
        { name: "player1_timeout_refunded", type: "bool" },
        { name: "player2_timeout_refunded", type: "bool" },
        { name: "player1_commit", type: { option: { array: ["u8", 32] } } },
        { name: "player2_commit", type: { option: { array: ["u8", 32] } } },
        { name: "player1_move", type: { option: { defined: { name: "Move" } } } },
        { name: "player2_move", type: { option: { defined: { name: "Move" } } } }
      ]
    };
  }
  
  return idl;
}