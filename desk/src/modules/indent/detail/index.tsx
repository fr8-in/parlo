import { Container, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import IndentCard from "../components/indentCard";
import { Indent } from "../../../lib/types/indent";
import TripTimeLine from "../../trip/components/tripTimeLine";
import IndentDetailStyledTab from "../components/indentDetailStyledTab";
import { get, isEmpty } from "lodash";
import { Empty } from "antd";
import { Loading } from "../../../common/loading";
import BackButton from "../../../common/backButton";
import constants from "../../../lib/constants";
import { EditOutlined } from "@ant-design/icons";

export const IndentDetail = () => {
  let { indentId } = useParams();

  const navigate = useNavigate()
  const { data, isLoading, mutate } = useFrappeGetDocList<Indent>("Indent", {
    fields: [
      "name",
      "creation",
      "confirmed_at",
      "owner",
      "idx",
      "series",
      "customer",
      "consignee",
      "weight",
      "cases",
      "customer_price",
      "id",
      "source",
      "destination",
      "rate_type",
      "lr_no",
      "workflow_state",
      "way_bill_no",
      "advance",
      "billable",
      "on_delivery",
      "add_charge",
      "reduce_charge",
      "received",
      "balance",
      "trip.truck",
      "confirmed_at",
      "delivered_at",
      "pod_received_at",
      "invoiced_at",
      "expiry_at",
    ],
    filters: [["name", "=", indentId]],
  });

  const indent_data = !isEmpty(data) ? data[0] : {};
  const isCreated = get(indent_data,'workflow_state',null) === constants.CREATED_STATUS
  const handleEditIndent = () =>{
    navigate(`/indent/edit/${indentId}`)
  }

  return (
    <div>
      <Paper>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
          padding={1}
        >
          <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
            <BackButton />
            <Typography variant="body1" fontWeight={700}>
              Indent Detail
            </Typography>
          </Stack>
          <Tooltip title="Edit Indent" placement="left" hidden={!isCreated}>
            <IconButton
              size="small"
              color="secondary"
              onClick={handleEditIndent}
              aria-label="delete"
            >
              <EditOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
      { isLoading ? <Loading/> : isEmpty(indent_data) ? (
        <Empty className="self-center" />
      ) : (
        <Container maxWidth="md">
        <Stack flexDirection={"column"} gap={1}>
            <Paper sx={{overflow:'auto'}}>
              <IndentCard
                hideItems
                elevation={false}
                mutate={mutate}
                hideLrEway={true}
                indent={indent_data}
                onSelect={undefined}
                key={indentId}
                selected={[]}
                showItems={() => undefined}
              />
              <Stack
                alignItems={"center"}
                p={1}
                mt={-2}
                flexDirection={"row"}
                justifyContent="space-between"
              >
                <Stack flexDirection={"column"}>
                {indent_data?.truck ? <p className="text-sm text-sky-600 font-semibold">
                    {indent_data?.truck}
                  </p> : null }
                </Stack>
                {/* <IconButton onClick={onClickCallIcon}>
                    <CallIcon color="secondary" />
                    </IconButton> */}
              </Stack>
            </Paper>
            <Paper sx={{ p: 1 , overflow:'auto'}}>
              <TripTimeLine
                indentDetail
                tripData={indent_data}
                mutate={mutate}
              />
            </Paper>
            <IndentDetailStyledTab
              indentData={indent_data}
              indentName={indentId}
              mutate={mutate}
            />
          </Stack>
        </Container>
      )}
    </div>
  );
};
