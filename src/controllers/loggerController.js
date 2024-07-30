exports.loggerController  = async  (req,res) => {
    req.logger.warning('Alerta!')
    req.logger.error('error')
    res.send({status: 'success', message: 'Probando Logger!'});
}