// middlewares/role.middleware.js

import { ApiError } from "src/utils/APIerror.js";

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new ApiError(403, "Access denied", [
          `Required role(s): ${allowedRoles.join(", ")}`,
          `Current role: ${userRole || "none"}`
        ])
      );
    }

    next();
  };
};

export default checkRole;
