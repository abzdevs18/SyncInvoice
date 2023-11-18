// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/api/navigation`)
        if (response.status === 200) {
          const menuArray = response.data.items
          setMenuItems(menuArray)
        }
      } catch (error) {
        console.error('Error fetching user roles:', error)
      }
    }

    fetchNavigation()
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
