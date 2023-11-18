import { PrismaClient } from '@prisma/client'
import csv from 'csv-parser'
import fs from 'fs'

const prisma = new PrismaClient()

async function importDataFromCSV() {
  try {
    const results: any[] = []

    // Read the CSV file
    fs.createReadStream('data.csv')
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          // Insert data into User table and get the generated user ID
          const user = await prisma.user.create({
            data: {
              username: row.Student_ID // Assuming Student_ID is the username
              // Add other user-related fields
            }
          })

          // Insert data into aans__student table and reference the user ID
          await prisma.aans__student.create({
            data: {
              fk_uid: { connect: { id: user.id } }, // Reference the user ID
              grade_level: row.Grade_Level
              // Add other aans__student fields
            }
          })

          // Insert data into phone table and reference the aans__student ID
          await prisma.phone.create({
            data: {
              fk_id: { connect: { id: user.id } }, // Reference the aans__student ID
              phone: row.Contact
              // Add other phone fields
            }
          })
        }

        console.log('Data imported successfully')
      })
  } catch (error) {
    console.error('Error importing data:', error)
  } finally {
    await prisma.$disconnect() // Disconnect from the database
  }
}

importDataFromCSV()
