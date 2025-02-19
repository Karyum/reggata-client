import { Flex, message } from 'antd'
import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'

const FramerMotionComponent = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false
})

interface CoinsTossProps {
  color: string
  onTossEnd: (result: string[]) => void
  disabled?: boolean
}

const CoinsToss = ({ color, onTossEnd, disabled }: CoinsTossProps) => {
  // I want to toss 4 coins and get the result
  // 0 would be grey and 1 would be colored
  const [coins, setCoins] = useState(['color', 'color', 'color', 'color'])
  const [start, setStart] = useState(false)
  const [tossing, setTossing] = useState(false)
  const isClient = typeof window !== 'undefined'

  const toss = () => {
    const newCoins = coins.map(() => (Math.random() > 0.5 ? 'color' : 'grey'))
    setCoins(newCoins)

    onTossEnd(newCoins)
    setTossing(false)
  }

  if (!isClient) {
    return null // Skip rendering on the server
  }

  return (
    <Flex
      onClick={
        disabled
          ? () => {}
          : () => {
              setStart(!start)
              setTossing(true)
            }
      }
      style={{
        cursor: disabled ? 'cursor' : 'pointer'
      }}
      justify="center"
      gap={10}
    >
      {coins.map((coin, index) => (
        <FramerMotionComponent
          key={index}
          initial={false}
          animate={start ? { rotateY: 360 } : { rotateY: 0 }}
          onAnimationComplete={(definition) => {
            toss()
          }}
          onEnded={toss}
          transition={{ duration: 1 }}
          style={{
            width: 50,
            height: 50,
            backgroundColor: tossing ? '#fca311' : coin === 'color' ? color : 'grey',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {coin === 'color' ? (
            <div
              style={{
                width: 25,
                height: 25,
                borderRadius: '50%',
                backgroundColor: '#fca311'
              }}
            />
          ) : (
            ''
          )}
        </FramerMotionComponent>
      ))}
    </Flex>
  )
}

export default CoinsToss
