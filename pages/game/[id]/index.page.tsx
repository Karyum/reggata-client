import { Card, Flex, message, Input, Button } from 'antd'
import styles from '../../index.module.scss'
import Head from 'next/head'
import { initialBoard } from '@/lib/constants'
import Image from 'next/image'
import { useState } from 'react'
import CoinsToss from '@/components/CoinsToss'
import { useMatch } from 'api-hooks/general.hooks'

export const getServerSideProps = async ({ params }: { params: { id: string } }) => {
  return {
    props: { id: params.id }
  }
}
const Game = ({ id }: { id: string }) => {
  const { data } = useMatch(id)

  // const {} = useFlip()
  // const {} = useMove()

  const [opponent, setOpponent] = useState({
    tokensInHome: 4,
    tokensReachedFinish: 0,
    tokensInPlay: 0,
    color: '#e54b4b'
  })

  const [clientPlayer, setClientPlayer] = useState({
    tokensInHome: 4,
    tokensReachedFinish: 0,
    tokensInPlay: 0,
    color: '#1b98e0'
  })

  console.log(data.match)

  return (
    <>
      <Head>
        <title>Reggato</title>
      </Head>
      <Flex className={`${styles.page} `} justify="center" align="center">
        {data?.match && !data?.match?.guestId ? (
          <Flex gap={10} align="center" className={styles.matchId}>
            {/* add a copy to copy data.match.id */}
            <p>{data.match.id}</p>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(data.match.id)
                message.success('Copied to clipboard')
              }}
              size="small"
            >
              Copy
            </Button>
          </Flex>
        ) : (
          ''
        )}

        <Flex vertical gap={40} align="center">
          <Flex className={styles.player1} vertical gap={20}>
            <Card>
              <Flex gap={20} align="center">
                <h2>Opponent</h2>
                <p>Tokens in home: {opponent.tokensInHome}</p>
                <p>Tokens reached finish: {opponent.tokensReachedFinish}</p>
                <p>Tokens in play: {opponent.tokensInPlay}</p>
              </Flex>
            </Card>

            <CoinsToss color={opponent.color} onTossEnd={(result) => {}} disabled />
          </Flex>

          <Flex vertical>
            {initialBoard.map((row, rowIndex) => (
              <Flex gap={0} key={rowIndex} className={styles.row}>
                {row.map((tile, tileIndex) => (
                  <Card
                    style={{
                      visibility: tile ? 'visible' : 'hidden'
                    }}
                    className={styles.tile}
                    key={tileIndex}
                  >
                    {tile?.tileType === 'shield' ? (
                      <Image
                        src="/shield.svg"
                        alt="shield"
                        fill
                        style={{
                          opacity: 0.5
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </Card>
                ))}
              </Flex>
            ))}
          </Flex>

          <Flex className={styles.clientPlayer} vertical gap={20}>
            <CoinsToss
              color={clientPlayer.color}
              onTossEnd={(result) => {}}
              disabled={data?.match?.guestId ? false : true}
            />

            <Card>
              <Flex gap={20} align="center">
                <h2>Client player</h2>
                <p>Tokens in home: {clientPlayer.tokensInHome}</p>
                <p>Tokens reached finish: {clientPlayer.tokensReachedFinish}</p>
                <p>Tokens in play: {clientPlayer.tokensInPlay}</p>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default Game
