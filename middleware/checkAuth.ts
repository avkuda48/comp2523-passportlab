import { Request, Response, NextFunction } from "express";
//I also saw something about changing a config file to fix the issues of ts
//not recognizing passport methods until runtime but i did not understand it
//actually i don't fully understand the type vs type at runtime issue very well in general.

/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}