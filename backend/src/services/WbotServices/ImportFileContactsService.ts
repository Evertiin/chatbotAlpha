import { head, has } from "lodash";
import XLSX from "xlsx";
import Contact from "../../models/Contact";
import AppError from "../../errors/AppError";

export async function ImportFileContactsService(
  tenantId: number,
  file: Express.Multer.File | undefined,
  tags: string[],
  wallets: string[]
) {
  try {
    const workbook = XLSX.readFile(file?.path as string);
    const worksheet = head(Object.values(workbook.Sheets)) as any;
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
    const contacts: any = [];

    rows.forEach(row => {
      let name = "";
      let number = "";
      let email = "";

      if (has(row, "nome") || has(row, "Nome")) {
        name = row.nome || row.Nome;
      }

      if (
        has(row, "numero") ||
        has(row, "número") ||
        has(row, "Numero") ||
        has(row, "Número")
      ) {
        number = row.numero || row["número"] || row.Numero || row["Número"];
        number = `${number}`.replace(/\D/g, "");
      }

      if (
        has(row, "email") ||
        has(row, "e-mail") ||
        has(row, "Email") ||
        has(row, "E-mail")
      ) {
        email = row.email || row["e-mail"] || row.Email || row["E-mail"];
      }

      name = name || number;

      if (name && number && number.length >= 10) {
        contacts.push({ name, number, email, tenantId });
      }
    });

    const contactList: Contact[] = [];

    for (const contact of contacts) {
      contact.number = contact.number.replace("-", "").replace(" ", "").replace("(", "").replace(")", "");

      try {
        const newContact = await Contact.create(contact);
        contactList.push(newContact);

        const setContact: any = newContact;

        if (tags?.length) {
          await setContact.setTags(tags, { through: { tenantId } });
        }

        if (wallets?.length) {
          await setContact.setWallets(wallets, { through: { tenantId } });
        }
      } catch (error) {
        console.log("Erro ao criar contato:", error);
        // Lida com o erro conforme necessário, como lançar uma exceção personalizada
        throw new AppError("Erro ao criar contato", 500); // ou outro tratamento de erro adequado
      }
    }

    return contactList;
  } catch (error) {
    console.log("Erro ao importar contatos:", error);
    throw new AppError("Erro ao importar contatos", 500); // ou outro tratamento de erro adequado
  }
}
