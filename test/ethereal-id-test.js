'use strict';

const EtherealId = require('../index');

module.exports['Generate and verify'] = test => {
    let secret1 = new EtherealId({
        secret: 'abc',
        hash: 'sha256'
    });

    let secret2 = new EtherealId({
        secret: 'abc',
        hash: 'sha256'
    });

    let mailboxId = '001122334455aabbccddeeff';
    let messageId = 'aabbccddeeff001122334455';
    let uid = 12345678;

    let msgid = secret1.get(mailboxId, messageId, uid);
    test.ok(/^[a-z0-9.-]+$/i.test(msgid));

    let result = secret2.validate(msgid);
    test.deepEqual(result, {
        mailboxId,
        messageId,
        uid
    });

    test.done();
};

module.exports['Invalid hash'] = test => {
    let secret1 = new EtherealId({
        secret: 'abc',
        hash: 'sha256'
    });

    let secret2 = new EtherealId({
        secret: 'abc',
        hash: 'md5'
    });

    let mailboxId = '001122334455aabbccddeeff';
    let messageId = 'aabbccddeeff001122334455';
    let uid = 12345678;

    let msgid = secret1.get(mailboxId, messageId, uid);
    test.ok(/^[a-z0-9.-]+$/i.test(msgid));

    let result = secret2.validate(msgid);
    test.equal(result, false);

    test.done();
};

module.exports['Invalid secret'] = test => {
    let secret1 = new EtherealId({
        secret: 'abc',
        hash: 'sha256'
    });

    let secret2 = new EtherealId({
        secret: 'def',
        hash: 'sha256'
    });

    let mailboxId = '001122334455aabbccddeeff';
    let messageId = 'aabbccddeeff001122334455';
    let uid = 12345678;

    let msgid = secret1.get(mailboxId, messageId, uid);
    test.ok(/^[a-z0-9.-]+$/i.test(msgid));

    let result = secret2.validate(msgid);
    test.equal(result, false);

    test.done();
};
