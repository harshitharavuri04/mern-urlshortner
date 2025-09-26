 export const printHelloWorld=(req,res)=>{
    try{
        const message="HELLO WORLD";
        console.log(message);
        res.status(200).json({
          message:"successfully printed the message",
          data:message
        });
    } catch(error){
        console.error("Error in printHelloWorld");
        res.status(500).json({
          error: error.message,
        });
    }
}
