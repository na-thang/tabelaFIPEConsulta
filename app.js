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

function isValidCode(marcas, codigoMarca) {
    return marcas.some(marca => marca.codigo === codigoMarca);
}

async function main() {
    console.log('Bem vindo à consulta de marcas de veículos!');
    while (true) {
        const tipoVeiculo = await getUserInput('Digite o tipo de veículo! (motos/carros/caminhoes): ');
        const apiUrl = `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas`;

        try {
            const response = await axios.get(apiUrl);
            const marcas = response.data;

            console.log('Marcas de veículos disponíveis: ');
            marcas.forEach(marca => {
                console.log(`Código: ${marca.codigo}, Nome: ${marca.nome}`);
            });

            let codigoMarca;
            while (true) {
                codigoMarca = await getUserInput('Digite o código da marca (ou "voltar" para retornar): ');

                if (codigoMarca.toLowerCase() === 'voltar'){
                    console.log('Retornando ao início...');
                    break;
                } else if (isValidCode(marcas, codigoMarca)){
                    await getModelsByBrand(tipoVeiculo, codigoMarca);
                    break;
                } else {
                    console.log('Codigo inválido, favor conferir e digitar novamente!')
                }
            }
            if (codigoMarca.toLowerCase() === 'voltar'){
                continue;
            }

        } catch (error) {
            console.error('Ocorreu um erro!')
        }
    }
    rl.close();
}
async function getModelsByBrand(tipoVeiculo, codigoMarca){
    const apiUrl = `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos`;

    try {
        const response = await axios.get(apiUrl);
        const modelos = response.data.modelos;

        console.log('Modelos da marca selecionada: ');
        modelos.forEach(modelo => {
            console.log(`Nome: ${modelo.nome}, Código: ${modelo.codigo}`);
        });

        const codigoModelo = await getUserInput('Digite o código do modelo:')
        await getModelsAndYears(tipoVeiculo, codigoMarca, codigoModelo);

    } catch (error) {
        console.error('Ocorreu um erro!');
    } 
}

async function getModelsAndYears(tipoVeiculo, codigoMarca, codigoModelo){
    const apiUrlAnos = `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`
    
    try {
        const responseAnos = await axios.get(apiUrlAnos);
        const anos = responseAnos.data;

        console.log('Anos disponíveis para o modelo selecionado: ')
        anos.forEach(anos => {
            console.log(`Código: ${anos.codigo}, Nome: ${anos.nome}`)
        })

        const codigoAno = await getUserInput('Digite o código do ano: ');
        await getResult(tipoVeiculo, codigoMarca, codigoModelo, codigoAno);

    } catch (error) {
        console.error('Ocorreu um erro ao obter os modelos ou anos')
    }
}

async function getResult(tipoVeiculo, codigoMarca, codigoModelo, codigoAno){
    const apiUrlResultado = `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`;

    try{
        const responseResultado = await axios.get(apiUrlResultado);
        const resultado = responseResultado.data;

        console.log('Resultado para o veículo selecionado: ')
        console.log(resultado);
    } catch (error) {
        console.error('Ocorreu um erro ao obter o resultado!');
    }
}
main();