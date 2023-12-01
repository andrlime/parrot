import { Flex } from "@mantine/core";
import { RootState } from "@parrot/store/reducer";
import { IconDeviceSpeaker, IconEdit, IconFileMusic, IconTrash } from "@tabler/icons-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

interface ISingleFile {
    filename: string;
    keyname: string;
};

const SingleFile: React.FC<ISingleFile> = ({filename, keyname}) => {
    return (
        <Flex gap="md" p="xs" justify="space-between" align="center">
            <Flex gap="md" justify="center" align="center">
                <IconFileMusic stroke={1} style={{ color: 'var(--mantine-color-red-9)' }}/>
                <div style={{fontWeight: 400}}>{filename}</div>
                <div style={{fontWeight: 400, color: 'var(--mantine-color-gray-5)'}}>({keyname})</div>
            </Flex>

            <Flex gap="md" justify="center" align="center">
                <IconDeviceSpeaker onClick={() => {

                }} stroke={1} style={{ color: 'var(--mantine-color-blue-9)' }}/>
                <IconEdit onClick={() => {

                }} stroke={1} style={{ color: 'var(--mantine-color-green-9)' }}/>
                <IconTrash onClick={() => {

                }} stroke={1} style={{ color: 'var(--mantine-color-red-9)' }}/>
            </Flex>
        </Flex>
    );
}

export const UploadHistoryView: React.FC = ({}) => {
    const allFiles = useSelector((state: RootState) => state.main.fileHistory);

    return (
        <Flex style={{border: "0.5px solid black", borderRadius: "16px"}} p="xs" gap="xs" direction="column-reverse">
            {allFiles && allFiles.map((single_file, index) => (
                <SingleFile key={`file_${index}`} filename={single_file.fileName} keyname={single_file.awsS3Key || "xxxx"} />
            ))}
            {
                !allFiles && <div style={{fontWeight: 400}}>Upload a file to get started!</div>
            }
        </Flex>
    );
};

export default UploadHistoryView;
