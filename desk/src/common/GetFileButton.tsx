import { IconButton, Tooltip } from '@mui/material'
import { Upload } from 'antd'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { ReactNode } from 'react';


interface Props {
    onChange?: any
    children?: ReactNode | string;
}

const GetFileButton = (props: Props) => {
    const { onChange, children } = props
    let base64Str: string | null = null

    const getBase64 = (file: any) => {
        const reader = new FileReader()
        if (file) {
            reader.readAsBinaryString(file)
        }
        reader.onload = function () {
            // @ts-ignore
            const baseStr = btoa(reader.result);
          
            base64Str = baseStr;
        };
        return false
    }

    const fileUpload = (data: any) => {
        const file_name = data.file.name
        setTimeout(() => {
        onChange(data.file,file_name)
        }, 1000)
    }

    return ( 
        <Upload
            beforeUpload={getBase64}
            accept='image/*, application/pdf'
            fileList={[]}
            onChange={fileUpload}
        >
            {
                children ? children :
                    <Tooltip title="Click to select image">
                        <IconButton sx={{ bgcolor: "#EFF6FF", mt: -2 }}>
                            <CameraAltIcon color="info" />

                        </IconButton>
                    </Tooltip>

            }
        </Upload>
    )
}

export default GetFileButton
