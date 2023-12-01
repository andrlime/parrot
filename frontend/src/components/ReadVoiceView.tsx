import { Flex, InputDescription, InputLabel } from "@mantine/core";
import { IconFileMusic, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import React, { useState } from "react";

export const ReadVoiceView: React.FC = ({}) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(50);

    return (
        <Flex direction="column" gap="xs">
            <InputLabel>Text Readback
                <InputDescription style={{fontWeight: 400}}>The content of the PDF will be read back to you as an audio file.</InputDescription>
            </InputLabel>
            <div style={{ width: "60%", position: "relative" }}>
                <div style={{ padding: "2px", borderRadius: "1000px", backgroundColor: 'var(--mantine-color-gray-2)' }} />
                <div style={{ padding: "2px", borderRadius: "1000px", backgroundColor: 'var(--mantine-color-gray-5)', width: `${progress}%`, position: "absolute", top: 0 }} />
            </div>
            <Flex gap="sm" justify="flex-start" align="center">
                {!playing && <IconPlayerPlay onClick={() => setPlaying(!playing)} stroke={1} style={{ color: 'var(--mantine-color-blue-5)' }}/>}  
                {playing && <IconPlayerPause onClick={() => setPlaying(!playing)} stroke={1} style={{ color: 'var(--mantine-color-blue-5)' }}/>} 
                <IconFileMusic stroke={1} style={{ color: 'var(--mantine-color-red-9)' }}/>  
                <div>The file name will go here.mp3 <span style={{color: 'var(--mantine-color-gray-6)'}}>(1:23/4:56)</span></div>
            </Flex>
        </Flex>
    );
};

export default ReadVoiceView;
