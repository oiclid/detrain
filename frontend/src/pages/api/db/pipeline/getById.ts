import connect from '@/database/connect';
import { NextApiRequest, NextApiResponse } from 'next';
import Pipeline from "@/database/models/pipeline";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const {
            _id
        } = req.body;
        if (_id) {
        
            try {
                let pl = await Pipeline.findById(_id);
                return res.status(200).send(pl);
            } catch (error) {
                console.log(error)
                return res.status(500).send(error.message);
            }
        } else {
            res.status(422).send('data_incomplete');
        }
    } else {
        res.status(422).send('req_method_not_supported');
    }
};

export default connect(handler);