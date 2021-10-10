import '../styles/globals.css'
import '../components/loader/Loader.css'
import Layout from "../components/layout";
import {Provider} from "react-redux";
import {store} from "../store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
