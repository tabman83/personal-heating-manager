module.exports = HeaterController;

function HeaterController() { }

HeaterController.prototype = {
	
    setHeater: function (request, reply) {
		console.log(request.params.rowkey);
		/*
		if(error) {
			reply(error); //.code(500)
		} else {
			reply({ message : "Item deleted"})
		}*/
		reply({ 
			message: 'Item deleted'
		});
    },	
    
	getHeater: function (request, reply) {
		reply({
			status: true
		});
    }
}