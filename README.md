# Reggata Game

A digital implementation of the Reggata board game inspired by [Soulframe's Reggata](https://forums.soulframe.com/topic/570-regatta-the-rules-and-where-to-play/). This is a turn-based strategy game for two players where you race to move all your tokens from home to the finish line.

## How to Play

### Game Overview

Reggata is a board game where two players compete to be the first to move all 4 of their tokens from their home area to the finish area on the board.

### Game Setup

- Each player chooses a color (Red or Blue)
- Each player starts with 4 tokens in their home area
- Players take turns in a predetermined order

### Turn Mechanics

1. **Roll the Coins**: On your turn, click to flip 4 coins
2. **Count Colored Coins**: Count how many coins land on your color (not grey)
3. **Move Tokens**: Use the number of colored coins as movement steps

### Movement Rules

- **From Home**: You can move a token from home to the starting position on the board using your rolled steps
- **On Board**: Move existing tokens forward along the path indicated by the tile arrows
- **Shield Tiles**: Special tiles that provide protection (tokens cannot be captured here)
- **Finish Area**: The goal area where tokens must reach to score

### Winning

The first player to successfully move all 4 tokens to the finish area wins the game!

### Special Features

- **Real-time Multiplayer**: Play against other players online
- **Match Creation**: Create a match and share the match ID with a friend
- **Match Joining**: Join an existing match using a match ID
- **Reset Option**: Reset the game at any time during play

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
