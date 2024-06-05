import { Request, Response } from "express";
import admin from "firebase-admin";
const path = require('path');

// Caminho para o arquivo JSON de configuração do Firebase Admin SDK
const serviceAccountPath = path.resolve(__dirname, '../config/omni-athostec-firebase-adminsdk-inxc6-cc670224e1.json');

// Inicializar o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  // Adicione outras configurações do Firebase aqui, se necessário
});

// Controlador para enviar notificações
export const sendNotification = async (req: Request, res: Response) => {
  try {
    // Extrair dados necessários do corpo da solicitação
    const { registrationToken, title, body } = req.body;
    console.log('registrationToken: ', registrationToken)

    // Validar se os dados necessários estão presentes
    if (!registrationToken || !title || !body) {
      console.log('Tentado enviar notificação, porém código FCM não inserido')
      return res.status(400).json({ error: "Missing required data." });
    }

    // Construir a mensagem a ser enviada
    const message = {
      notification: {
        title,
        body,
      },
      token: registrationToken,
    };

    // Enviar a mensagem usando o Firebase Admin SDK
    const response = await admin.messaging().send(message);

    // Responder com sucesso
    res.status(200).json({ success: true, messageId: response });

  } catch (error) {
    // Lidar com erros
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
