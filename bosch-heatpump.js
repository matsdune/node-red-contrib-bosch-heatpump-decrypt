module.exports = function(RED) {
    function boschHeatpumpNode(n) {
        RED.nodes.createNode(this, n);
        this.magic = n.magic;
    }
    RED.nodes.registerType("bosch-heatpump", boschHeatpumpNode,{
        credentials: {
            accessKey: {type:"text"},
            password: {type:"password"}
        }
    });
}