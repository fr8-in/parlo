
interface Props {
    /** Send how much blank space required
     * @default 10px
     */
    space?: number
}
/**
 * blank space as required
 * @param props Refer interface
 * @returns return div JSX
 */
const BlankSpace = (props: Props) => {
    const { space = 10 } = props;
    return <div className="block w-full" style={{ paddingBottom: space }} />;
};

export default BlankSpace
