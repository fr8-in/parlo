import { useFrappeGetDoc } from 'frappe-react-sdk';
import { IndentItem } from './indentItem';
import { Indent } from '../../../lib/types/indent';

const IndentItemContainer = (props: any) => {
    const { name } = props
    const { data, error, isValidating, mutate } = useFrappeGetDoc<Indent>(
        'Indent',
        name
    );

    return (
        <IndentItem indentItem={data?.items || []} />
    )
}

export default IndentItemContainer
