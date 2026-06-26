// ── Role Guard: restrict routes by role ───────────────────────
// Usage: roleGuard('admin') or roleGuard('admin', 'seller')
const roleGuard = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Access denied. Required role: ${roles.join(' or ')}`
      );
    }
    next();
  };
};

module.exports = { roleGuard };