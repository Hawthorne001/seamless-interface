export const ILMRegistryAbi = [
  {
    type: "function",
    name: "addILM",
    inputs: [
      {
        name: "ilmAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "countILM",
    inputs: [],
    outputs: [
      {
        name: "ilmCount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllILMs",
    inputs: [],
    outputs: [
      {
        name: "ilms",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getILM",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "ilm",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isILM",
    inputs: [
      {
        name: "ilmAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "isContained",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeILM",
    inputs: [
      {
        name: "ilmAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "ILMAdded",
    inputs: [
      {
        name: "ilm",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ILMRemoved",
    inputs: [
      {
        name: "ilm",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
] as const;
