import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { DidDht } from "@web5/dids";
import { loadDID, storeDID } from "./utils.js";

import pd from "./presentation-definition.json" assert { type: "json" };

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
        console.log('attendeeDid', attendeeDid);
    }

    // STEP 2: Create a verifiable credential
    const vc = await VerifiableCredential.create({
        type: 'WorkshopAttendeeCredential',
        issuer: attendeeDid.uri,
        subject: attendeeDid.uri,
        expirationDate: '2024-12-31T23:59:59Z',
        data: {
            "name": "Jane Doe",
            "location": "Amsterdam",
            "conference": "DevWorld 2024",
            "eventDate": "2024-03-01T00:00:00Z",
            "issuerName": "Jane Doe",
        }
    });

    console.log("VC:", vc);

    // STEP 3: Sign VC and get JWT
    const vc_jwt_attendee = await vc.sign({ did: attendeeDid });
    console.log("VC JWT:", vc_jwt_attendee);

    // TODO: STEP 4: Examine VC: https://jwt.io/
    // TODO: STEP 5: Present VC: https://web5-vc.netlify.app/

