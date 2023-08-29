import { Button, useMediaQuery, useTheme } from "@mui/material";
import { Modal } from "antd";
import { useWindowSize } from "../../../lib/hooks";
import { useState } from "react";
import { Indent } from "../../../lib/types/indent";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from "react-router-dom";
import CreateIndent from "../../indent/create";
import OpenIndent from "../../indent/components/openIndent";

interface SelectIndentProps {
    open: boolean,
    handleCancel: () => void
    onChange: Function
    tripId?: string
    selected: {
        indents: Array<Indent>
        indent_names: Array<string>
    }
}
type Type =  'add' | 'create'

const SelectIndent = (props: SelectIndentProps) => {

    const { open, handleCancel, onChange, selected, tripId } = props
    const [state, setState] = useState([])
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const common = { maxWidth: 1200, width: '100%', margin: '0 auto' }
    const desktop = { ...common, top: 20 }
    const mobile = { ...common, top: 0, borderRadius: 0, paddingBottom: 0 }
    const { height } = useWindowSize()
    const maxHeight = height - 110
    const navigate = useNavigate()
    const [type, setType] = useState<Type>('add')

    const toggleType = () => setType((prev:Type)=>prev === 'add' ? 'create' : 'add')

    const onChangeIndent = (indent: any) => {
        setState(indent)
    }

    const onCreateIndent = (indent: any) => {
        onChange([indent])
        handleCancel()
    }

    const onAdd = () => {
        onChange(state)
        handleCancel()
    }

    const handleCreateIndent = () => {
        navigate(`/indent/create/${tripId}`)
    }

    return (
        <>
            <Modal
                open={open}
                title={
                    <div className="flex justify-between items-center">
                        <p>{type === 'add' ? 'Select Indent' : 'Create Indent'}</p>
                        {tripId ? <Button
                            color='secondary'
                            size='small'
                            variant='contained'
                            sx={{ borderRadius: 40, px: 1.5, marginRight: 3 }}
                            startIcon={<AddOutlinedIcon />}
                            onClick={handleCreateIndent}
                        >
                            Indent
                        </Button>
                            : <Button size="small" variant="outlined" color="secondary" sx={{ borderRadius: 40, px: 1.5, marginRight: 3 }} onClick={toggleType}>{type === 'add' ? 'Create Indent' : 'Add Indent'}</Button>}
                    </div>
                }
                footer={null}
                onCancel={handleCancel}
                className="mobile_overlay"
                style={isMobile ? mobile : desktop}
                width={isMobile ? '100%' : '56%'}
            >
                <div style={{ maxHeight, overflow: 'auto' }}>
                    {type === 'add' ? 
                        <OpenIndent isSelectList={true} onChange={onChangeIndent} selected={selected} /> 
                        : <CreateIndent onCreateIndent={onCreateIndent} />}
                </div>
                {type === 'add' ? 
                <div className="pt-2 text-right">
                    <Button variant="contained" disabled={state?.length == 0} color="secondary" sx={{ borderRadius: 40, px: 1.5, marginRight: 2 }} onClick={onAdd}>Add</Button>
                </div> : null }
            </Modal>
        </>
    )
}

export default SelectIndent;
