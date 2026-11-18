module.exports = function(role){
    return function(req, res, next) {
        try{
            if(!req.user){
                return res.status(401).send("Unauthorized")
            }

            if(req.user.role !== role){
                return res.status(403).send("Access denied")
            }

            return next()
        }catch(e){
            return res.status(401).send("Unauthorized")
        }
    }
}


