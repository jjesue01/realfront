import '../styles/globals.css'
import '../components/loader/Loader.css'
import Layout from "../components/layout";
import {Provider} from "react-redux";
import {store} from "../store";
import {useRouter} from "next/router";
import AdminLayout from "../components/admin-layout";

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter()

  return (
    <Provider store={store}>
      {
        pathname.includes('admin') ?
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
          :
          <Layout>
            <Component {...pageProps} />
          </Layout>
      }
    </Provider>
  )
}

export default MyApp
