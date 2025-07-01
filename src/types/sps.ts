/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sps.json`.
 */
export type Sps = {
  "address": "E4DyKAucV3EdC2sQDuFYujDcoro3MhSb4FhQ1ZbFGdSi",
  "metadata": {
    "name": "sps",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
    {
      "name": "claimDrawRefund",
      "docs": [
        "Handle refunds for drawn games"
      ],
      "discriminator": [
        233,
        191,
        221,
        132,
        48,
        126,
        38,
        202
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "claimWinnings",
      "docs": [
        "Claim winnings and close the game account using proper PDA closing"
      ],
      "discriminator": [
        161,
        215,
        24,
        59,
        14,
        236,
        242,
        221
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "winner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "cleanupExpiredGame",
      "docs": [
        "Improved cleanup with proper conditions and authorization"
      ],
      "discriminator": [
        93,
        240,
        111,
        188,
        245,
        124,
        130,
        114
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "player1",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "commitMove",
      "docs": [
        "Commit a move (hash of move + salt)"
      ],
      "discriminator": [
        27,
        16,
        69,
        212,
        175,
        110,
        123,
        189
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "player",
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "commit",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "forceCleanupAbandoned",
      "docs": [
        "Force cleanup for completely abandoned games (restricted to game participants)"
      ],
      "discriminator": [
        87,
        8,
        66,
        155,
        174,
        10,
        233,
        145
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "rentReceiver",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeGame",
      "docs": [
        "Initialize a new game, executing the SOL transfer via CPI."
      ],
      "discriminator": [
        44,
        62,
        102,
        247,
        126,
        208,
        130,
        215
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "joinCode"
              }
            ]
          }
        },
        {
          "name": "player1",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "joinCode",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        },
        {
          "name": "betAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "joinGame",
      "docs": [
        "Join an existing game, executing the SOL transfer via CPI."
      ],
      "discriminator": [
        107,
        112,
        18,
        38,
        56,
        173,
        60,
        128
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "player2",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "refund",
      "docs": [
        "Handle refunds for timed-out games using proper PDA signing"
      ],
      "discriminator": [
        2,
        96,
        183,
        251,
        63,
        208,
        46,
        46
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "revealMove",
      "docs": [
        "Reveal a move, verifying it against the prior commitment"
      ],
      "discriminator": [
        30,
        133,
        198,
        26,
        106,
        44,
        55,
        149
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.join_code",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "player",
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "playerMove",
          "type": {
            "defined": {
              "name": "move"
            }
          }
        },
        {
          "name": "salt",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    }
  ],
  "events": [
    {
      "name": "gameCleaned",
      "discriminator": [
        69,
        18,
        9,
        249,
        93,
        112,
        186,
        255
      ]
    },
    {
      "name": "gameCompleted",
      "discriminator": [
        103,
        26,
        106,
        108,
        240,
        191,
        179,
        120
      ]
    },
    {
      "name": "gameCreated",
      "discriminator": [
        218,
        25,
        150,
        94,
        177,
        112,
        96,
        2
      ]
    },
    {
      "name": "playerJoined",
      "discriminator": [
        39,
        144,
        49,
        106,
        108,
        210,
        183,
        38
      ]
    },
    {
      "name": "refundIssued",
      "discriminator": [
        249,
        16,
        159,
        159,
        93,
        186,
        145,
        206
      ]
    },
    {
      "name": "roundCompleted",
      "discriminator": [
        65,
        194,
        3,
        183,
        49,
        1,
        215,
        5
      ]
    },
    {
      "name": "winningsClaimed",
      "discriminator": [
        187,
        184,
        29,
        196,
        54,
        117,
        70,
        150
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidJoinCode",
      "msg": "Join code cannot be empty."
    },
    {
      "code": 6001,
      "name": "invalidBetAmount",
      "msg": "Bet amount must be exactly 0.05 SOL."
    },
    {
      "code": 6002,
      "name": "alreadyJoined",
      "msg": "A second player has already joined the game."
    },
    {
      "code": 6003,
      "name": "cannotJoinOwnGame",
      "msg": "You cannot join your own game."
    },
    {
      "code": 6004,
      "name": "invalidGameStatus",
      "msg": "Invalid game state for this action."
    },
    {
      "code": 6005,
      "name": "unauthorized",
      "msg": "Unauthorized action."
    },
    {
      "code": 6006,
      "name": "gameNotReady",
      "msg": "The game is not ready yet."
    },
    {
      "code": 6007,
      "name": "gameIsADraw",
      "msg": "This game ended in a draw. Use claim_draw_refund instead."
    },
    {
      "code": 6008,
      "name": "refundNotAllowed",
      "msg": "Refund not allowed in current game state."
    },
    {
      "code": 6009,
      "name": "alreadyRefunded",
      "msg": "Player already refunded."
    },
    {
      "code": 6010,
      "name": "gameTimedOut",
      "msg": "Game has timed out."
    },
    {
      "code": 6011,
      "name": "gameNotExpired",
      "msg": "Game is not expired enough for cleanup."
    },
    {
      "code": 6012,
      "name": "cannotCleanupYet",
      "msg": "Cannot cleanup yet - conditions not met."
    },
    {
      "code": 6013,
      "name": "mathOverflow",
      "msg": "Mathematical overflow occurred."
    },
    {
      "code": 6014,
      "name": "insufficientBalance",
      "msg": "Insufficient balance for this operation."
    },
    {
      "code": 6015,
      "name": "alreadyCommitted",
      "msg": "Player has already committed a move this round."
    },
    {
      "code": 6016,
      "name": "alreadyRevealed",
      "msg": "Player has already revealed their move this round."
    },
    {
      "code": 6017,
      "name": "mustCommitFirst",
      "msg": "Player must commit their move before revealing."
    },
    {
      "code": 6018,
      "name": "invalidReveal",
      "msg": "Revealed move does not match committed hash."
    },
    {
      "code": 6019,
      "name": "gameNotADraw",
      "msg": "This action is only valid for games that ended in a draw."
    },
    {
      "code": 6020,
      "name": "invalidMove",
      "msg": "Invalid move provided."
    },
    {
      "code": 6021,
      "name": "invalidCommit",
      "msg": "Commit hash cannot be empty."
    },
    {
      "code": 6022,
      "name": "weakSalt",
      "msg": "Salt value too weak. Use a larger random number."
    },
    {
      "code": 6023,
      "name": "tooManyRounds",
      "msg": "Game has exceeded maximum number of rounds."
    },
    {
      "code": 6024,
      "name": "fundsStillAvailable",
      "msg": "Funds are still available for refund."
    },
    {
      "code": 6025,
      "name": "refundAlreadyClaimed",
      "msg": "A refund has already been claimed for this game."
    }
  ],
  "types": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player1",
            "type": "pubkey"
          },
          {
            "name": "player2",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "joinCode",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "gameStatus"
              }
            }
          },
          {
            "name": "betAmount",
            "type": "u64"
          },
          {
            "name": "roundsWonP1",
            "type": "u8"
          },
          {
            "name": "roundsWonP2",
            "type": "u8"
          },
          {
            "name": "totalRounds",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "lastActivity",
            "type": "i64"
          },
          {
            "name": "gameBump",
            "type": "u8"
          },
          {
            "name": "player1Refunded",
            "type": "bool"
          },
          {
            "name": "player2Refunded",
            "type": "bool"
          },
          {
            "name": "player1TimeoutRefunded",
            "type": "bool"
          },
          {
            "name": "player2TimeoutRefunded",
            "type": "bool"
          },
          {
            "name": "player1Commit",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "player2Commit",
            "type": {
              "option": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          },
          {
            "name": "player1Move",
            "type": {
              "option": {
                "defined": {
                  "name": "move"
                }
              }
            }
          },
          {
            "name": "player2Move",
            "type": {
              "option": {
                "defined": {
                  "name": "move"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "gameCleaned",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "gameCompleted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "winner",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "finalScoreP1",
            "type": "u8"
          },
          {
            "name": "finalScoreP2",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "player1",
            "type": "pubkey"
          },
          {
            "name": "joinCode",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "betAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "gameStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "waiting"
          },
          {
            "name": "inProgress",
            "fields": [
              {
                "name": "roundState",
                "type": {
                  "defined": {
                    "name": "roundState"
                  }
                }
              }
            ]
          },
          {
            "name": "completed"
          },
          {
            "name": "winningsClaimed"
          }
        ]
      }
    },
    {
      "name": "move",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "rock"
          },
          {
            "name": "paper"
          },
          {
            "name": "scissors"
          }
        ]
      }
    },
    {
      "name": "playerJoined",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "player2",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "refundIssued",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "roundCompleted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "winner",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "scoreP1",
            "type": "u8"
          },
          {
            "name": "scoreP2",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "roundState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "awaitingCommits"
          },
          {
            "name": "awaitingReveals"
          }
        ]
      }
    },
    {
      "name": "winningsClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "winner",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
