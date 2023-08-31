import {  useFrappeGetDocList } from 'frappe-react-sdk';
import { Indent } from "../../../lib/types/indent";
import { useEffect } from 'react';
import IndentTable from '../../indent/components/indentTable';

interface Props{
  name:any
  indentUpdate?: any
}
const TripItemContainer = (props: Props) => {
    const { name, indentUpdate} = props
    const { data, mutate, isLoading } = useFrappeGetDocList<Indent>(
        'Indent',
        {
          fields: ["*"],
          filters: [['trip', '=', `${name}`]],
        }
      );

      useEffect(() => {
        if(indentUpdate){
          mutate()
        }
      },[indentUpdate])
    return (
        <>
            <IndentTable mutate={mutate} tabKey='true' data={data} loading={isLoading} />
        </>
    )
}

export default TripItemContainer
