import Document, {
  Html,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
  Head
} from 'next/document'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const cache = createCache()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <StyleProvider cache={cache}>
              <App {...props} />
            </StyleProvider>
          )
      })

    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: [
        <div key={1}>
          <style
            data-test="extract"
            dangerouslySetInnerHTML={{
              __html: extractStyle(cache)
            }}
          />
          {initialProps.styles}
        </div>
      ]
    }
  }

  render() {
    return (
      <Html lang="en" translate="no">
        <Head>
          <meta name="google" content="notranslate" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
