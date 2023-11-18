import { useState, useEffect } from 'react'
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'
import AccountSettings from 'src/views/account-settings/AccountSettings'

import { CircularProgress, Typography, Box } from '@mui/material'

const AccountSettingsTab = ({ tab, apiPricingPlanData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true) // Initialize loading to true

  useEffect(() => {
    if (user && user.id) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${process.env.BASE_URL}/api/user/${user.id}/data`, {
            method: 'GET',
            headers: {
              Origin: `${process.env.BASE_ORIGIN}`
            }
          })
          const u = await response.json()
          setUserData(u.data)
        } catch (error) {
          console.error('Failed to fetch user data', error)
        } finally {
          setLoading(false) // Set loading to false regardless of success or error
        }
      }

      fetchUserData()
    } else {
      setLoading(false) // If no user id, we're not loading anything
    }
  }, [user])

  // If loading, display the loader component
  if (loading) {
    return (
      <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} userData={userData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } },
      { params: { tab: 'notifications' } },
      { params: { tab: 'connections' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  // Note: We're not fetching user-specific data here anymore
  return {
    props: {
      tab: params?.tab,
      apiPricingPlanData: [] // If you need to fetch this data, adjust here
    }
  }
}

AccountSettingsTab.acl = {
  action: 'manage',
  subject: 'common-page'
}

export default AccountSettingsTab
