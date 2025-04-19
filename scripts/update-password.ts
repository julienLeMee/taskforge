import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    const email = 'julemee@gmail.com';
    const password = 'MotDePasse123!';

    const hashedPassword = await bcryptjs.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log('Mot de passe mis à jour avec succès pour:', updatedUser.email);
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
