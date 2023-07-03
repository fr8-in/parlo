import { Row, Col } from 'antd'

const LabelWithData = (props:any) => {
  const { label, labelSpan, data, dataSpan, margin_bottom } = props
  return (
    <Row gutter={6} className={margin_bottom ? 'mb10' : ''}>
      <Col xs={labelSpan || 12}>
        <label>{label}</label>
      </Col>
      <Col xs={dataSpan || 12}>
        {data}
      </Col>
    </Row>
  )
}
export default LabelWithData
