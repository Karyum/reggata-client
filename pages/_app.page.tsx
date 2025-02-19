import { useState } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'

import type { AppProps } from 'next/app'
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import 'antd/dist/reset.css'
// import 'antd/dist/antd.css'
import 'styles/global.scss'
import { RecoilRoot } from 'recoil'
import AppLayout from '@/components/core/AppLayout'
import Head from 'next/head'

function App({ Component, pageProps }: AppProps<{ dehydratedState: DehydratedState }>) {
  const [queryClient] = useState(() => new QueryClient())
  console.log(1)
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps?.dehydratedState}>
          <AppLayout>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
              />
            </Head>
            <Component {...pageProps} />
          </AppLayout>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default App
