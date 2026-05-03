import prisma from "@/lib/prisma";

export async function generateUniqueUsername(name: string): Promise<string> {
  const baseName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  let username = baseName.length > 0 ? baseName : "user"; 
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (!existingUser) {
      isUnique = true;
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      username = `${baseName}${randomSuffix}`;
    }
  }

  return username;
}