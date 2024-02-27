import { resolve } from "path";
import { prisma } from "./prisma";

const LIMIT = 5

export const getContacts = async (query: string, currentPage: number) => {
  console.log('query = ' + query)
  const offset = (currentPage - 1) * LIMIT
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const contacts = await prisma.contact.findMany({
      skip: offset,
      take: LIMIT,
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            phone: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      }
    })
    return contacts
  } catch (error) {
    throw new Error("Failed to fetch contact data")
  }
}

export const getContactById = async (id: string) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    return contact;
  } catch (error) {
    throw new Error("Failed to fetch contact data");
  }
};

export const getContactsPages = async (query: string) => {
  try {
    const contacts = await prisma.contact.count({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            phone: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      }
    })
    const totalPages = Math.ceil(Number(contacts) / LIMIT)
    return totalPages
  } catch (error) {
    throw new Error("Failed to fetch contact data")
  }
}