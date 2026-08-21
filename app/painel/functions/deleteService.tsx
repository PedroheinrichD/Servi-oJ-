import { api } from "@/utils/api";

type deleteProps = {
    id: number
}

export async function deleteService({ id }: deleteProps){
    try {
        await api.delete('/api/deleteService', {
            data: { id }
        })
    } catch (error) {
        console.log(error);
    }
}