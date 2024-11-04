import {Provider} from 'react-redux'
import {store} from "../store/Store";


export default function StoreProvider({children}) {
  return <Provider store={store}>{children}</Provider>
}