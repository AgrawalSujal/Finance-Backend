const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next();
        } catch (error) {
            if (error.errors) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed',
                    errors: errorMessages,
                });
            }
            next(error);
        }
    };
};

const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.query);
            req.query = validatedData;
            next();
        } catch (error) {
            if (error.errors) {
                const errorMessages = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    status: 'fail',
                    message: 'Query validation failed',
                    errors: errorMessages,
                });
            }
            next(error);
        }
    };
};

module.exports = { validate, validateQuery };