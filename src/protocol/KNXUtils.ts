export const splitIP = (ip: string, name: string = 'ip'): RegExpMatchArray => {
    if (ip == null) {
        throw new Error(`${name} undefined`);
    }
    const m = ip.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
    if (m === null) {
        throw new Error(`Invalid ${name} format - ${ip}`);
    }
    return m;
};

export const validateKNXAddress = (address: string|number, isGroup: boolean = false): number => {
    if (typeof(address) === 'string') {
        const digits = address.split(/[./]/);
        if (digits.length < 2 || digits.length > 3) {
            throw new Error(`Invalid address format: ${address}`);
        }
        let count = 0;
        let newAddress = 0;
        for (let i = digits.length - 1; i >= 0; i--, count++) {
            const digit = Number(digits[i]);
            if (isNaN(digit) || (count > 1 && digit > 15) || (count === 0 && digit > 255)) {
                throw new Error(`Invalid digit at pos ${i} inside address: ${address}`);
            }
            if (count === 0) {
                newAddress = Number(digits[i]);
            } else if (count === 1) {
                newAddress = newAddress + (Number(digits[i]) << 8);
            } else {
                if (isGroup) {
                    newAddress = newAddress + (Number(digits[i]) << 11);
                } else {
                    newAddress = newAddress + (Number(digits[i]) << 12);
                }
            }
        }
        return newAddress;
    } else {
        const _address = Number(address);
        if (isNaN(_address) || _address < 0 || _address > 0xFFFF) {
            throw new Error(`Invalid address ${address}`);
        }
        return _address;
    }
};
