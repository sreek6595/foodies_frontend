import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider} from 'react-redux'
import { store } from './redux/Store.js'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <Provider store ={store}>
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false}/>
    <App />
    </QueryClientProvider>
  </StrictMode>,
  </Provider>
)


