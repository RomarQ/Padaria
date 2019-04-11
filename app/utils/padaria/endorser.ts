import { queryNode, queryAPI, QueryTypes } from './rpc';
import utils from './utils';
import crypto, { Prefix } from './crypto';

import {
    EndorderInterface,
    CompletedEndorsingFromServer,
    CompletedEndorsing,
    IncomingEndorsings,
    IncomingEndorsingsFromServer,
    EndorsingRight,
} from './endorser.d';

const self:EndorderInterface = {
    //
    // States
    //
    endorsedBlocks: [],
    //
    // Functions
    //
    getCompletedEndorsings: async (pkh:string):Promise<CompletedEndorsing[]> => {
        try {
            const res = await queryAPI(`/bakings_endorsement/${pkh}`, QueryTypes.GET) as CompletedEndorsingFromServer[];

            return res.reduce((prev, cur, i):any => {
                if(!cur) return;
                
                if(!cur.timestamp) {
                    prev.push({
                        rewards: "0ꜩ",
                        level: cur.level,
                        lr_nslot: cur.lr_nslot
                    });
                } else {
                    prev.push({
                        rewards: `${((cur.lr_nslot*2)/(cur.priority+1)).toLocaleString('fullwide', {maximumFractionDigits:2})}ꜩ`,
                        level: cur.level,
                        cycle: cur.cycle,
                        priority: cur.priority,
                        lr_nslot: cur.lr_nslot,
                        timestamp: cur.timestamp
                    });
                }

                return prev;
            }, []);

        } catch(e) { console.error("Not able to get Completed Endorsings."); }
    },
    getIncomingEndorsings: async (pkh:string):Promise<IncomingEndorsings> => {
        try {
            const res = await queryNode(`/incoming_endorsings?delegate=${pkh}`, QueryTypes.GET) as IncomingEndorsingsFromServer;
            const cycle = res.current_cycle;

            let endorsings:EndorsingRight[] = [];

            endorsings = res.endorsings.reduce((prev, cur, i):any => {
                if(!cur || cur.length == 0) { return prev; };
                
                cur.map(obj => {
                    if(obj.estimated_time && new Date(obj.estimated_time) > new Date()) {
                        prev.push({ cycle: cycle+i, ...obj });
                    }
                });

                return prev;
            }, endorsings);

            return {
                hasData: true,
                cycle,
                endorsings
            };
        } catch(e) { console.error("Not able to get Incoming Endorsings."); }
    },
    run: async (keys, head) => {
        const { hash, header: { level } } = head;
        try {
            if (self.endorsedBlocks.indexOf(head.header.level) < 0) {
                const endorsingRight = await queryNode(`/chains/main/blocks/head/helpers/endorsing_rights?delegate=${keys.pkh}&level=${level}`, QueryTypes.GET);
                console.log(endorsingRight)
                if(!Array.isArray(endorsingRight)) {
                    console.error("Not able to get Endorsing Rights :(");
                    return;
                }

                if (self.endorsedBlocks.indexOf(level) < 0) {

                    self.endorsedBlocks.push(level);

                    if (endorsingRight.length > 0) {
                        console.log(`Endorsing block [ ${hash} ] on level ${level}...`);

                        const endorse = await self.endorse(keys, head, endorsingRight[0].slots);

                        if(endorse) console.log("Endorsing complete!", endorse);
                        else console.warn("Failed Endorsing :(");
                    }
                }
            }
        }
        catch(e) { console.error(e); };
    },
    endorse: async (keys, head, slots) => {
        let operation = {
            "branch": head.hash,
            "contents" : [
              {          
                "kind" : "endorsement",
                "level" : head.header.level,
              }
            ]
        } as any;

        const forgedOperation = await queryNode(`/chains/${head.chain_id}/blocks/${head.hash}/helpers/forge/operations`, QueryTypes.POST, operation) as string;

        const signed = crypto.sign(forgedOperation, keys.sk, crypto.mergeBuffer(utils.watermark.endorsement, crypto.b58decode(head.chain_id, Prefix.chain_id)));
        
        // Forge Operation cannot contain protocol field, so it needs to be added here instead.
        operation.protocol = head.protocol;
        operation.signature = signed.edsig;

        //const res = await queryNode(`/chains/${head.chain_id}/blocks/${head.hash}/helpers/preapply/operations`, QueryTypes.POST,  [operation]);
        //console.log(res);

        return queryNode('/injection/operation?async=true', QueryTypes.POST, signed.signedBytes);
    }
};

export default self;