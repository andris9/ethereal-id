'use strict';

const crypto = require('crypto');

class EtherealId {
    constructor(options) {
        this.options = options || {};
        this.secret = this.options.secret || false;
        this.hash = this.options.hash || 'md5';
        this.hashLength = crypto.createHash(this.hash).update('test').digest().length;
    }

    get(mailboxId, messageId, uid) {
        let mailboxIdBuf = Buffer.from(mailboxId, 'hex');
        let messageIdBuf = Buffer.from(messageId, 'hex');
        let uidBuf = Buffer.alloc(4);
        uidBuf.writeUInt32BE(uid);
        let idBuf = Buffer.concat([mailboxIdBuf, messageIdBuf, uidBuf]);

        if (this.secret) {
            let hmac = crypto.createHmac(this.hash, this.secret);
            hmac.update(idBuf);
            let signature = hmac.digest();
            idBuf = Buffer.concat([idBuf, signature]);
        }

        // return urlsafe base64
        return idBuf.toString('base64').replace(/\//g, '.').replace(/\+/g, '-').replace(/[=]+/g, '');
    }

    validate(msgid) {
        if (/[^a-z0-9.-]/i.test(msgid)) {
            // includes invalid symbols
            return false;
        }

        msgid = msgid.replace(/\./g, '/').replace(/-/g, '+');
        let paddingLen = msgid.length % 4;
        if (paddingLen) {
            msgid += '='.repeat(paddingLen);
        }

        let idBuf = Buffer.from(msgid, 'base64');
        let expectedLen = 12 + 12 + 4 + (this.secret ? this.hashLength : 0);

        if (idBuf.length !== expectedLen) {
            // invalid length
            return false;
        }

        let mailboxIdBuf = idBuf.slice(0, 12);
        let messageIdBuf = idBuf.slice(12, 24);
        let uidBuf = idBuf.slice(24, 28);
        let hashBuf;

        if (this.secret) {
            // verify hash
            hashBuf = idBuf.slice(28);
            let hmac = crypto.createHmac(this.hash, this.secret);
            hmac.update(idBuf.slice(0, 28));
            let signature = hmac.digest('hex');
            if (signature !== hashBuf.toString('hex')) {
                // signature does not match
                return false;
            }
        }

        return {
            mailboxId: mailboxIdBuf.toString('hex'),
            messageId: messageIdBuf.toString('hex'),
            uid: uidBuf.readUInt32BE(0)
        };
    }
}

module.exports = EtherealId;
