const info = require('./info/index')
const attend = require('./attend/index')

exports.main = async (event, context) => {
    switch (event.type) {
        case 'info':
            return await info.main(event, context);
        case 'attend':
            return await attend.main(event, context);
    }
}