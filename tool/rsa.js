const NodeRSA = require('node-rsa');

/**
 * 
 * rsa加密验证 
 */
exports.initClientKey = (session) => {
    // 生成新的512位长度密钥
    const clientKey = new NodeRSA({ b: 512 });
    clientKey.setOptions({encryptionScheme: 'pkcs1'});
    session.RSA_PUBLIC_KEY = clientKey.exportKey('public');
    session.RSA_PRIVATE_KEY = clientKey.exportKey('private');
}

exports.getKey = (session) => {
    return session.RSA_PUBLIC_KEY;
}

exports.decrypKey = (session, encriptStr) => {
    const myDecrypter = new NodeRSA({b: 512 });
    myDecrypter.setOptions({encryptionScheme: 'pkcs1'});
    const key = session.RSA_PRIVATE_KEY;
    myDecrypter.importKey(key);
    return myDecrypter.decrypt(encriptStr, 'utf8');
}


