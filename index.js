import { VerifiableCredential } from "@web5/credentials";
import { DidDht } from "@web5/dids";
import { loadDID, storeDID } from "./utils.js";

    // STEP 0: Set filepath to use or store DID
    const filename = "./did.json";
    let attendeeDid;

    //STEP 1: Creates and stores new DID if one doesn't exist
    const existingDID = await loadDID(filename);

    if(!existingDID) {
        // creates a DID
        attendeeDid = await DidDht.create({ 
            options:{ publish: true }
        }); 

        console.log("DID:", attendeeDid.uri);
        console.log("DID Document:", attendeeDid.document);
        console.log("DIDDht:", attendeeDid);

        await storeDID(filename, attendeeDid);

    } else {
        attendeeDid = await DidDht.import({ portableDid: existingDID });
        console.log('attendee', attendeeDid);
    }

    // TODO: STEP 2: Create a verifiable credential



    // TODO: STEP 3: Sign VC with DID and get JWT



    // TODO: STEP 4: Examine VC: https://jwt.io/
    // TODO: STEP 5: Present VC: https://web5-vc.netlify.app/
