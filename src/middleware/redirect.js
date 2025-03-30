function authMiddleware(req, res, next) {
    if (!G_A.ga) { 
      req.session.redirectTo = req.originalUrl; // Store attempted route
      return res.redirect("/loginsignup"); // Redirect to login page
    }
    next(); // If logged in, continue to requested route
  }