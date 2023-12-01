import React, { useState } from "react";
import { Button, Flex, Textarea } from "@mantine/core";
import { RootState } from "@parrot/store/reducer";
import { useSelector } from "react-redux";

export const CurrentTextView: React.FC = ({}) => {
    const mostRecentFile = useSelector((state: RootState) => state.main.mostRecentFile);
    const [content, setContent] = React.useState(mostRecentFile?.fileContent || "");
    const [loading, setLoading] = useState(false);
    
    return (
        <Flex direction="column" gap="sm">
            <Textarea
                label="Text to Convert"
                description="Text you want read back to you. Make any changes before clicking submit!"
                placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur interdum mollis tincidunt. Aenean ligula erat, faucibus vel pretium vel, condimentum a ligula. Proin pellentesque."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autosize
                minRows={16}
                maxRows={24}
            />
            <Button loading={loading} style={{width: "fit-content"}} onClick={() => {
                setLoading(true);
            }} color="green" variant="outline">Submit</Button>
        </Flex>
    );
};

export default CurrentTextView;
