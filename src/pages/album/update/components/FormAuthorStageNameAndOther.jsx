import React, { useState, Fragment } from 'react';
import {
  Form,
  AutoComplete,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = AutoComplete;

const FormAuthorStageNameAndOther = props => {
  const {
    form,
    isName,
    isLabel,
    isList,
    setIsList,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;
  const [stageName, setStageName] = useState('');
  const searchOption = (keyword, idx) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/Author/author_stage', (res) => {
        setIsList(res);
        setIsFetching(false);
      }, [{ key: 'group', value: '1' }]);
    }, 200);
  }

  return (
    <Form.Item
      name={isName}
      label={isLabel}
      rules={[
        { required: true, message: '此欄位為必填' },
      ]}
    >
      <AutoComplete
        style={{ width: '100%' }}
        filterOption={false}
        allowClear={true}
        notFoundContent={isFetching ? <Spin size="small" /> : null}
        onSearch={(value) => {
          searchOption(value);
        }}
        onChange={(value, option) => {
          let newObj = {};

          if (!value) {
            setStageName('');
          }

          if (option && option.key) {
            setStageName(option.obj.stage_name);
          }
        }}
      >
        {
          (isList)
            ? (
              isList.map(d => (
                <Option
                  key={d.id}
                  value={d.stage_name}
                  obj={d}
                >
                  {`${d.stage_name} (${d.author_code})`}
                </Option>
              ))
            )
            : ([])
        }
      </AutoComplete>
    </Form.Item>
  );
}

export default FormAuthorStageNameAndOther;