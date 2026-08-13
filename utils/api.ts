import axios from "axios"

export const api = axios.create({
    baseURL: "/", // a barra já quer dizer que está acessando atraves do localHost
})

/*
    aqui estamos criando uma instância do axios com uma baseURL padrão,
    que é a URL base para todas as requisições feitas usando essa instância.
    Isso é útil para evitar repetir a URL base em cada requisição, 
    tornando o código mais limpo e fácil de manter. 
    Além disso, podemos configurar outras opções padrão, 
    como headers, timeout, etc., ao criar a instância.
    para usar essa instância, podemos importar o objeto api 
    e chamar os métodos get, post, put, delete, etc., 
    passando apenas o endpoint relativo à baseURL. 
    
    Por exemplo, para fazer uma requisição GET 
    para "https://jsonplaceholder.typicode.com/posts", 
    podemos fazer api.get("/posts") em outro componente
*/

