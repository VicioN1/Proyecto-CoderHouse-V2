const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../data/resetCodes.json');

class ResetPasswordCodeHandler {
    async _readFile() {
        try {
            await fs.promises.access(filePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this._writeFile([]);
            } else {
                throw error;
            }
        }

        try {
            const data = await fs.promises.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer archivo", error);
            return [];
        }
    }

    async _writeFile(data) {
        try {
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Error al escribir archivo", error);
        }
    }

    async getNextId() {
        const resetCodes = await this.getAllCodes();
        if (resetCodes.length === 0) {
            return 1;
        }
        const maxId = Math.max(...resetCodes.map(code => code._id));
        return maxId + 1;
    }

    async getCode(code) {
        try {
            const resetCodes = await this._readFile();
            const resetCode = resetCodes.find(resetCode => resetCode.code === code);
            if (resetCode) {
                const now = new Date();
                const createdAt = new Date(resetCode.createdAt);
                const expiresAt = new Date(resetCode.expiresAt);
                if (now >= createdAt && now <= expiresAt) {
                    return resetCode;
                }
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo códigos de reinicio:', error.message);
            throw error;
        }
    }

    async getAllCodes() {
        try {
            return await this._readFile();
        } catch (error) {
            console.error('Error obteniendo códigos de reinicio:', error.message);
            throw error;
        }
    }

    async saveCode(email, code) {
        const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailPattern.test(email)) {
            throw new Error('Introduce un correo electrónico válido.');
        }

        const resetCodes = await this.getAllCodes();
        const EXPIRATION = 60 * 60;
        const newCode = {
            _id: await this.getNextId(),
            email,
            code,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + EXPIRATION * 1000)
        };
        resetCodes.push(newCode);
        await this._writeFile(resetCodes);
        return newCode;
    }

    async deleteCode(email, code) {
        let resetCodes = await this._readFile();
        resetCodes = resetCodes.filter(resetCode => !(resetCode.email === email && resetCode.code === code));
        await this._writeFile(resetCodes);
    }
}

module.exports = ResetPasswordCodeHandler;
