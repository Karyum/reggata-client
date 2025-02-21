import { Card, Flex, message, Input, Button } from 'antd'
import styles from '../../index.module.scss'
import Head from 'next/head'
import { initialBoard } from '@/lib/constants'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CoinsToss from '@/components/CoinsToss'
import { useBoard, useEndTurn, useMatch, useMove, useReset } from 'api-hooks/general.hooks'
import socket from '@/lib/socket'
import secureLocalStorage from 'react-secure-storage'
import checkMove from './checkMove'
import checkPossibleMoves from './checkPossibleMoves'
import Winner from '../../../components/WinnerModal'
import { useRouter } from 'next/router'

export const getServerSideProps = async ({ params }: { params: { id: string } }) => {
  return {
    props: { id: params.id }
  }
}

const Game = ({ id }: { id: string }) => {
  const { data, refetch } = useMatch(id)
  const { data: boardData, refetch: refetchBoard } = useBoard(id)
  const { mutate: move } = useMove()
  const { mutate: endTurn } = useEndTurn()

  const { mutate: reset } = useReset()
  const router = useRouter()

  const [matchData, setMatchData] = useState({
    opponent: {
      tokensInHome: 4,
      color: '',
      coins: ['color', 'color', 'color', 'color'],
      tokensReachedFinish: 0
    },
    clientPlayer: {
      tokensInHome: 4,
      color: '',
      tokensReachedFinish: 0
    },
    myTurn: false,
    rolled: false,
    canMoveAmount: 0
  })

  const [open, setOpen] = useState(false)
  const [winner, setWinner] = useState('')

  useEffect(() => {
    const storageState = secureLocalStorage.getItem('minor-match-data') as any

    const guest = {
      tokensInHome: data?.match?.guestTokensHome,
      tokensReachedFinish: data?.match?.guestTokensReached
    }

    const host = {
      tokensInHome: data?.match?.hostTokensHome,
      tokensReachedFinish: data?.match?.hostTokensReached
    }

    setMatchData((prev) => ({
      opponent: {
        ...matchData.opponent,
        ...((data?.match?.turn === 'host') === data?.myTurn ? guest : host),
        color:
          prev.opponent.color ||
          ((data?.match?.turn === 'host') === data?.myTurn
            ? data?.match?.guestColor
            : data?.match?.hostColor),

        coins: data?.match?.guestCoins
      },
      clientPlayer: {
        ...matchData.clientPlayer,
        ...((data?.match?.turn === 'host') === data?.myTurn ? host : guest),
        color:
          prev.clientPlayer.color ||
          ((data?.match?.turn === 'host') === data?.myTurn
            ? data?.match?.hostColor
            : data?.match?.guestColor)
      },
      myTurn: data?.myTurn,
      rolled: storageState ? prev.rolled : false,
      canMoveAmount: storageState ? prev.canMoveAmount : 0
    }))
  }, [data])

  useEffect(() => {
    const storageState = secureLocalStorage.getItem('minor-match-data') as any

    if (typeof storageState == 'object') {
      setMatchData({
        ...matchData,
        rolled: storageState?.rolled,
        canMoveAmount: storageState?.canMoveAmount
      })
    }

    socket.io.opts.query = {
      token: String(secureLocalStorage.getItem('token')) || ''
    }

    socket.open()

    socket.on('client:match-joined', () => {
      message.success('Match joined')
      refetch()
    })

    socket.on('client:flip', ({ coins }) => {
      setMatchData((prev) => ({
        ...prev,
        opponent: {
          ...prev.opponent,
          coins
        }
      }))

      document.getElementById('opponent')?.click()
    })

    socket.on('client:turn-changed', (data) => {
      message.success('Turn changed')
      setMatchData((prev) => ({
        ...prev,
        rolled: false
      }))
      refetch()
      refetchBoard()

      const storageState = secureLocalStorage.getItem('minor-match-data')

      secureLocalStorage.setItem('minor-match-data', {
        ...(typeof storageState === 'object' ? storageState : {}),
        rolled: false
      })
    })

    socket.on('client:reroll', () => {
      setMatchData((prev) => ({
        ...prev,
        rolled: false
      }))
      refetchBoard()

      const storageState = secureLocalStorage.getItem('minor-match-data')

      secureLocalStorage.setItem('minor-match-data', {
        ...(typeof storageState === 'object' ? storageState : {}),
        rolled: false
      })
    })

    socket.on('client:winner', (winner) => {
      setWinner(winner)
      setOpen(true)
    })

    socket.on('client:reset', () => {
      message.success('Match reset by opponent')
      secureLocalStorage.removeItem('minor-match-data')
      refetch()
      refetchBoard()
      setOpen(false)
      setWinner('')
    })

    return () => {
      socket.off('client:match-joined')
      socket.off('client:flip')
      socket.off('client:turn-changed')
      socket.off('client:reroll')
      socket.off('client:winner')
      socket.off('client:reset')
    }
  }, [])

  const match = data?.match
  const board = boardData?.board as typeof initialBoard

  return (
    <>
      <Head>
        <title>Reggata</title>
      </Head>
      <Flex className={`${styles.page} `} justify="center" align="center">
        <Button
          style={{ position: 'absolute', top: 10, right: 10 }}
          onClick={() => {
            reset(
              { matchId: match?.id },
              {
                onSuccess: () => {
                  message.success('Match reset')
                  refetch()
                  refetchBoard()
                  secureLocalStorage.removeItem('minor-match-data')
                }
              }
            )
          }}
        >
          Reset
        </Button>
        {match && !match?.guestId ? (
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
          <Flex className={styles.player1} vertical gap={20} style={{ width: '100%' }}>
            <Card>
              <Flex gap={20} align="center">
                <h2>Opponent</h2>
                <p>Tokens in home: {matchData.opponent.tokensInHome}</p>
                <p>Tokens reached finish: {matchData.opponent.tokensReachedFinish}</p>
              </Flex>
            </Card>

            <Flex justify="space-between" align="center">
              <Flex gap={10}>
                {new Array(matchData.opponent.tokensInHome || 0).fill(0).map((_, index) => (
                  <div
                    key={index}
                    className={styles.token}
                    style={{
                      backgroundColor: matchData.opponent.color
                    }}
                  />
                ))}
              </Flex>

              <CoinsToss
                color={matchData.opponent.color}
                onTossEnd={(result) => {}}
                disabled
                opponent
                defaultCoins={matchData.opponent.coins}
                matchId={match?.id}
              />
            </Flex>
          </Flex>

          <Flex vertical>
            {board?.map((row, rowIndex) => (
              <Flex gap={0} key={rowIndex} className={styles.row}>
                {row.map((tile, tileIndex) =>
                  tile?.tileType === 'finish' ? (
                    <Flex
                      className={`${styles.tile}`}
                      key={tileIndex}
                      justify="center"
                      align="center"
                    >
                      <div className={styles.finishTile}>
                        {new Array(
                          (rowIndex === 0
                            ? matchData.opponent.tokensReachedFinish
                            : matchData.clientPlayer.tokensReachedFinish) || 0
                        )
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className={styles.part} />
                          ))}
                      </div>
                    </Flex>
                  ) : (
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

                      {tile?.token ? (
                        <div
                          className={styles.token}
                          style={{
                            backgroundColor: tile.token
                          }}
                          onClick={() => {
                            if (!matchData.myTurn) return
                            if (!matchData.rolled) return

                            const moveCheck = checkMove(
                              board,
                              `${rowIndex},${tileIndex}`,
                              matchData.canMoveAmount,
                              matchData.clientPlayer.color
                            )

                            if (!moveCheck.status) {
                              message.error(moveCheck.message)
                              return
                            }

                            move({
                              matchId: match?.id,
                              from: `${rowIndex},${tileIndex}`,
                              to: 'play',
                              steps: matchData.canMoveAmount
                            })
                            // send the api request
                            // remove from home
                            // add to the correct pile
                            // check if can re roll
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </Card>
                  )
                )}
              </Flex>
            ))}
          </Flex>

          <Flex className={styles.clientPlayer} vertical gap={20} style={{ width: '100%' }}>
            <Flex justify="space-between" align="center">
              <Flex gap={10} style={{ minWidth: 100 }}>
                {new Array(matchData.clientPlayer.tokensInHome || 0).fill(0).map((_, index) => (
                  <div
                    key={index}
                    className={styles.token}
                    style={{
                      backgroundColor: matchData.clientPlayer.color
                    }}
                    onClick={() => {
                      if (!matchData.myTurn) return
                      if (!matchData.rolled) return

                      const moveCheck = checkMove(
                        board,
                        'home',
                        matchData.canMoveAmount,
                        matchData.clientPlayer.color
                      )

                      if (!moveCheck.status) {
                        message.error(moveCheck.message)
                        return
                      }

                      move({
                        matchId: match?.id,
                        from: 'home',
                        to: 'play',
                        steps: matchData.canMoveAmount
                      })
                    }}
                  />
                ))}
                &nbsp;
              </Flex>

              <Flex className={styles.container} justify="center" align="center">
                <CoinsToss
                  color={matchData.clientPlayer.color}
                  onTossEnd={(result) => {
                    console.log(result)
                    const amount = result.filter((coin) => coin === 'color').length

                    // check if there are possible moves with the amount

                    if (amount === 0) {
                      // end turn request
                      setTimeout(() => {
                        endTurn({ matchId: match?.id })
                      }, 1000)
                    } else if (
                      !checkPossibleMoves(
                        amount,
                        matchData.clientPlayer.tokensInHome,
                        board,
                        matchData.clientPlayer.color
                      )
                    ) {
                      setTimeout(() => {
                        message.error('No possible moves')
                        endTurn({ matchId: match?.id })
                      }, 1000)
                    } else {
                      const storageState = secureLocalStorage.getItem('minor-match-data')

                      secureLocalStorage.setItem('minor-match-data', {
                        ...(typeof storageState === 'object' ? storageState : {}),
                        rolled: true,
                        canMoveAmount: amount
                      })

                      setMatchData({
                        ...matchData,
                        rolled: true,
                        canMoveAmount: amount
                      })
                    }
                  }}
                  disabled={
                    (match?.guestId ? false : true) || matchData.rolled || !matchData.myTurn
                  }
                  matchId={match?.id}
                />
                {matchData.myTurn && !matchData.rolled ? (
                  <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      rx="8"
                      ry="8"
                      className={styles.line}
                      height="100%"
                      width="100%"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : (
                  ''
                )}
              </Flex>
            </Flex>

            <Card>
              <Flex gap={20} align="center">
                <h2>Client player</h2>
                <p>Tokens in home: {matchData.clientPlayer.tokensInHome}</p>
                <p>Tokens reached finish: {matchData.clientPlayer.tokensReachedFinish}</p>
                <p>To move: {matchData.canMoveAmount}</p>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Flex>

      <Winner
        winner={winner}
        open={open}
        setOpen={setOpen}
        reset={() => {
          reset(
            { matchId: match?.id },
            {
              onSuccess: () => {
                message.success('Match reset')
                refetch()
                refetchBoard()
                secureLocalStorage.removeItem('minor-match-data')
                setOpen(false)
                setWinner('')
              }
            }
          )
        }}
      />
    </>
  )
}

export default Game
