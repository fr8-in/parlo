import CustomMessageContainer from '../../../common/customMessageContainer'
import { TitleAndLabel } from '../../../common/titleAndLabel'

interface Props {
    open: boolean
    handleCancel: any
    chargesData: any
    onOpen: any
}

const ChargeDetailPreview = (props: Props) => {
    const { onOpen, open, chargesData, handleCancel } = props

    return (
        <div>
            <CustomMessageContainer
                key={0}
                title={"Charges detail"}
                onHide={handleCancel}
                onOpen={onOpen}
                button={null}
                footer={null} visible={open}
            >
                <div className="bg-slate-50 rounded-md mt-2 px-4">
                    <TitleAndLabel title={'Charges Type'} label={chargesData.charge_type} index={0} />
                </div>
                <div className="bg-slate-50 rounded-md mt-2 px-4">
                    <TitleAndLabel title={'Supplier Amount'} label={chargesData.amount} index={0} />
                </div>
                <div className="bg-slate-50 rounded-md mt-2 px-4">
                    <TitleAndLabel title={'Remarks'} label={chargesData.remarks} index={0} />
                </div>
            </CustomMessageContainer>
        </div>
    )
}

export default ChargeDetailPreview
