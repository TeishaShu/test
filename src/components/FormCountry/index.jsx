import {
  Form,
  Select,
} from 'antd';

const { Option } = Select;

const FormCountry = props => {
  const {
    form,
    isLabel,
    isName,
    isList,
    isRules,
  } = props;

  return (
    <Form.Item
      label={isLabel}
      name={isName}
      rules={isRules}
    >
      <Select
        showSearch
        optionFilterProp="children"
        optionLabelProp="label"
        allowClear={true}
        filterOption={(input, option) =>
          option.showtext.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {isList.map(d => (
          <Option
            key={d.id}
            label={d.country_name_zh}
            text={d.id}
            showtext={`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
          >
            {`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
}

export default FormCountry;