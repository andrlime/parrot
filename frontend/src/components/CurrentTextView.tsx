import React, { useState } from "react";
import { Button, Flex, Textarea } from "@mantine/core";
import { RootState } from "@parrot/store/reducer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { set_active_audio, set_error_msg } from "@parrot/store/slice";

export const CurrentTextView: React.FC = ({}) => {
    const mostRecentFile = useSelector((state: RootState) => state.main.mostRecentFile);
    const content = mostRecentFile?.content || "";
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
    return (
        <Flex direction="column" gap="sm">
            <Textarea
                label="Text to Convert"
                description="Text you want read back to you."
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur interdum mollis tincidunt. Aenean ligula erat, faucibus vel pretium vel, condimentum a ligula. Proin pellentesque."
                value={content.toString()}
                autosize
                minRows={16}
                maxRows={24}
                readOnly
            />
            <Button disabled={!mostRecentFile?.awsTextKey} loading={loading} style={{width: "fit-content"}} onClick={() => {
                if(mostRecentFile?.awsJobId) {
                    setLoading(true);
                    axios.post(`https://dwlbwgi274dm46pucxpnqgu2uy0wjdux.lambda-url.us-east-2.on.aws/`, {
                        txtkey: mostRecentFile.awsTextKey
                    })
                    .then((_response) => {
                        axios.get(`https://m0bduuhs7l.execute-api.us-east-2.amazonaws.com/draft/download/${mostRecentFile.awsJobId}`)
                        .then((response2) => {
                            console.log(response2);
                            dispatch(set_active_audio({
                                lk: mostRecentFile.localKey,
                                ak: response2.data
                            }));
                            setLoading(false);
                        })
                    }).catch((err) => {
                        console.error(err);
                        dispatch(set_error_msg(`Failed to convert to audio due to ${err}`))
                        setLoading(false);
                    });
                }
            }} color="green" variant="outline">Submit</Button>
        </Flex>
    );
};

export default CurrentTextView;
