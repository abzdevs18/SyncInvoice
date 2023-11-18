import { PrismaClient, InvoiceStatus } from '@prisma/client'

const prisma = new PrismaClient()

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateId(): number {
  const randomNumbers = Array.from({ length: 4 }, () => getRandomInt(0, 9))
  const idString = randomNumbers.join('') + '2023'

  return parseInt(idString, 10)
}

async function main() {
  const invoices = []

  for (let i = 1; i <= 100; i++) {
    const invoice = {
      id: generateId(),
      name: `Customer ${i}`,
      total: getRandomInt(50, 500),
      avatar: `https://example.com/avatar${i}.jpg`,
      service: `Service ${i}`,
      dueDate: getRandomDate(new Date(), new Date('2023-12-31')),
      address: `Address ${i}`,
      company: `Company ${i}`,
      country: `Country ${i}`,
      contact: `contact${i}@example.com`,
      avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      issuedDate: getRandomDate(new Date('2023-01-01'), new Date()),
      companyEmail: `info@company${i}.com`,
      balance: getRandomInt(0, 1000),
      invoiceStatus: getRandomInvoiceStatus()
    }

    invoices.push(invoice)
  }

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: invoice
    })
  }
}

function getRandomInvoiceStatus(): InvoiceStatus {
  const statuses: InvoiceStatus[] = ['Sent', 'Paid', 'Unpaid', 'Overdue', 'Draft', 'Downloaded']
  const randomIndex = getRandomInt(0, statuses.length - 1)

  return statuses[randomIndex]
}

main()
  .catch(error => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
