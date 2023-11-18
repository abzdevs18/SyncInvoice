// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = parseCookies().token
      if (storedToken) {
        setLoading(true)

        try {
          const response = await axios.get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          setLoading(false)
          setUser({ ...response.data.userData })

          if (router.pathname.includes('login')) {
            router.replace('/dashboards')
          }
        } catch (error) {
          destroyCookie(null, 'token')
          setUser(null)
          setLoading(false)

          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const token = response.data.accessToken
        const expiresIn = response.data.expiresIn
        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/dashboards' ? returnUrl : '/dashboards'
        const value = parseInt(expiresIn)
        const millis = value * 24 * 60 * 60 * 1000

        setCookie(null, 'token', token, {
          path: '/',
          secure: true,
          expires: new Date(new Date().getTime() + millis) // Set the cookie expiration time (7 days in this example), implemented dynamically to sync with the DB
        })

        setUser({ ...response.data.userData })

        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('settings')
    destroyCookie(null, 'token', {
      path: '/',
      secure: true
    })
    setUser(null)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
