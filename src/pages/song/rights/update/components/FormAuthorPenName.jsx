import {
  Form,
  Select,
} from 'antd';

const { Option } = Select;

const FormAuthorPenName = props => {
  const {
    form,
    isLabel,
    isName,
    isDefaultList,
    isList,
    authorCodeChange,
    setAuthorCodeChange,
  } = props;

  return (
    <Form.Item
      label={isLabel}
      name={isName}
      rules={[
        { required: true, message: '此欄位為必填' }
      ]}
    >
      <Select
        onFocus={() => {
          setAuthorCodeChange(true);
        }}
        options={
          (!authorCodeChange)
            ? (isDefaultList)
            : (isList)
        }
      />
    </Form.Item>
  );
}

export default FormAuthorPenName;