module.exports = function(app)
{
    var messages = [];
    app.locals.getMessages = function getMessages() { return messages; };

    return function(req, res, next)
    {
        messages = [];
        res.flash = function(severity, message) {
            messages.push({ severity: severity, message: message });
        }
        next();
    }

};