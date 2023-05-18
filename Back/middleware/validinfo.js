module.exports = (req, res, next) => {
    const { email, name, password } = req.body;
  
    function validEmail(userEmail) {
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      if (![email, name, password].every(Boolean)) {
        return res.status(401).json("Trūksta duomenų");
      } else if (!validEmail(email)) {
        return res.status(401).json("Neteisingas el. paštas");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(401).json(" Trūksta duomenų");
      } else if (!validEmail(email)) {
        return res.status(401).json("Neteisingas el. paštas");
      }
    }
  
    next();
  };