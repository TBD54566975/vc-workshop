import { VerifiableCredential, PresentationExchange } from "@web5/credentials";
import { DidDhtMethod } from "@web5/dids";
import { loadDID, storeDID } from "./utils.js";

import pd from "./presentation-definition.json" assert { type: "json" };

    // STEP 0: Set filepath to use or store DID.
    const filename = "./did.json";
    let portableDID;


    //STEP 1: Check if user already has a DID
    const existingDID = await loadDID(filename);

    // STEP 2: If not, create a new DID and store it in a file.
    if(!existingDID) {
        // creates a DID using the DHT method and publishes the DID document to the DHT
        portableDID = await DidDhtMethod.create({ publish: true });

        console.log("DID:", portableDID.did);
        console.log("DID Document:", portableDID.didDocument);
        console.log("DIDDht:", portableDID);

        await storeDID(filename, portableDID);

    } else {
        portableDID = existingDID;
    }

    // STEP 3: Validate the presentation definition
    const validation = PresentationExchange.validateDefinition({
        presentationDefinition: pd
    });
    console.log(validation);


    // STEP 4: Create a verifiable credential
    const vc = await VerifiableCredential.create({
        type: 'WorkshopAttendeeCredential',
        issuer: portableDID.did,
        subject: portableDID.did,
        expirationDate: '2024-12-31T23:59:59Z',
        data: {
            "name": "Alice Smith",
            "location": "Amsterdam",
            "eventDate": "2024-02-29T00:00:00Z",
        }
    });

    console.log("VC:", vc);

    // STEP 5: Sign VC and get JWT.
    //sign with PortableDid
    const vc_jwt_attendee = await vc.sign({ did: portableDID });
    console.log("VC JWT:", vc_jwt_attendee);

    // STEP 5: [Optional] Store VC in a DWN.
