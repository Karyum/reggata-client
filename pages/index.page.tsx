import Head from 'next/head'
import styles from './index.module.scss'
import { useConnect, useCreateMatch, useJoinMatch } from 'api-hooks/general.hooks'
import { Button, Card, Flex, message, Select, Input } from 'antd'
import { useEffect, useState } from 'react'
import socket from '@/lib/socket'
import secureLocalStorage from 'react-secure-storage'

import { colors } from '@/lib/constants'
import { useRouter } from 'next/router'

function Home() {
  const { data } = useConnect()
  const { mutate: createMatch, isLoading } = useCreateMatch()
  const { mutate: joinMatch } = useJoinMatch()
  const [pageState, setPageState] = useState('')
  const [color, setColor] = useState('')
  const [joinMatchId, setJoinMatchId] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (data?.status === 'success') {
      socket.io.opts.query = {
        token: String(secureLocalStorage.getItem('token')) || ''
      }

      socket.open()
    }
  }, [data])

  return (
    <>
      <Head>
        <title>Reggata</title>
      </Head>
      <Flex className={`${styles.page}`} justify="center" align="center">
        <Card style={{ marginBottom: 100 }}>
          <Flex vertical gap={30} style={{ width: '100%' }}>
            <Flex vertical gap={0} style={{ width: '100%' }}>
              <h2>Welcome to Reggata!</h2>
              <p
                style={{
                  marginTop: -10
                }}
              >
                Copy of Soulframe's Reggata
              </p>
            </Flex>

            {!pageState ? (
              <Flex gap={20} style={{ width: '100%' }}>
                <Button
                  type="primary"
                  onClick={() => {
                    setPageState('create')
                  }}
                >
                  Create match
                </Button>

                <Button
                  onClick={() => {
                    secureLocalStorage.removeItem('minor-match-data')
                    setPageState('join')
                  }}
                >
                  Join match
                </Button>
              </Flex>
            ) : (
              ''
            )}

            {pageState === 'create' ? (
              <Flex gap={20}>
                <Select
                  style={{
                    width: 150
                  }}
                  placeholder="Select color"
                  value={color || undefined}
                  onChange={(value) => {
                    setColor(value)
                  }}
                >
                  {colors.map((color) => (
                    <Select.Option key={color.hex} value={color.hex}>
                      <Flex gap={10}>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            background: color.hex,
                            borderRadius: 5
                          }}
                        />
                        <span>{color.name}</span>
                      </Flex>
                    </Select.Option>
                  ))}
                </Select>

                <Button
                  type="primary"
                  loading={isLoading}
                  onClick={() => {
                    if (!color) {
                      message.error('Please select a color')
                      return
                    }
                    secureLocalStorage.removeItem('minor-match-data')

                    createMatch(
                      {
                        color: color
                      },
                      {
                        onSuccess: ({ data }: any) => {
                          router.push(`/game/${data.matchId}`)
                        },
                        onError: (error) => {
                          message.error('An error occurred')
                        }
                      }
                    )
                  }}
                >
                  Create
                </Button>
              </Flex>
            ) : (
              ''
            )}

            {pageState === 'join' ? (
              <Flex gap={20}>
                <Input
                  placeholder="Match ID"
                  style={{
                    width: 150
                  }}
                  value={joinMatchId}
                  onChange={(e) => {
                    setJoinMatchId(e.target.value)
                  }}
                />

                <Button
                  type="primary"
                  onClick={() => {
                    if (!joinMatchId) {
                      message.error('Please enter a match ID')
                      return
                    }

                    joinMatch(
                      {
                        id: joinMatchId
                      },
                      {
                        onSuccess: ({ data }: any) => {
                          router.push(`/game/${data.matchId}`)
                        },
                        onError: (error) => {
                          message.error('An error occurred')
                        }
                      }
                    )
                  }}
                >
                  Join
                </Button>
              </Flex>
            ) : (
              ''
            )}
          </Flex>
        </Card>
      </Flex>
    </>
  )
}

export default Home
