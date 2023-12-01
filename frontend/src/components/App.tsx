"use client";
import { Center, Flex, Group } from "@mantine/core";
import React from "react";
import useWindowSize from "@parrot/hooks/useWindowSize";
import UploadHistoryView from "@parrot/components/UploadHistoryView";
import ReadVoiceView from "@parrot/components/ReadVoiceView";
import CurrentTextView from "@parrot/components/CurrentTextView";
import FileUploadView from "@parrot/components/FileUploadView";
import { IconFeather } from "@tabler/icons-react";

export const App: React.FC = ({}) => {
    const windowSize: [number, number] = useWindowSize();
    const smallScreen = (windowSize[0] < 0.75*windowSize[1]) || windowSize[0] < 768;

    return (
        <div style={{padding: "1rem"}}>
            <Flex justify="center" align="center" gap="md">
                <IconFeather stroke={1} size={36} style={{ color: 'var(--mantine-color-red-6)' }}/>
                <p><span style={{fontWeight: 600}}>Parrot</span>: Convert PDF to Text and Audio</p>
            </Flex>
            <Flex
                gap="md"
                justify="center"
                align="flex-start"
                direction={smallScreen ? "column" : "row"}
                wrap="wrap"
                p="sm">
                    <Flex direction="column" gap="lg" p="md" style={{width: smallScreen ? "100%" : "40%"}}>
                        <FileUploadView />
                        <UploadHistoryView />
                    </Flex>
                    <Flex direction="column" gap="lg" p="md" style={{width: smallScreen ? "100%" : "50%"}}>
                        <CurrentTextView />
                        <ReadVoiceView />
                    </Flex>
            </Flex>
        </div>
    );
}


export default App;