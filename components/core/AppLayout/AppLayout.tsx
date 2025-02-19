import { ConfigProvider, ThemeConfig, theme as antdTheme, Layout } from 'antd'
const { Content } = Layout

import { useEffect, useState } from 'react'
import socket from '@/lib/socket'
import Head from 'next/head'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [uiLoading, setUiLoading] = useState(true)

  const theme: ThemeConfig = {
    token: {
      fontFamily: 'NoirPro',
      colorPrimary: '#000'
    },
    components: {
      Typography: {
        colorPrimary: '#fff'
      },
      Message: {
        fontFamily: 'NoirPro'
      },
      Layout: {}
    }
  }

  // This ui loading is needed so that the font has time to load
  useEffect(() => {
    setTimeout(() => {
      setUiLoading(false)
    }, 100)
  }, [])

  if (uiLoading) {
    return <span>Loading...</span>
  }

  return (
    <ConfigProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
        <Layout
          className="site-layout"
          style={{
            minHeight: '90vh'
          }}
        >
          <Content>
            <div style={{ minHeight: 360 }}>{children}</div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default AppLayout
