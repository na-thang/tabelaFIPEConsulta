const axios = require('axios');
const readLine = require('readline');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
}) 

function getUserInput(prompt) {
    return new Promise((resolve) =>{
        rl.question(prompt, (answer) => {
            resolve(answer);
        })
    })
}

async function main() {
    console.log('Bem vindo à consulta de marcas de veículos!');
    const tipoVeiculo = await getUserInput('Digite o tipo de veículo! (motos/carros/caminhões): ');
    const apiUrl = `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas`;

    try {
        const response = await axios.get(apiUrl);
        const marcas = response.data;

        console.log('Marcas de veículos disponíveis: ');
        marcas.forEach(marca => {
            console.log(`Código: ${marca.codigo}, Nome: ${marca.nome}`);
        });
    } catch (error) {
        console.error('Ocorreu um erro.')
    } finally {
        rl.close();
    }
}

main();