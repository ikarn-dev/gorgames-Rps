# Gorbagana: On-Chain Rock Paper Scissors

A fully on-chain, fair, and interactive Rock-Paper-Scissors game built on Solana. Play with friends, wager testnet $GOR, and experience provably fair gameplay with a modern, retro-inspired UI.

---

## Table of Contents

- [Features](#features)
- [Gorbagana Chain Integration](#gorbagana-chain-integration)
- [How It Works](#how-it-works)
- [Smart Contract (Anchor)](#smart-contract-anchor)
- [Frontend (Next.js)](#frontend-nextjs)
- [Security & Fairness](#security--fairness)
- [Getting Started](#getting-started)
- [Upcoming Features](#upcoming-features)
- [Credits](#credits)

---

## Features

### On-Chain Game Logic

- **Create Game Room:** Anyone can create a game room with a unique join code and a fixed bet (0.05 GOR).
- **Join Game Room:** A second player can join using the room code and matching the bet.
- **Commit-Reveal Scheme:** Both players commit their moves (Rock, Paper, or Scissors) as a hash, then reveal them with a salt for fairness.
- **Best of 3 Rounds:** The game is played over 3 rounds; the player who wins 2 or more rounds wins the pot.
- **Automatic Payouts:** Winner claims the pot; in case of a tie, both can claim a refund.
- **Timeouts & Refunds:** If a player is inactive, the other can claim a refund after a timeout.
- **Game Cleanup:** Expired or abandoned games can be cleaned up to reclaim rent.

### Frontend Features

- **Wallet Integration:** Connect with Backpack or Solflare wallets.
- **Animated, Retro UI:** Modern, responsive design with retro console elements.
- **Lobby System:** Create or join rooms, share codes, and see real-time status.
- **Game Arena:** Visual feedback for each round, move selection, and round progress.
- **Turn Indicators:** See whose turn it is and the status of each player's move.
- **Feedback & Notifications:** Real-time feedback for actions, errors, and game events.
- **Game Summary:** End-of-game summary with winnings, refunds, and round breakdown.
- **Security Notices:** Clear communication about testnet status and fair play.

### Smart Contract (Anchor)

- **Programmed in Rust using Anchor.**
- **Handles all game state, SOL transfers, and fairness logic.**
- **Events for game creation, joining, round completion, and payouts.**
- **Strict error handling and validation for all actions.**

---

## Gorbagana Chain Integration

### What is Gorbagana?

Gorbagana is a custom Solana fork (testnet) that uses $GOR as its native fee token instead of $SOL. This project is fully deployed and operates on the Gorbagana chain, leveraging its unique RPC endpoint and token economics.

### How Integration Works

#### Backend (Anchor Smart Contract)

- **Cluster Configuration:**  
  The Anchor configuration files (`Anchor.toml` and `Anchor.tomlm`) set the provider cluster to `https://rpc.gorbagana.wtf`, ensuring all contract deployments and interactions occur on the Gorbagana chain.
  ```toml
  [provider]
  cluster = "https://rpc.gorbagana.wtf"
  wallet = "~/.config/solana/id.json"
  ```
- **Program Deployment:**  
  The smart contract (Anchor program) is deployed to Gorbagana, with the program IDs referenced in the config files. All instructions, SOL (GOR) transfers, and state changes are executed on this chain.

#### Frontend (Next.js/React)

- **RPC Endpoint:**  
  The frontend connects to Gorbagana via the same endpoint, either from environment variables or defaulting to `https://rpc.gorbagana.wtf`:
  ```js
  const SOLANA_CLUSTER = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://rpc.gorbagana.wtf";
  ```
- **Wallet Support:**  
  The app supports Backpack and Solflare wallets, allowing users to connect and sign transactions on Gorbagana.
- **Network Awareness:**  
  The UI displays a connection status indicating when the user is connected to the Gorbagana testnet.
- **GOR as Native Token:**  
  All bets, rewards, and fees are denominated in $GOR, and the UI consistently reflects this (e.g., "0.05 GOR" bet amounts, winnings, and refunds).

#### Shared Integration Details

- **IDL and Program ID:**  
  Both backend and frontend use the same program ID and IDL, ensuring contract calls are consistent and type-safe.
- **No Mainnet/SOL Risk:**  
  All funds and actions are isolated to the Gorbagana testnet, making it safe for experimentation and development.

---

## How the Contract Works on Gorbagana

- **Game Lifecycle:**  
  The contract manages the full lifecycle of a Rock-Paper-Scissors game, including creation, joining, move commitment, reveal, round resolution, payouts, and refunds.
- **Commit-Reveal Fairness:**  
  Players commit a hash of their move and a random salt, then reveal both. The contract verifies the hash to prevent cheating.
- **GOR Transfers:**  
  All bets are locked in the contract account on Gorbagana. The winner (or both, in case of a tie) can claim their GOR directly from the contract.
- **Cleanup:**  
  Expired or abandoned games can be cleaned up, returning rent to the payer and keeping the chain tidy.

---

## How It Works

1. **Connect Wallet:** Players connect their Solana wallet.
2. **Create or Join Room:** One player creates a room (with a code), the other joins using the code.
3. **Place Bets:** Both deposit the fixed bet into the game account.
4. **Commit Moves:** Each player secretly commits their move (hash of move + salt).
5. **Reveal Moves:** Both reveal their move and salt; contract verifies the hash.
6. **Determine Winner:** After 3 rounds, the winner claims the pot, or both claim refunds if tied.
7. **Timeouts:** If a player is inactive, the other can claim a refund after a set period.

---

## Smart Contract (Anchor)

- **initialize_game:** Creates a new game account, locks the bet, and emits a creation event.
- **join_game:** Second player joins, matching the bet, and game status updates.
- **commit_move:** Players submit a hash of their move and a random salt.
- **reveal_move:** Players reveal their move and salt; contract checks hash and updates round.
- **claim_winnings:** Winner claims the pot and closes the game account.
- **claim_draw_refund:** Both players can claim a refund if the game is tied.
- **refund:** If a player is inactive, the other can claim a refund after timeout.
- **cleanup_expired_game / force_cleanup_abandoned:** Anyone can clean up expired games to reclaim rent.

---

## Frontend (Next.js)

- **Lobby Page:** Entry point for creating or joining games.
- **Game Arena:** Main gameplay interface, including move selection, round progress, and results.
- **Components:** Modular React components for wallet connection, feedback, game status, player info, round progress, and more.
- **Hooks:** Custom hooks for on-chain game state, wallet management, and transaction handling.
- **Assets:** Custom graphics for buttons, backgrounds, and player avatars.

---

## Security & Fairness

- **Commit-Reveal:** Prevents cheating by ensuring moves are hidden until both are committed.
- **On-Chain Validation:** All game logic and payouts are enforced by the smart contract.
- **Timeouts:** Prevents griefing by allowing refunds if a player is inactive.
- **No Custodial Risk:** Funds are only held in the game account and paid out automatically.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   cd anchor
   yarn install
   cd ../game
   yarn install
   ```
2. **Run Anchor localnet (for development):**
   ```bash
   anchor test
   ```
3. **Start the frontend:**
   ```bash
   cd game
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Upcoming Features

- **Custom Bet Amounts:** Allow players to set custom stakes.
- **Leaderboard:** Track top players and win/loss records.
- **Spectator Mode:** Allow others to watch live games.
- **In-Game Chat:** Enable chat between players during a match.
- **NFT/Token Rewards:** Integrate NFT or SPL token rewards for winners.
- **Mobile Optimization:** Enhanced mobile UI/UX.
- **Multi-language Support:** Add localization for global players.
- **Advanced Anti-Cheat:** Zero-knowledge proofs for move commitment.
- **Analytics Dashboard:** Game stats, player analytics, and contract metrics.
- **Mainnet Deployment:** Launch on Solana mainnet with real $SOL.

---

## Credits

- **Powered by:** Solana,Gorbagana, Anchor, Next.js, and the open-source community. 