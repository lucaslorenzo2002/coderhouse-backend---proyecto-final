const fs = require('fs')

const writeFile = async(data, file) => {
    try{
        await fs.promises.writeFile(file, JSON.stringify(data, null, 2));
        console.log('producto agregado');
    }catch(err){
        throw new Error('hubo un error: ' + err)
    }
}

const getAll = async(file) => {
    try{
        let productos =  await fs.promises.readFile(file, 'utf-8');
        return JSON.parse(productos); 
        } catch(err){
            if(err.message.includes('no such file or directory')) return [];
            console.log('error: ' + err);
    }
}

module.exports = {writeFile, getAll}