exports.loggerController  = async  (req,res) => {
    req.logger.fatal('TEST fatal!')
    req.logger.error('TEST error')
    req.logger.warning('TEST warning')
    req.logger.info('TEST info')
    req.logger.http('TEST http')
    req.logger.debug('TEST debug')
    res.send({status: 'TEST success', message: 'Probando Logger!'});
}