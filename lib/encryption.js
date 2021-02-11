const crypto = require('crypto');
const MD5    = (s, encoding) => crypto.createHash('md5').update(s).digest(encoding);

module.exports = class Encryption{
  constructor(accessKey, password, magic){
    this.key = this.generateKey(magic, accessKey, password);
  }

  generateKey(magicKey, id_key_uuid, privatePassword) {
    let magicBuffer = Buffer.from(magicKey, 'hex'),
      accessKeyBuffer = Buffer.from(id_key_uuid, 'utf8'),
      passwordBuffer = Buffer.from(privatePassword, 'utf8');

    return Buffer.concat([
      MD5( Buffer.concat([ accessKeyBuffer, magicBuffer ]) ),
      MD5( Buffer.concat([ magicBuffer, passwordBuffer ]) )
    ]);
  }
  
  decrypt(data) {
    var encrypted = Buffer.from(data, 'base64');
    var decipher  = crypto.createDecipheriv('aes-256-ecb', this.key, Buffer.alloc(0));
  
    decipher.setAutoPadding(false);
  
    // Add zero-padding?
    var paddingLength = encrypted.length % 8;
    if (paddingLength !== 0) {
      var padding = Buffer(paddingLength, 0);
      encrypted = Buffer.concat([ encrypted, padding ]);
    }
    return decipher.update(encrypted).toString() + decipher.final().toString();
  };
}
