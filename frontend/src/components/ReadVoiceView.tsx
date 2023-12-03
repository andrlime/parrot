import { Flex, InputDescription, InputLabel } from "@mantine/core";
import { RootState } from "@parrot/store/reducer";
import { IconFileMusic, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function base64ToBlob(base64: string, mimeType: string) {
    if(base64 == "") return;

    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], {type: mimeType});
}

export const ReadVoiceView: React.FC = ({}) => {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    const mostRecentFile = useSelector((state: RootState) => state.main.mostRecentFile);
    let audioBlob = null;
    if(mostRecentFile?.audioRaw) {
        audioBlob = base64ToBlob(mostRecentFile.audioRaw, "audio/mp3");
    }

    const formatTime = (t: number) => {
        return `${Math.floor(t/60)}:${`${t%60}`.padStart(2, "0")}`;
    }

    const changePlayPause = () => {
        const audio = audioRef.current;
        if(!audio) {
            return;
        }

        if (playing) {
            (audio as any).pause();
        } else {
            (audio as any).currentTime = 0;
            (audio as any).play();
        }
        
        if(mostRecentFile?.audioS3Key == "exists") {
            setPlaying(!playing);
        }
    }

    return (
        <Flex direction="column" gap="xs">
            <InputLabel>Text Readback
                <InputDescription style={{fontWeight: 400}}>The content of the PDF will be read back to you as an audio file.</InputDescription>
            </InputLabel>
            {audioBlob && <>
                <audio ref={audioRef} src={URL.createObjectURL(audioBlob)} controls />
            </>}
            <Flex gap="sm" justify="flex-start" align="center">
                <IconFileMusic stroke={1} style={{ 
                    color: mostRecentFile?.audioS3Key == "exists" ? 'var(--mantine-color-red-9)' : 'var(--mantine-color-gray-5)' }}/>  
                <div>{mostRecentFile?.audioRaw ? mostRecentFile.fileName : "AUDIO UNAVAILABLE"}</div>
                
            </Flex>
        </Flex>
    );
};

export default ReadVoiceView;
