import axios from "axios";

interface MessageIAInterface {
        contact_name: string;
        body: string;
        sender_number: string;
        receiver_number: string;
    }

export const sendMessageToIA = async (request: MessageIAInterface): Promise<any> => {
    try {
        const response = await axios.post(`${process.env.OPEN_IA_URL}`, { ...request });
        return handleSucces(response);
    } catch (error) {
        return handleError(error);
    }
}


const handleError = (error) => {
    console.log(error.response)
    // return error.response;
}

const handleSucces = (response) => {
    return response.data;
}
