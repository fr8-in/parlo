import {  useFrappeGetDocList } from 'frappe-react-sdk';
import { Indent } from '../../../lib/types/indent';
import { PodItem } from './podItem';



const PodItemContainer = (props: any) => {
    const { name } = props
    const { data, error, isValidating, mutate } = useFrappeGetDocList<Indent>(
        'Indent',
        {
          /** Fields to be fetched - Optional */
          fields: ["*"],
          filters: [['trip', '=', `${name}`]],
        }
      );
    return (
        <PodItem indentData={data || []} mutate={mutate}/>
    )
}

export default PodItemContainer
