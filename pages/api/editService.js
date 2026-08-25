export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        res.status(405).json({ message: 'método não permitido, apenas PUT' })
        return
    }

    const [data] = req.body
    // consulta de UPDATE
    
    try {
        console.log(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'erro na requisição'
        })
    }
}