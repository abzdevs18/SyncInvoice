/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const dotenv = require('dotenv')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features sas
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

module.exports = withTM({
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false
  },
  env: {
    BASE_URL: process.env.BASE_URL
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
})
