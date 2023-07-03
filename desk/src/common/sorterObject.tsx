import util from '../lib/utils'

const sorterObject = (field: string, sorter:any, setSorter:any) => ({
    sorter: (_: any, __: any, order: any) => {
        setSorter(field, util.getOrderBy(order))
        return 0
    },
    onHeaderCell: (column: any) => ({
        onClick: () => {
            if ((sorter.field === field && sorter.order === 'desc')) {
                setSorter(field, undefined)
            }
        }
    }),
})

export default sorterObject