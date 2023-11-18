/*
  Warnings:

  - The values [OVERDUE] on the enum `Invoice_invoiceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `invoice` MODIFY `invoiceStatus` ENUM('Paid', 'Unpaid', 'Draft', 'Sent', 'Downloaded', 'Overdue') NOT NULL;
