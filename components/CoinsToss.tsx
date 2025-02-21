import { Flex, message } from 'antd'
import { useState, useEffect } from 'react'

import dynamic from 'next/dynamic'
import { useFlip } from 'api-hooks/general.hooks'

const FramerMotionComponent = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false
})

interface CoinsTossProps {
  color: string
  onTossEnd: (result: string[]) => void
  disabled?: boolean
  opponent?: boolean
  defaultCoins?: string[]
  matchId?: string
}

const CoinsToss = ({
  color,
  onTossEnd,
  disabled,
  opponent,
  defaultCoins,
  matchId
}: CoinsTossProps) => {
  // I want to toss 4 coins and get the result
  // 0 would be grey and 1 would be colored
  const [coins, setCoins] = useState(['color', 'color', 'color', 'color'])
  const [start, setStart] = useState(false)
  const [tossing, setTossing] = useState(false)

  const { mutate: apiFlip } = useFlip()
  const isClient = typeof window !== 'undefined'

  useEffect(() => {
    if (defaultCoins) {
      setCoins(defaultCoins)
    }
  }, [defaultCoins])

  const toss = () => {
    const newCoins = coins.map(() => (Math.random() > 0.5 ? 'color' : 'grey'))
    apiFlip(
      { coins: newCoins, matchId },
      {
        onSuccess: (data) => {
          setCoins(newCoins)

          onTossEnd(newCoins)
        },
        onError: (error) => {
          message.error('something went wrong')
        }
      }
    )
  }

  if (!isClient) {
    return null // Skip rendering on the server
  }

  return (
    <Flex
      onClick={
        disabled
          ? () => {
              setStart(!start)
              setTossing(true)
            }
          : () => {
              setStart(!start)
              setTossing(true)
              toss()
            }
      }
      id={opponent ? 'opponent' : 'client'}
      style={{
        cursor: disabled ? 'initial' : 'pointer',
        pointerEvents: disabled ? 'none' : 'initial',
        backgroundColor: 'transparent',
        zIndex: 2
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
            setTossing(false)
          }}
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
