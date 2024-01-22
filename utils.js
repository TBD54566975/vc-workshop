import fs from 'fs/promises'

export async function loadDID(filename) {
  try {
    const data = await fs.readFile(filename, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading from file:', error)
    return false;
  }
}

export async function storeDID(filename, did) {
    try {
        await fs.writeFile(filename, JSON.stringify(did, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to file:', error)
        return false;
    }
}