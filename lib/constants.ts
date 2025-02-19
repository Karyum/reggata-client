export const colors = [
  {
    name: 'Red',
    hex: '#e54b4b'
  },
  {
    name: 'Blue',
    hex: '#1b98e0'
  }
]

export const initialBoard = [
  [
    {
      tileType: 'shield',
      nextTile: 'up'
    },
    {
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    },
    { nextTile: 'left' },
    null,
    {
      tileType: 'finish'
    },
    { tileType: 'shield', nextTile: 'left' },
    { nextTile: 'left' }
  ],
  [
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    { tileType: 'shield', nextTile: 'right' },
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    { tileType: 'splitter' }
  ],
  [
    {
      tileType: 'shield',
      nextTile: 'down'
    },
    {
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    },
    null,
    {
      tileType: 'finish'
    },
    {
      tileType: 'shield',
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    }
  ]
]
