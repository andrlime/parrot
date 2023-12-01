"use client";
import { Group, rem } from "@mantine/core";
import { Dropzone, DropzoneProps, FileWithPath, PDF_MIME_TYPE } from "@mantine/dropzone";
import { upload_new_file } from "@parrot/store/slice";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import React, { useReducer, useState } from "react";
import { useDispatch } from "react-redux";

export default function FileUploadView(props: Partial<DropzoneProps>) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const upload = (files: FileWithPath[]) => {
        setLoading(true);
        for(let file of files) {
            file.text().then((res) => {
                // add to global state
                dispatch(upload_new_file({
                    fileName: file.name,
                    fileContent: res
                }));
            });
        }
        setLoading(false);
    }

    return (
        <Dropzone
            onDrop={upload}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={30 * 1024 ** 2}
            accept={PDF_MIME_TYPE}
            style={{border: "0.5px dashed black", borderRadius: "16px"}}
            loading={loading}
            {...props}
            >
            <Group justify="center" gap="xl" mih={400} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                <IconUpload
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                    stroke={1}
                />
                </Dropzone.Accept>
                <Dropzone.Reject>
                <IconX
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                    stroke={1}
                />
                </Dropzone.Reject>
                <Dropzone.Idle>
                <IconPhoto
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                    stroke={1}
                />
                </Dropzone.Idle>

                <div>
                    <p>Upload a PDF!</p>
                </div>
            </Group>
        </Dropzone>
    );
};
