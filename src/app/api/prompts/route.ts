import { prisma } from "@/lib/prisma";
import { initDatabase } from "@/lib/db-init";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Tenta inicializar o banco de dados primeiro
    await initDatabase();
    
    const prompts = await prisma.prompt.findMany();
    return new NextResponse(JSON.stringify(prompts));
  } catch (error) {
    console.error('Error in GET /api/prompts:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
