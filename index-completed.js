import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { DidDht } from "@web5/dids";
import { loadDID, storeDID } from "./utils.js";

import pd from "./presentation-definition.json" assert { type: "json" };

    // STEP 0: Set filepath to use or store DID.
    const filename = "./did.json";
    let attendee;

    //STEP 1: Check if user already has a DID, if not create a new DID and store it in a file.
    const existingDID = await loadDID(filename);

    if(!existingDID) {
        // creates a DID using the DHT method and publishes the DID document to the DHT
        attendee = await DidDht.create();

        console.log("DID:", attendee.uri);
        console.log("DID Document:", attendee.document);
        console.log("DIDDht:", attendee);

        await storeDID(filename, attendee);

    } else {

        attendee = await DidDht.import({ portableDid: existingDID });
        console.log('attendee', attendee);
    }

    // STEP 2: Create a verifiable credential
    const vc = await VerifiableCredential.create({
        type: 'WorkshopAttendeeCredential',
        issuer: attendee.uri,
        subject: attendee.uri,
        expirationDate: '2024-12-31T23:59:59Z',
        data: {
            "name": "Jane Doe",
            "location": "Amsterdam",
            "conference": "JSWorld 2024",
            "eventDate": "2024-03-01T00:00:00Z",
            "issuerName": "Jane Doe",
        }
    });

    console.log("VC:", vc);

    // STEP 3: Sign VC and get JWT.
    const vc_jwt_attendee = await vc.sign({ did: attendee });
    console.log("VC JWT:", vc_jwt_attendee);
