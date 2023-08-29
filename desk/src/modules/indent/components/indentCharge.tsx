
import { Button, TableHead, TableRow, Table, TableContainer, TableCell, TableBody, Card } from "@mui/material";
import { AddCharge } from "./addCharge";
import { useShowHide } from "../../../lib/hooks";

export const IndentCharge = (props: any) => {
    const { indentCharges } = props

    const initialShow = { addCharge: false }
    const { visible, onShow, onHide } = useShowHide(initialShow);

    return (
        indentCharges?.length == 0 ? null : (
            <>
                <Card sx={{ maxWidth: 500, padding: 2, margin: 2 }} title="Items" >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                        <h3 style={{ padding: 0, margin: 0 }}>Charges</h3>
                        <Button sx={{ padding: 0, margin: 0 }} variant='outlined' onClick={() => onShow('addCharge')}>Add</Button>
                    </div>

                    <TableContainer >
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Type</TableCell>
                                    <TableCell align="left">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {indentCharges.map((item: any) => {
                                    return (
                                        <TableRow key={item.name} >
                                            <TableCell align="left">{item?.charge_type}</TableCell>
                                            <TableCell align="left">{item?.amount}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>

                    </TableContainer>
                </Card>

                {
                    visible?.addCharge ? <AddCharge visible={visible?.addCharge} onHide={onHide} /> : null
                }
            </>
        )
    )
}
