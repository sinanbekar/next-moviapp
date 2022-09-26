import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MainDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body className="bg-[#030303] text-white">
          <Main />
          <NextScript />
          <div id="modal-root"></div>
        </body>
      </Html>
    );
  }
}

export default MainDocument;
