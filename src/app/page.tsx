import fs from 'fs';
import crypto from 'crypto';
import InkriptGuard from '@inkris-apps/inkripto';

// AES encryption function
function encryptWithAES(data: string, key: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

async function secureFileOperation(filePath: fs.PathOrFileDescriptor) {
    const inkriptGuard = new InkriptGuard();
    const key = crypto.randomBytes(32); // AES-256 key

    try {
        // Read data from the file
        const rawData = fs.readFileSync(filePath, 'utf8');

        // Encrypt the data with AES
        const encryptedData = encryptWithAES(rawData, key);

        // Write encrypted data to a new file
        const encryptedFilePath = `${filePath}.encrypted`;
        fs.writeFileSync(encryptedFilePath, encryptedData);
        console.log('Encrypted data has been written to:', encryptedFilePath);

        // Attempt to decrypt with InkriptGuard
        try {
            const decryptedData = await inkriptGuard.decrypt(encryptedData);
            const decryptedFilePath = `${filePath}.decrypted`;
            fs.writeFileSync(decryptedFilePath, decryptedData);
            console.log('Decrypted data has been written to:', decryptedFilePath);
            return decryptedData;
        } catch (error) {
            console.error('InkriptGuard failed to decrypt the data:', error);
        }

    } catch (error) {
        console.error('Error in secure file operation:', error);
        throw error;
    }
}

// Example usage
const filePath = 'C:\\Users\\user\\inkrisnpm\\MEGA-RECOVERYKEY.txt'; // Path to your file
secureFileOperation(filePath).then((result) => {
    console.log('File operation successful.');
}).catch((error) => {
    console.error('Error in secure file operation:', error);
});
