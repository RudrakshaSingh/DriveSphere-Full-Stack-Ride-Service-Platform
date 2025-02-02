const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const errorHandler = (err, req, res, next) => {
   if (err instanceof ApiError) {
      if (process.env.NODE_ENV === "development") {
         console.error(err.stack);
      }
      return res.status(err.statusCode).json(err.toJSON());
   }

   console.error(err.stack);
   return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
};

module.exports = errorHandler;