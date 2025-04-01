function authMiddleware(req, res, next) {
    if (!G_A.ga) { 
      req.session.redirectTo = req.originalUrl; 
      return res.redirect("/loginsignup");
    }
    next();
  }
