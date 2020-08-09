function hash_password(pass, salt, time, mem, hashLen, parallelism, secret, ad, type) {
    if (!pass || !salt) return false;
    return new Promise(async (resolve) => {
        time = time || 1;
        mem = mem || 1024;
        hashLen = hashLen || hashLen;
        parallelism = parallelism || 1
        secret = secret || new Uint8Array([]);
        ad = ad || new Uint8Array([]);
        
        if (type == "2i") type = argon2.ArgonType.Argon2i;
        else type = argon2.ArgonType.Argon2d;
    
        argon2.hash({
            pass: pass,
            salt: salt,
            time: time,
            mem: mem,
            hashLen: hashLen,
            parallelism: parallelism,
            secret: secret,
            ad: ad,
            type: type
        }).then((res) => resolve(res)).catch((err) => console.error(err.message));

        return resolve(false);
    });
}

function generate_bip39(entropy) {
    const hashLength = entropy.length;
    const bytes = Math.floor(hashLength / 32);

    var entropies = [];
    for (var i = 0; i < bytes + 1; i++) entropies.push(entropy.substr(i * 32, 32));

    if (entropies[entropies.length - 1].length < 32) {
        var hex = entropies[entropies.length - 1];
        for (var i = 0; i < (32 - entropies[entropies.length - 1].length); i++) hex += '0';
        
        entropies[entropies.length - 1] = hex;
    }

    var mnemonics = [];
    for (var i = 0; i < entropies.length; i++) {
        const mnemonic = bip39.entropyToMnemonic(entropies[i]);
        console.log(mnemonic);
        mnemonics = mnemonics.concat(mnemonic.split(" "));
    } return mnemonics.join(" ");
}

function bip39_to_password(mnemonic) {
    const arr = mnemonic.split(" ");
    const bytes = Math.floor(arr.length / 12);

    var mnemonics = [];
    for (var i = 0; i < bytes; i++) {
        var m = [];
        for (var j = 0; j < 12; j++) m.push(arr[(i * 12) + j]);
        console.log(m);
        mnemonics.push(m.join(" "));
    }

    var entropies = [];
    for (var i = 0; i < mnemonics.length; i++) entropies.push(bip39.mnemonicToEntropy(mnemonics[i]));

    const entropy = entropies.join("");
    return hexToStr(entropy);
}


// String functionality

function strToHex(string) {
    const str = string.split("");
    var res = '';

    for (var i = 0; i < str.length; i++) res += string.charCodeAt(i).toString(16);
    return res;
}

function hexToStr(hex) {
    const str = hex.toString();
    var res = '';

    for (var i = 0; i < str.length; i += 2) res += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    return res;
}