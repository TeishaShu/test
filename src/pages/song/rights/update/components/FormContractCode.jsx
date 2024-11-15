import {
  Form,
  AutoComplete,
} from 'antd';

const { Option } = AutoComplete;

const FormContractCode = props => {
  const {
    form,
    isLabel,
    isName,
    isDisabled,
    isList,
    convertToContractContent,
  } = props;

  return (
    <Form.Item
      label={isLabel}
      name={isName}
      rules={[
        { required: true, message: '此欄位為必填' }
      ]}
    >
      <AutoComplete
        disabled={isDisabled}
        style={{ width: '100%' }}
        filterOption={false}
        allowClear={true}
        filterOption={(input, option) =>
          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={(value, option) => {
          if (option) {
            convertToContractContent(option.obj);
          }
        }}
      >
        {
          isList.map((elem) => (
            <Option
              key={elem.contract_code}
              value={elem.contract_code}
              obj={elem}
            >
              {elem.contract_code}
            </Option>
          ))
        }
      </AutoComplete>
    </Form.Item>
  )
};

export default FormContractCode;