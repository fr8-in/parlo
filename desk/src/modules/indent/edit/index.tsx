import { useFrappeGetDoc, useFrappeGetDocList } from "frappe-react-sdk";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../../../common/loading";
import { Indent } from "../../../lib/types/indent";
import CreateIndent from "../create";

const EditIndent = () => {
  const { indentId } = useParams();
  const [combinedData, setCombinedData] = useState({}); // State to store the combined data
  const { data:doc_data, error:doc_error , isLoading:doc_loading } =
    useFrappeGetDoc<Indent>("Indent", indentId);

  const { data:doc_list_data, error:doc_list_error  , isLoading:doc_list_loading } =
    useFrappeGetDocList<any>("Indent", {
      fields: [
        "rate_type",
        "rate_type.common_code",
        "rate_type.is_per_kg",
        "rate_type.is_per_case",
        "rate_type.tonnage",
        "rate_type.name"
      ],
      filters: [["name", "=", indentId]],
    });
    
    useEffect(() => {
      if (!doc_loading && !doc_list_loading) {
        const docListSingleData = !isEmpty(doc_list_data) ? { 
          rate_type:{
            common_code: doc_list_data[0]?.common_code ,
            common_name: doc_list_data[0]?.common_name ,
            is_per_case:  doc_list_data[0]?.is_per_case ,
            is_per_kg:  doc_list_data[0]?.is_per_kg ,
            name : doc_list_data[0]?.name
        }
      }
        : {}
        const combinedData = { ...doc_data, ...docListSingleData };
        setCombinedData(combinedData);
      }
    }, [doc_loading, doc_list_loading]);
  

  return (
    <>{doc_loading || doc_list_loading ? <Loading /> : <CreateIndent indentDetailData={combinedData} />}</>
  );
};

export default EditIndent;
