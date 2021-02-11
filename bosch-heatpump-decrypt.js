const Encryption = require('./lib/encryption');

module.exports = function(RED) {
    function boschDecrypt(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.heatpump = RED.nodes.getNode(config.heatpump);
    
        if(node.heatpump.hasOwnProperty('credentials')
            && node.heatpump.hasOwnProperty('magic')
            && node.heatpump.credentials.hasOwnProperty('accessKey')
            && node.heatpump.credentials.hasOwnProperty('password')){
            
            node.encryption = new Encryption(node.heatpump.credentials.accessKey.replace(/-/g, ''), node.heatpump.credentials.password, node.heatpump.magic);
            node.hasConfig = true;
        }
        else{
            node.hasConfig = false;
        }
        
        node.on('input', function(msg){
            if(node.heatpump && node.hasConfig){
                msg.payload = node.encryption.decrypt(msg.payload).replace(/\0*$/g, '');
                node.send(msg);
            }
            else{
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("bosch-decrypt", boschDecrypt);
}