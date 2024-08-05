const { resetPasswordCodeModel } = require("../../models/resetPasswordCode.model.js");

class ResetPasswordCodeHandler {
    constructor() {}

    async getCode(code) {
        try {
            const resetCode = await resetPasswordCodeModel.findOne({ code }).lean();
            return resetCode;
        } catch (error) {
            console.error('Error obteniendo el código:', error.message);
            throw error;
        }
    }

    async getAllCodes() {
        try {
            const codes = await resetPasswordCodeModel.find();
            return codes;
        } catch (error) {
            console.error('Error obteniendo los códigos:', error.message);
            throw error;
        }
    }

    async saveCode(email, code) {
        try {
            // Asegúrate de que el código es una cadena
            if (typeof code !== 'string') {
                code = await code; // Resolver la promesa si es una
            }

            const newCode = await resetPasswordCodeModel.create({ email, code });
            return newCode;
        } catch (error) {
            console.error('Error guardando el código:', error.message);
            throw error;
        }
    }

    async deleteCode(email, code) {
        try {
            const deletedCode = await resetPasswordCodeModel.deleteOne({ email, code });
            return deletedCode;
        } catch (error) {
            console.error('Error eliminando el código:', error.message);
            throw error;
        }
    }
}

module.exports = ResetPasswordCodeHandler;
