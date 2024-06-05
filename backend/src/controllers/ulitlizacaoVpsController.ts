import { Request, Response } from "express";
import os from "os";
import diskusage from "diskusage";
import osUtils from "os-utils";

export const CheckServiceMessenger = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Coletar informações do servidor
    const serverInfo = {
      Hostname: os.hostname(),
      "Endereço IP": getIpAddress(),
      "Sistema Operacional": os.type(),
      "Modelo do Servidor": os.cpus()[0].model,
      "Quantidade de CPUs": os.cpus().length,
      "Total Memory": `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      "Free Memory": `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
      "Memory Usage Percentage": `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`,
      Uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
    };

    // Obter informações de uso da CPU
    osUtils.cpuUsage(function (v) {
      serverInfo["CPU Usage Percentage"] = `${(v * 100).toFixed(2)}%`;

      const diskInfo = diskusage.checkSync("/");
      const diskTotalGB = diskInfo.total / (1024 * 1024 * 1024);
      const diskFreeGB = diskInfo.free / (1024 * 1024 * 1024);
      serverInfo["Hora do Servidor"] = new Date().toLocaleString();
      serverInfo["Total Disk Space"] = `${diskTotalGB.toFixed(2)} GB`;
      serverInfo["Free Disk Space"] = `${diskFreeGB.toFixed(2)} GB`;
      serverInfo["Used Disk Space"] = `${(diskTotalGB - diskFreeGB).toFixed(2)} GB`;
      serverInfo["Disk Usage Percentage"] = `${(((diskTotalGB - diskFreeGB) / diskTotalGB) * 100).toFixed(2)}%`;

      // Retornar informações do servidor junto com o desafio
      return res.status(200).json({ serverInfo });
    });
  } catch (error) {
    console.error("Erro ao obter informações do servidor:", error);
    return res.status(500).json({ error: "Erro ao obter informações do servidor" });
  }
};

function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = "";

  // Iterar pelas interfaces de rede e encontrar o endereço IP da interface principal (geralmente, a primeira que não seja loopback)
  for (const interfaceName of Object.keys(networkInterfaces)) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (!iface.internal && iface.family === "IPv4") {
        ipAddress = iface.address;
        break;
      }
    }
    if (ipAddress) {
      break;
    }
  }

  return ipAddress;
}
