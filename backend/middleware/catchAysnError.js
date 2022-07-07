module.exports =(thefun)=>(req,res,next)=>{
  Promise.resolve(thefun(req,res,next)).catch(next);
};