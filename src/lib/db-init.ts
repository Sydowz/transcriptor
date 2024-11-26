import { prisma } from './prisma'

export async function initDatabase() {
  try {
    // Tenta criar a tabela Video se não existir
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Video" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "path" TEXT NOT NULL,
        "transcription" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
      );
    `

    // Tenta criar a tabela Prompt se não existir
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Prompt" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "template" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
      );
    `

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Error initializing database tables:', error)
  }
}
