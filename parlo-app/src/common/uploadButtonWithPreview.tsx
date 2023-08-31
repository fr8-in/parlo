import { CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useShowHide } from '../lib/hooks'
import GetFileButton from './GetFileButton'
import { CancelRounded } from "@mui/icons-material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useFrappeDeleteDoc, useFrappeFileUpload, useFrappeGetDocList } from "frappe-react-sdk";
import { message } from 'antd';
import { isEmpty } from 'lodash';


interface UploadButtonWithPreviewProps {
    lr_no?:any
    eway_no?:any
    type?: 'Lr' | 'Eway'
}

const UploadButtonWithPreview = (props:UploadButtonWithPreviewProps) => {
    const lr_no = props?.lr_no
    const initialShow = {
        showPreview: false
    }

    const { visible, onHide, onShow } = useShowHide(initialShow)

    const { upload  , loading  } = useFrappeFileUpload()
    const { deleteDoc, loading:isDeleting } = useFrappeDeleteDoc();
    
    const initial_state = {
        file: null,
        fileName: null,
        base64: ""
    }
    const [state, setState] = useState(initial_state)

    const { data :file_data , isValidating, isError , mutate } = useFrappeGetDocList('File', {
    filters: {
      attached_to_doctype: 'Lr',
      attached_to_name: lr_no,
    },
    fields: ['name', 'file_name', 'file_url'],
  });

  useEffect(()=>{
    if(!isValidating && !isEmpty(file_data)){
        setState({ ...state , 
            file : file_data[0].file_url ,
            fileName : file_data[0].name ,
        })
    }
  },[isValidating])

    const onFileChange = (file: any, fileName: any,base64:string) => {

        const fileArgs = {
            "isPrivate": false,
            "doctype": "Lr",
            "docname":lr_no,
            "fieldname": "file",
            "folder": "Home",
            "file_url": `/private/files/${fileName}`
        }

        upload(file, fileArgs)
            .then((result) => {
                message.success("UPLOADED SUCCESSFULLY")
                mutate()
                // Retrieve the base64 data and generate thumbnail after successful upload
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    const base64Data = (e.target as FileReader).result as string || ''
                    console.log('base64Data :', base64Data);
                  setState({...state , base64:base64Data})
                };
                reader.readAsDataURL(file);
            })
            .catch(error => message.error(error?.message))

    }
    
      
    const onDeleteImage = async () => {
            await deleteDoc('File', state.fileName).then(
                (result:any) => {
                    message.success("File Deleted SuccessFully")
                    mutate()
                    setState(initial_state)
                }
            ).catch( error => {
                mutate()
                message.error(error?.message)
            })
    }

    return (
        <>
        { isValidating || loading  || isDeleting? 
        <CircularProgress size={40} color="secondary" />
        :
  
        <div>

            {state.file ? (
                <div className='mb-2 -mt-5'>
                    {
                        <div className='relative top-5  right-5'>
                            <IconButton onClick={onDeleteImage}>
                                <CancelRounded fontSize='medium' />
                            </IconButton>
                        </div>
                    }
                    <div className='image'>
                        <div className={`image-prev`}>

                            <picture className='cursor-pointer' onClick={() => onShow("showPreview")}>
                                <img width={70} alt="Error in loading image!" src={`https://derpnext.digitify.app${state.file}`} className="mt-1" />
                            </picture>
                        </div>
                    </div>
                </div>
            ) : (
                <GetFileButton onChange={onFileChange} >
                    <Tooltip title="Click to add image">
                        <div className=" w-12 h-12 border-dashed flex flex-col justify-center items-center cursor-pointer rounded-md border border-slate-300  margin-2 mb-6 ">
                            <div className="m-auto flex flex-col items-center">
                                <IconButton
                                    sx={{ paddingBottom: 0, marginTop: 1 }}
                                    size="large"
                                >
                                    <InsertPhotoIcon color="secondary" fontSize="small" />
                                </IconButton>
                                <p
                                    className="text-[7px] font-semibold -mt-1"
                                    style={{ color: "#0093FF" }}
                                >
                                    Add Image
                                </p>
                            </div>
                        </div>
                    </Tooltip>
                </GetFileButton>
            )}
        </div>
              }
        </>
    )
}

export default UploadButtonWithPreview