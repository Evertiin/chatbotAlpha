import ApiConfig from "../../models/ApiConfig";

interface Response {
  apis: (ApiConfig)[];
}

interface Request {
  tenantId: number | string;
}

const ListApiConfigService = async ({
  tenantId
}: Request): Promise<Response> => {
  // Buscar configurações de ApiConfig
  const apiConfigurations = await ApiConfig.findAll({
    where: { tenantId },
    order: [["name", "ASC"]]
  });

  // Combinar os resultados das duas consultas
  const apis = [...apiConfigurations];

  return { apis };
};

export default ListApiConfigService;
