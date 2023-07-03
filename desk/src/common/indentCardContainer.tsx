import React from "react";
import { Indent } from "../lib/types/indent";
import { useFrappeGetDoc } from "frappe-react-sdk";
import IndentCard from "../modules/indent/components/indentCard";

interface Props {
    indentId: any
    hideLrEway?:boolean
}

const IndentCardContainer = (props: Props) => {

    const { indentId, hideLrEway } = props;
    const { data, error, isValidating, mutate } = useFrappeGetDoc<Indent>(
        'Indent',
        indentId

    );

    const indent: any = data

    return (
        <div className="mt-2 mb-6">
            <IndentCard mutate={mutate} hideLrEway={hideLrEway} indent={indent} onSelect={undefined} key={indentId} selected={[]} showItems={() => undefined} />
        </div>
    )
}

export default IndentCardContainer;



