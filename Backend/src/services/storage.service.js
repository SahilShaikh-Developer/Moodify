const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")

const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

async function uploadFile({buffer, filename, folder = ""}){
    try {
        console.log("Uploading to ImageKit:", filename, folder);
        console.log("Public Key:", process.env.IMAGEKIT_PUBLIC_KEY);
        console.log("URL Endpoint:", process.env.IMAGEKIT_URL_ENDPOINT);
        
        const response = await client.files.upload({
            file: await toFile(buffer, filename), 
            fileName: filename,
            folder,
        })
        console.log("Upload success:", response.url);
        return response
    } catch (error) {
        console.error("ImageKit upload Error:", error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
        throw error
    }
}

module.exports = {uploadFile}